import uuid
import io
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_current_admin
from app.core.database import get_db
from app.models.models import Upload

router = APIRouter(tags=["upload"])

ALLOWED = {
    "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
IMAGE_TYPES   = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE      = 10 * 1024 * 1024   # 10 MB raw upload limit
MAX_DIMENSION = 1400               # px — longest edge capped here
JPEG_QUALITY  = 82                 # good balance of quality vs file size


@router.post("", dependencies=[Depends(get_current_admin)])
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type not in ALLOWED:
        raise HTTPException(status_code=400, detail="File type not allowed")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10 MB)")

    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else "bin"
    filename     = f"{uuid.uuid4().hex}.{ext}"
    out_content  = content
    out_type     = file.content_type or "application/octet-stream"

    # Images — resize + compress with Pillow (non-images are stored as-is)
    if file.content_type in IMAGE_TYPES:
        try:
            from PIL import Image, ImageOps

            img = Image.open(io.BytesIO(content))
            img = ImageOps.exif_transpose(img)  # fix EXIF orientation

            output_format, output_ext, out_type = "JPEG", "jpg", "image/jpeg"
            if file.content_type == "image/png":
                output_format, output_ext, out_type = "PNG", "png", "image/png"
                if img.mode in ("RGBA", "LA", "P"):
                    bg = Image.new("RGBA", img.size, (10, 10, 15, 255))
                    img = img.convert("RGBA")
                    bg.paste(img, mask=img.split()[3])
                    img = bg.convert("RGB")
            elif img.mode not in ("RGB", "L"):
                img = img.convert("RGB")

            w, h = img.size
            if max(w, h) > MAX_DIMENSION:
                scale = MAX_DIMENSION / max(w, h)
                img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

            save_kwargs = {"optimize": True}
            if output_format == "JPEG":
                save_kwargs["quality"] = JPEG_QUALITY
                save_kwargs["progressive"] = True

            buf = io.BytesIO()
            img.save(buf, format=output_format, **save_kwargs)
            out_content = buf.getvalue()
            filename = f"{uuid.uuid4().hex}.{output_ext}"
        except Exception:
            # Pillow unavailable or corrupt image — store the raw bytes
            out_content, out_type = content, (file.content_type or "application/octet-stream")

    db.add(Upload(filename=filename, content_type=out_type, data=out_content))
    db.commit()
    return {"url": f"/uploads/{filename}"}
