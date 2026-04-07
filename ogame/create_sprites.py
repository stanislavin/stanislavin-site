#!/usr/bin/env python3
"""
Temporary script to create simple colored sprite placeholders with transparency.
This creates proper PNG files with alpha channel instead of checkered backgrounds.
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Create assets/sprites directory if it doesn't exist
os.makedirs('assets/sprites', exist_ok=True)

def create_simple_sprite(filename, width, height, color, label=""):
    """Create a simple colored rectangle sprite with transparency"""
    # Create image with transparency
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw colored rectangle (leaving some transparent border)
    margin = 10
    draw.rectangle(
        [(margin, margin), (width-margin, height-margin)], 
        fill=color, 
        outline=(0, 0, 0, 255),
        width=2
    )
    
    # Add label if provided
    if label:
        try:
            # Try to use a decent font
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
        except:
            font = ImageFont.load_default()
        
        # Get text bounding box
        bbox = draw.textbbox((0, 0), label, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Center text
        text_x = (width - text_width) // 2
        text_y = (height - text_height) // 2
        
        # Draw text with white color
        draw.text((text_x, text_y), label, fill=(255, 255, 255, 255), font=font)
    
    # Save as PNG
    img.save(filename, 'PNG')
    print(f"Created {filename}")

# Create Olga sprite sheet (2 frames)
def create_olga_sprite():
    """Create a simple Olga sprite with 2 animation frames"""
    width = 128
    height = 64
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Purple/pink color for Olga
    olga_color = (138, 43, 226, 255)  # Blue-violet
    
    # Frame 1 - Standing
    frame_width = 64
    margin = 5
    draw.ellipse(
        [(margin + 20, margin + 5), (frame_width - margin - 20, margin + 15)],
        fill=(255, 200, 150, 255)  # Skin color for head
    )
    draw.rectangle(
        [(margin + 15, margin + 18), (frame_width - margin - 15, height - margin - 15)],
        fill=olga_color  # Body
    )
    # Arms
    draw.rectangle([(margin + 10, margin + 20), (margin + 14, margin + 35)], fill=olga_color)
    draw.rectangle([(frame_width - margin - 14, margin + 20), (frame_width - margin - 10, margin + 35)], fill=olga_color)
    # Legs
    draw.rectangle([(margin + 18, height - margin - 15), (margin + 24, height - margin)], fill=(50, 50, 150, 255))
    draw.rectangle([(frame_width - margin - 24, height - margin - 15), (frame_width - margin - 18, height - margin)], fill=(50, 50, 150, 255))
    
    # Frame 2 - Walking (slightly different pose)
    offset_x = 64
    draw.ellipse(
        [(offset_x + margin + 20, margin + 5), (offset_x + frame_width - margin - 20, margin + 15)],
        fill=(255, 200, 150, 255)
    )
    draw.rectangle(
        [(offset_x + margin + 15, margin + 18), (offset_x + frame_width - margin - 15, height - margin - 15)],
        fill=olga_color
    )
    # Arms in different position
    draw.rectangle([(offset_x + margin + 10, margin + 25), (offset_x + margin + 14, margin + 40)], fill=olga_color)
    draw.rectangle([(offset_x + frame_width - margin - 14, margin + 20), (offset_x + frame_width - margin - 10, margin + 35)], fill=olga_color)
    # Legs in walking pose
    draw.rectangle([(offset_x + margin + 18, height - margin - 20), (offset_x + margin + 24, height - margin)], fill=(50, 50, 150, 255))
    draw.rectangle([(offset_x + frame_width - margin - 24, height - margin - 10), (offset_x + frame_width - margin - 18, height - margin)], fill=(50, 50, 150, 255))
    
    img.save('assets/sprites/olga.png', 'PNG')
    print("Created assets/sprites/olga.png (2 animation frames)")

# Create enemy sprite sheet (4 types)
def create_enemy_sprites():
    """Create simple enemy sprites (4 types in 4x1 strip)"""
    width = 256
    height = 64
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    frame_width = 64
    frame_height = 64
    
    enemies = [
        ("SNOB", (128, 0, 128, 255), 0, 0),  # Purple
        ("TAX", (100, 100, 100, 255), 64, 0),  # Gray
        ("CLIENT", (200, 50, 50, 255), 128, 0),  # Red
        ("NEIGHBOR", (255, 165, 0, 255), 192, 0),  # Orange
    ]
    
    for name, color, offset_x, offset_y in enemies:
        margin = 10
        # Simple rectangular enemy
        draw.rectangle(
            [(offset_x + margin, offset_y + margin + 10), 
             (offset_x + frame_width - margin, offset_y + frame_height - margin)],
            fill=color,
            outline=(0, 0, 0, 255),
            width=2
        )
        
        # Add eyes
        eye_y = offset_y + margin + 15
        draw.ellipse([(offset_x + 20, eye_y), (offset_x + 30, eye_y + 10)], fill=(255, 255, 255, 255))
        draw.ellipse([(offset_x + 22, eye_y + 2), (offset_x + 26, eye_y + 6)], fill=(0, 0, 0, 255))
        
        draw.ellipse([(offset_x + 40, eye_y), (offset_x + 50, eye_y + 10)], fill=(255, 255, 255, 255))
        draw.ellipse([(offset_x + 42, eye_y + 2), (offset_x + 46, eye_y + 6)], fill=(0, 0, 0, 255))
        
        # Add label (shorter)
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 10)
        except:
            font = ImageFont.load_default()
        
        bbox = draw.textbbox((0, 0), name[:1], font=font)
        text_width = bbox[2] - bbox[0]
        text_x = offset_x + (frame_width - text_width) // 2
        text_y = offset_y + frame_height - margin - 15
        
        draw.text((text_x, text_y), name[:1], fill=(255, 255, 255, 255), font=font)
    
    img.save('assets/sprites/enemies.png', 'PNG')
    print("Created assets/sprites/enemies.png (4 enemy types)")

# Create boss sprite
def create_boss_sprite():
    create_simple_sprite(
        'assets/sprites/ganvest.png', 
        64, 64, 
        (50, 50, 50, 255),  # Dark gray/black
        "BOSS"
    )

# Create fancy client sprite
def create_fancy_sprite():
    """Create a simple Fancy sprite with 2 animation frames"""
    width = 128
    height = 64
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Gold color for Fancy
    fancy_color = (255, 215, 0, 255)
    
    # Frame 1
    margin = 15
    draw.ellipse(
        [(margin, margin), (64 - margin, 64 - margin)],
        fill=fancy_color,
        outline=(0, 0, 0, 255),
        width=2
    )
    
    # Frame 2 (slightly smaller)
    margin = 18
    draw.ellipse(
        [(64 + margin, margin), (128 - margin, 64 - margin)],
        fill=fancy_color,
        outline=(0, 0, 0, 255),
        width=2
    )
    
    img.save('assets/sprites/fancy.png', 'PNG')
    print("Created assets/sprites/fancy.png (2 animation frames)")

# Create powerup sprites (2x2 grid, each 128x128)
def create_powerup_sprites():
    """Create powerup sprites as expected by powerup.js (128x128 frames)"""
    width = 256
    height = 128
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    frame_width = 128
    frame_height = 128
    
    powerups = [
        ("GROW", (255, 255, 0, 255), 0, 0),  # Yellow
        ("SHOOT", (255, 69, 0, 255), 128, 0),  # Orange-Red
    ]
    
    for name, color, offset_x, offset_y in powerups:
        margin = 20
        # Draw circle powerup
        center_x = offset_x + frame_width // 2
        center_y = offset_y + frame_height // 2
        radius = 40
        
        draw.ellipse(
            [(center_x - radius, center_y - radius), 
             (center_x + radius, center_y + radius)],
            fill=color,
            outline=(255, 255, 255, 255),
            width=3
        )
        
        # Add label
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
        except:
            font = ImageFont.load_default()
        
        bbox = draw.textbbox((0, 0), name, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = center_x - text_width // 2
        text_y = center_y - text_height // 2
        
        draw.text((text_x, text_y), name, fill=(0, 0, 0, 255), font=font)
    
    img.save('assets/sprites/powerups.png', 'PNG')
    print("Created assets/sprites/powerups.png (2 powerup types)")

if __name__ == '__main__':
    print("Creating correctly sized sprite placeholders with transparency...")
    create_olga_sprite()
    create_enemy_sprites()
    create_boss_sprite()
    create_fancy_sprite()
    create_powerup_sprites()
    print("\nAll sprites created successfully!")
    print("These are simple placeholders. You can replace them with custom pixel art later.")
