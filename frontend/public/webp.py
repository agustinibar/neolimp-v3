import os
from PIL import Image

# 👉 CONFIGURÁ ACÁ LA CARPETA DE IMÁGENES
INPUT_FOLDER = "./fotos_nimp"
QUALITY = 80  # 75–85 recomendado para web

VALID_EXTENSIONS = (".jpg", ".jpeg", ".png", ".jfif")

def convert_images_to_webp():
    for root, _, files in os.walk(INPUT_FOLDER):
        for file in files:
            if file.lower().endswith(VALID_EXTENSIONS):
                input_path = os.path.join(root, file)
                output_path = os.path.splitext(input_path)[0] + ".webp"

                if os.path.exists(output_path):
                    print(f"✔ Ya existe: {output_path}")
                    continue

                try:
                    with Image.open(input_path) as img:
                        img = img.convert("RGB")
                        img.save(
                            output_path,
                            "WEBP",
                            quality=QUALITY,
                            method=6
                        )
                        print(f"✅ Convertido: {input_path} → {output_path}")
                except Exception as e:
                    print(f"❌ Error con {input_path}: {e}")

if __name__ == "__main__":
    convert_images_to_webp()
