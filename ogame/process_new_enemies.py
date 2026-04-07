from PIL import Image
import os

def process_enemies():
    # New sources for the 3 enemy types (modern style)
    poor_person_src = "/Users/stanislavin/.gemini/antigravity/brain/6d8a2b18-3b50-4927-ab75-217b5cff815c/enemy_poor_hoodie_up_1769779216796.png"


    snob_lady_src = "/Users/stanislavin/.gemini/antigravity/brain/6d8a2b18-3b50-4927-ab75-217b5cff815c/enemy_snob_modern_1769778799692.png"
    tax_collector_src = "/Users/stanislavin/.gemini/antigravity/brain/6d8a2b18-3b50-4927-ab75-217b5cff815c/enemy_tax_modern_1769778814873.png"

    
    target_path = "assets/sprites/enemies.png"
    
    # Target sprite sheet: 3 types, each 64x64 frame (total 192x64)
    sprite_sheet = Image.new("RGBA", (192, 64), (0, 0, 0, 0))
    
    sources = [
        ("poor", poor_person_src),
        ("snob", snob_lady_src),
        ("tax", tax_collector_src),
    ]
    
    for i, (name, src) in enumerate(sources):
        if not os.path.exists(src):
            print(f"Error: {src} not found")
            continue
            
        img = Image.open(src).convert("RGBA")
        width, height = img.size
        
        # Create a new image with transparent background
        # and copy only non-gray pixels
        new_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        pixels = img.load()
        new_pixels = new_img.load()
        
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                # Skip gray pixels (checkered background)
                # Gray pixels have R, G, B close together
                is_gray = abs(r - g) < 25 and abs(g - b) < 25 and abs(r - b) < 25
                # Checkered grays are typically 100-230 (includes white squares)
                is_bg_gray = is_gray and r > 90
                
                if not is_bg_gray and a > 50:
                    new_pixels[x, y] = (r, g, b, a)

        
        # Get tight bounds around the character
        bbox = new_img.getbbox()
        if bbox:
            new_img = new_img.crop(bbox)
        
        # No flip needed - sprite already faces left


        
        # Fit in 64x64 slot (scale down to fit, keep aspect ratio)
        new_img.thumbnail((60, 60), Image.Resampling.LANCZOS)
        
        # Center in the frame
        cx = i * 64 + (64 - new_img.width) // 2
        cy = (64 - new_img.height) // 2
        sprite_sheet.paste(new_img, (cx, cy), new_img)
        print(f"Processed {name} enemy")
        
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    sprite_sheet.save(target_path)
    print(f"Saved enemies sprite sheet to {target_path}")

if __name__ == "__main__":
    process_enemies()

