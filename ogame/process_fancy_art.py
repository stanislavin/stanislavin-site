from PIL import Image
import os

def process_fancy():
    # Path to the generated genie art
    source_path = "/Users/stanislavin/.gemini/antigravity/brain/658f06fc-71c1-4e3f-b63b-37d22c2ab603/fancy_genie_pixel_art_source_1769617631307.png"
    target_path = "assets/sprites/fancy.png"
    
    if not os.path.exists(source_path):
        print(f"Error: Source image not found at {source_path}")
        return

    # Open the image
    img = Image.open(source_path).convert("RGBA")
    
    # Remove white background
    datas = img.getdata()
    new_data = []
    for item in datas:
        # If it's pure white or very close to it
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)

    width, height = img.size
    
    # Target sprite sheet (128x64) - Two 64x64 frames
    sprite_sheet = Image.new("RGBA", (128, 64), (0, 0, 0, 0))
    
    # Crop the two frames
    left_half = img.crop((0, 0, width // 2, height))
    right_half = img.crop((width // 2, 0, width, height))
    
    def get_character_bounds(image):
        bbox = image.getbbox()
        if not bbox:
            return None
        return bbox

    left_bbox = get_character_bounds(left_half)
    right_bbox = get_character_bounds(right_half)
    
    if left_bbox:
        char1 = left_half.crop(left_bbox)
        # Scale to fit comfortably in 64x64
        char1.thumbnail((55, 55), Image.Resampling.NEAREST)
        # Center in the frame
        cx = (64 - char1.width) // 2
        cy = (64 - char1.height) // 2
        sprite_sheet.paste(char1, (cx, cy), char1)
        
    if right_bbox:
        char2 = right_half.crop(right_bbox)
        char2.thumbnail((55, 55), Image.Resampling.NEAREST)
        # Center in the second 64x64 frame
        cx = 64 + (64 - char2.width) // 2
        cy = (64 - char2.height) // 2
        sprite_sheet.paste(char2, (cx, cy), char2)

    # Save
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    sprite_sheet.save(target_path)
    print(f"Successfully processed Fancy genie sprite and saved to {target_path}")

if __name__ == "__main__":
    process_fancy()
