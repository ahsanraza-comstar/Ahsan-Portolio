import re
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import verify_password, create_access_token
from app.core.config import settings
from app.api.deps import get_current_admin
from app.schemas.schemas import Token, CredentialsUpdate
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter(tags=["auth"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != settings.ADMIN_EMAIL:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not verify_password(form_data.password, _hash_admin_password()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(data={"sub": settings.ADMIN_EMAIL})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
async def get_me(current_user=Depends(get_current_admin)):
    return {"email": settings.ADMIN_EMAIL, "role": "admin"}


@router.put("/credentials", dependencies=[Depends(get_current_admin)])
async def update_credentials(data: CredentialsUpdate):
    if not verify_password(data.current_password, _hash_admin_password()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Current password is incorrect")

    new_email    = data.new_email    or settings.ADMIN_EMAIL
    new_password = data.new_password or settings.ADMIN_PASSWORD

    # Persist to .env so changes survive a restart
    _set_env_var("ADMIN_EMAIL",    new_email)
    if data.new_password:
        _set_env_var("ADMIN_PASSWORD", new_password)

    # Apply to running process immediately
    settings.ADMIN_EMAIL    = new_email
    settings.ADMIN_PASSWORD = new_password

    # Bust the cached password hash
    if hasattr(_hash_admin_password, "_cached"):
        del _hash_admin_password._cached

    return {"email": settings.ADMIN_EMAIL}


def _set_env_var(key: str, value: str):
    env_path = ".env"
    try:
        with open(env_path, "r") as f:
            content = f.read()
        new_content = re.sub(rf"^{key}=.*$", f"{key}={value}", content, flags=re.MULTILINE)
        if key not in new_content:
            new_content += f"\n{key}={value}"
        with open(env_path, "w") as f:
            f.write(new_content)
    except Exception:
        pass  # Non-fatal; in-memory update already applied


def _hash_admin_password():
    from app.core.security import get_password_hash
    if not hasattr(_hash_admin_password, "_cached"):
        _hash_admin_password._cached = get_password_hash(settings.ADMIN_PASSWORD)
    return _hash_admin_password._cached
