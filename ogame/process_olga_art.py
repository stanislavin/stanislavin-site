from PIL import Image
import os

def process_sprite():
    # Path to the generated image
    source_path = "/Users/stanislavin/.gemini/antigravity/brain/658f06fc-71c1-4e3f-b63b-37d22c2ab603/olga_pixel_art_source_1769617032220.png"
    target_path = "assets/sprites/olga.png"
    
    if not os.path.exists(source_path):
        print(f"Error: Source image not found at {source_path}")
        return

    # Open the image
    img = Image.open(source_path).convert("RGBA")
    
    # Remove the checkered background
    # The generation has white (255,255,255) and light gray (around 190-210) squares
    datas = img.getdata()
    new_data = []
    for item in datas:
        # If it's very bright (white) or light gray and looks like a background square
        r, g, b, a = item
        # Check for white/light gray with low saturation
        is_grayish = abs(r-g) < 10 and abs(g-b) < 10 and abs(r-b) < 10
        if is_grayish and r > 180:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)

    width, height = img.size
    
    # Create the target sprite sheet (256x128) - two 128x128 frames
    sprite_sheet = Image.new("RGBA", (256, 128), (0, 0, 0, 0))
    
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
        # Larger size for the character
        char1.thumbnail((100, 115), Image.Resampling.NEAREST)
        # Center horizontally, align feet to bottom
        cx = (128 - char1.width) // 2
        cy = 128 - char1.height  # Align bottom
        sprite_sheet.paste(char1, (cx, cy), char1)
        
    if right_bbox:
        char2 = right_half.crop(right_bbox)
        # Larger size for the character
        char2.thumbnail((100, 115), Image.Resampling.NEAREST)
        # Center horizontally in second frame, align feet to bottom
        cx = 128 + (128 - char2.width) // 2
        cy = 128 - char2.height  # Align bottom
        sprite_sheet.paste(char2, (cx, cy), char2)


    # Save the result
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    sprite_sheet.save(target_path)
    print(f"Successfully processed sprite (with background removal and upscaling) and saved to {target_path}")

if __name__ == "__main__":
    process_sprite()
