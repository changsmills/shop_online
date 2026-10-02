from PIL import Image, ImageOps
from io import BytesIO
from django.core.files.base import ContentFile
from pathlib import Path


def optimize_image(
    image_file,
    quality=80,
    max_width=1920,
    max_height=1920
):
    """
    Optimize uploaded image:
    - Convert to WebP
    - Resize large images
    - Preserve transparency
    - Return Django ContentFile
    """

    if not image_file:
        return None

    # URL haihitaji conversion hapa
    if isinstance(image_file, str):
        return image_file

    try:
        image_file.seek(0)

        img = Image.open(image_file)

        # Correct orientation from phone camera
        img = ImageOps.exif_transpose(img)

        # Resize while preserving aspect ratio
        img.thumbnail(
            (max_width, max_height),
            Image.Resampling.LANCZOS
        )

        # Preserve transparency
        if img.mode in ("RGBA", "LA") or (
            img.mode == "P" and "transparency" in img.info
        ):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

        output = BytesIO()

        img.save(
            output,
            format="WEBP",
            quality=quality,
            method=6
        )

        output.seek(0)

        original_name = Path(
            getattr(image_file, "name", "image")
        ).stem

        return ContentFile(
            output.read(),
            name=f"{original_name}.webp"
        )

    except Exception as e:
        raise ValueError(f"Image optimization failed: {e}")

    finally:
        try:
            image_file.seek(0)
        except Exception:
            pass