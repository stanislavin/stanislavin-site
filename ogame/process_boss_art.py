from PIL import Image
import os

def process_boss():
    # Path to the generated boss art
    source_path = "/Users/stanislavin/.gemini/antigravity/brain/658f06fc-71c1-4e3f-b63b-37d22c2ab603/ganvest_boss_pixel_art_source_1769617798887.png"
    target_path = "assets/sprites/ganvest.png"
    
    if not os.path.exists(source_path):
        print(f"Error: Source image not found at {source_path}")
        return

    # Open the image
    img = Image.open(source_path).convert("RGBA")
    
    # Remove background (white/checkered)
    # The generation has white and light gray squares
    datas = img.getdata()
    new_data = []
    for item in datas:
        r, g, b, a = item
        # If it's pure white or light grey background
        if r > 240 and g > 240 and b > 240:
            new_data.append((0, 0, 0, 0))
        elif abs(r-210) < 20 and abs(g-210) < 20 and abs(b-210) < 20: # Light grey from checkered
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)

    # Get bounds of the character
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    # Create target 128x128 sprite
    sprite = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    
    # Scale to fit while maintaining aspect ratio
    img.thumbnail((120, 120), Image.Resampling.NEAREST)
    
    # Center it
    cx = (128 - img.width) // 2
    cy = (128 - img.height) // 2
    sprite.paste(img, (cx, cy), img)

    # Save
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    sprite.save(target_path)
    print(f"Successfully processed Ganvest boss sprite and saved to {target_path}")

if __name__ == "__main__":
    process_boss()
