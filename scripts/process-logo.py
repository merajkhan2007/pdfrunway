import os
from PIL import Image

def process_logos(input_path, threshold=242, padding=5):
    if not os.path.exists(input_path):
        print(f"Error: Input path {input_path} does not exist.")
        return False
        
    print(f"Processing image {input_path}...")
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # 1. Remove background by replacing near-white pixels with transparency
    pixels = img.load()
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                pixels[x, y] = (r, g, b, 0)
            else:
                # Smooth edge transparency
                min_rgb = min(r, g, b)
                if min_rgb >= threshold - 15:
                    alpha = int((threshold - min_rgb) / 15.0 * 255)
                    alpha = max(0, min(255, alpha))
                    pixels[x, y] = (r, g, b, alpha)
                    
    # Calculate bounding box of non-transparent content
    bbox = img.getbbox()
    if bbox:
        left, top, right, bottom = bbox
        left = max(0, left - padding)
        top = max(0, top - padding)
        right = min(width, right + padding)
        bottom = min(height, bottom + padding)
        img = img.crop((left, top, right, bottom))
        print(f"Cropped image to content box: {left}, {top}, {right}, {bottom}")
    
    # 2. Save standard version (light backgrounds)
    standard_paths = ["public/images/pdfrunway.png", "public/images/logo.png"]
    for path in standard_paths:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        img.save(path, "PNG")
        print(f"Saved standard logo to: {path}")
        
    # 3. Create dark mode version (dark navy backgrounds)
    # Convert charcoal text (low RGB values, similar R/G/B) to white, leave red untouched
    dark_img = img.copy()
    dark_pixels = dark_img.load()
    w, h = dark_img.size
    
    for y in range(h):
        for x in range(w):
            r, g, b, a = dark_pixels[x, y]
            if a > 0:
                # Check if it is a grey/charcoal pixel (low values, low variation)
                # Red text has high R, low G/B. Grey text has similar low R/G/B.
                max_val = max(r, g, b)
                min_val = min(r, g, b)
                # If it's dark/grey (low intensity and low color variation)
                if max_val < 110 and (max_val - min_val) < 25:
                    # Map to white (255, 255, 255) preserving original transparency channel
                    dark_pixels[x, y] = (255, 255, 255, a)
                elif max_val < 150 and (max_val - min_val) < 15:
                    # Also map intermediate grey/anti-aliased grey edges to white
                    dark_pixels[x, y] = (255, 255, 255, a)
                    
    dark_path = "public/images/pdfrunway-dark.png"
    dark_img.save(dark_path, "PNG")
    print(f"Saved dark-mode optimized logo to: {dark_path}")
    return True

if __name__ == "__main__":
    process_logos("public/images/new logo.png")
