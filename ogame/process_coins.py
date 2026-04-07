from PIL import Image
import os

def process_coins():
    # Path to the generated coin art
    source_path = "/Users/stanislavin/.gemini/antigravity/brain/658f06fc-71c1-4e3f-b63b-37d22c2ab603/coin_pixel_art_source_1769619180966.png"
    target_path = "assets/sprites/powerups.png"
    
    if not os.path.exists(source_path):
        print(f"Error: Source image not found at {source_path}")
        return

    # Open the image
    img = Image.open(source_path).convert("RGBA")
    
    # Remove background
    datas = img.getdata()
    new_data = []
    for item in datas:
        r, g, b, a = item
        # Background is grey/checkered
        is_gray = abs(r-g) < 10 and abs(g-b) < 10 and abs(r-b) < 10
        if is_gray and r > 100:
            new_data.append((0, 0, 0, 0))
        elif r > 240 and g > 240 and b > 240:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)

    # We'll take the first two frames of the coin animation
    # Coordinates based on the grid
    samples = [
        (160, 95, 315, 250),   # First coin
        (380, 95, 535, 250),   # Slightly turned coin
    ]
    
    # Target sprite sheet (reusing the same structure as banknotes)
    sprite_sheet = Image.new("RGBA", (256, 128), (0, 0, 0, 0))
    
    # Extract and place
    for i, box in enumerate(samples):
        sample = img.crop(box)
        sample.thumbnail((100, 100), Image.Resampling.NEAREST)
        cx = i * 128 + (128 - sample.width) // 2
        cy = (128 - sample.height) // 2
        sprite_sheet.paste(sample, (cx, cy), sample)

    # Save
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    sprite_sheet.save(target_path)
    print(f"Successfully processed gold coins and saved to {target_path}")

if __name__ == "__main__":
    process_coins()
