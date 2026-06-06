import os
import uuid
import io
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.api.deps import get_current_admin

router = APIRouter(tags=["upload"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED = {
    "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
MAX_SIZE      = 10 * 1024 * 1024   # 10 MB raw upload limit
MAX_DIMENSION = 1400               # px — longest edge capped here
JPEG_QUALITY  = 82                 # good balance of quality vs file size


@router.post("", dependencies=[Depends(get_current_admin)])
async def upload_file(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED:
        raise HTTPException(status_code=400, detail="File type not allowed")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10 MB)")

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    # Non-image files (PDF, Word) — save as-is
    if file.content_type not in {"image/jpeg", "image/png", "image/webp", "image/gif"}:
        with open(filepath, "wb") as f:
            f.write(content)
        return {"url": f"/uploads/{filename}"}

    # Images — resize + compress with Pillow
    try:
        from PIL import Image, ImageOps

        img = Image.open(io.BytesIO(content))

        # Fix EXIF orientation before anything else
        img = ImageOps.exif_transpose(img)

        # Convert palette/RGBA to RGB for JPEG output (keeps PNG as PNG)
        output_format = "JPEG"
        output_ext    = "jpg"
        if file.content_type == "image/png":
            output_format = "PNG"
            output_ext    = "png"
            # Flatten transparency onto dark background for PNGs that have it
            if img.mode in ("RGBA", "LA", "P"):
                bg = Image.new("RGBA", img.size, (10, 10, 15, 255))
                img = img.convert("RGBA")
                bg.paste(img, mask=img.split()[3])
                img = bg.convert("RGB")
        elif img.mode not in ("RGB", "L"):
            img = img.convert("RGB")

        # Resize — cap longest edge at MAX_DIMENSION
        w, h = img.size
        if max(w, h) > MAX_DIMENSION:
            scale = MAX_DIMENSION / max(w, h)
            img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

        # Save with compression
        filename = f"{uuid.uuid4().hex}.{output_ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        save_kwargs = {"optimize": True}
        if output_format == "JPEG":
            save_kwargs["quality"] = JPEG_QUALITY
            save_kwargs["progressive"] = True

        img.save(filepath, format=output_format, **save_kwargs)

    except Exception as e:
        # Pillow unavailable or corrupt image — save raw
        with open(filepath, "wb") as f:
            f.write(content)

    return {"url": f"/uploads/{filename}"}
