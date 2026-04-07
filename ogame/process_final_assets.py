from PIL import Image
import os

def process_enemies():
    # Source paths
    client_src = "/Users/stanislavin/.gemini/antigravity/brain/658f06fc-71c1-4e3f-b63b-37d22c2ab603/enemy_client_pixel_art_source_1769619499830.png"
    snob_src = "/Users/stanislavin/.gemini/antigravity/brain/658f06fc-71c1-4e3f-b63b-37d22c2ab603/enemy_snob_pixel_art_source_v2_1769619534074.png"
    tax_src = "/Users/stanislavin/.gemini/antigravity/brain/658f06fc-71c1-4e3f-b63b-37d22c2ab603/enemy_tax_agent_pixel_art_source_v2_1769619555397.png"
    
    target_path = "assets/sprites/enemies.png"
    
    # Target sprite sheet: 4 types, each 64x64 frame for now (but we will scale them in game)
    # Actually, let's keep the sprite sheet as 256x64 (4 frames of 64x64)
    sprite_sheet = Image.new("RGBA", (256, 64), (0, 0, 0, 0))
    
    sources = [snob_src, tax_src, client_src]
    
    # We also need a source for 'armenian' (index 3). 
    # Since we can't find it, we'll reuse tax agent for now but maybe we can find a better one.
    # For now, let's just make sure we don't crash and have 4 slots.
    if len(sources) < 4:
        sources.append(tax_src) # Fallback
    
    for i, src in enumerate(sources):
        if not os.path.exists(src):
            print(f"Error: {src} not found")
            continue
            
        img = Image.open(src).convert("RGBA")
        width, height = img.size
        
        # Remove background (improved checkered detection)
        datas = img.getdata()
        new_data = []
        for item in datas:
            r, g, b, a = item
            # White, light gray squares, or very light colors (background)
            if (r > 180 and g > 180 and b > 180) or a < 50:
                new_data.append((0, 0, 0, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)
        
        # Improved cropping logic:
        # 1. Start with the top-left quadrant (usually contains the first character frame)
        # For 1024x1024 grids (2x2 or 4x4), this is 512x512
        quadrant = img.crop((0, 0, width // 2, height // 2))
        
        # 2. If it's a 4x4 grid, even a quadrant has 2x2 characters.
        # Let's try to get the bbox of the quadrant to see if it's still too large.
        bbox = quadrant.getbbox()
        if bbox:
            char = quadrant.crop(bbox)
            # If the cropped area is still very wide, it might be 2 characters (horizontal)
            if char.width > char.height * 1.2:
                char = char.crop((0, 0, char.width // 2, char.height))
                # Re-tighten
                bbox2 = char.getbbox()
                if bbox2:
                    char = char.crop(bbox2)
        else:
            char = quadrant # Fallback
        
        # Fit in 64x64 slot
        # Ensure we don't scale up, only down
        char.thumbnail((60, 60), Image.Resampling.NEAREST)
        cx = i * 64 + (64 - char.width) // 2
        cy = (64 - char.height) // 2
        sprite_sheet.paste(char, (cx, cy), char)
        
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    sprite_sheet.save(target_path)
    print(f"Processed enemies saved to {target_path}")

def process_boss():
    source = "/Users/stanislavin/.gemini/antigravity/brain/658f06fc-71c1-4e3f-b63b-37d22c2ab603/ganvest_full_body_pixel_art_source_v2_1769619571886.png"
    target = "assets/sprites/ganvest.png"
    
    if not os.path.exists(source):
        print(f"Error: {source} not found")
        return
        
    img = Image.open(source).convert("RGBA")
    
    # Remove background - improved to catch all checkered pattern colors
    width, height = img.size
    new_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    pixels = img.load()
    new_pixels = new_img.load()
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            # Skip gray pixels (checkered background)
            is_gray = abs(r - g) < 25 and abs(g - b) < 25 and abs(r - b) < 25
            # Checkered grays are typically 90-255 (includes white)
            is_bg_gray = is_gray and r > 90
            
            if not is_bg_gray and a > 50:
                new_pixels[x, y] = (r, g, b, a)
    
    img = new_img

    
    # Get bounds
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    # Create 128x128 sprite
    sprite = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    img.thumbnail((120, 120), Image.Resampling.NEAREST)
    
    cx = (128 - img.width) // 2
    cy = (128 - img.height) // 2
    sprite.paste(img, (cx, cy), img)
    
    sprite.save(target)
    print(f"Processed boss saved to {target}")

if __name__ == "__main__":
    process_enemies()
    process_boss()
