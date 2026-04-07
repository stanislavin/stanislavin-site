// Player class
class Player {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 100;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 4;
        this.jumpForce = 12;
        this.onGround = false;
        this.sprite = sprite;
        this.direction = 1; // 1 = right, -1 = left
        this.frame = 0;
        this.frameTimer = 0;
        this.frameDelay = 8;
        this.state = 'normal'; // normal, big, shooter
        this.lives = 3;
        this.invulnerable = false;
        this.invulnerableTimer = 0;
        this.projectiles = [];
    }

    update(keys, platforms) {
        // Movement
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
            this.velocityX = -this.speed;
            this.direction = -1;
        } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
            this.velocityX = this.speed;
            this.direction = 1;
        }

        // Jumping
        if ((keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' ']) && this.onGround) {
            this.velocityY = -this.jumpForce;
            this.onGround = false;
            if (window.gameAudio) window.gameAudio.playJump();
        }


        // Apply physics
        Physics.applyGravity(this);
        Physics.applyFriction(this, this.onGround);
        Physics.updatePosition(this);

        // Check platform collision
        this.onGround = Physics.checkPlatformCollision(this, platforms);

        // Update animation frame
        if (Math.abs(this.velocityX) > 0.5) {
            this.frameTimer++;
            if (this.frameTimer >= this.frameDelay) {
                this.frame = (this.frame + 1) % 2;
                this.frameTimer = 0;
            }
        } else {
            this.frame = 0;
        }

        // Update projectiles
        this.projectiles = this.projectiles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            return p.x > -50 && p.x < 850 && p.y > -50 && p.y < 650;
        });

        // Invulnerability timer
        if (this.invulnerable) {
            this.invulnerableTimer--;
            if (this.invulnerableTimer <= 0) {
                this.invulnerable = false;
            }
        }
    }


    draw(ctx, offsetX = 0) {
        ctx.save();

        // Flicker when invulnerable
        if (this.invulnerable && Math.floor(this.invulnerableTimer / 5) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // Draw player sprite
        if (this.sprite) {
            const spriteWidth = 128; // Width of each frame in sprite sheet
            const spriteHeight = 128;
            const sx = this.frame * spriteWidth;

            ctx.save();
            if (this.direction < 0) {
                ctx.scale(-1, 1);
                ctx.drawImage(
                    this.sprite,
                    sx, 0, spriteWidth, spriteHeight,
                    -(this.x - offsetX + this.width), this.y, this.width, this.height
                );
            } else {
                ctx.drawImage(
                    this.sprite,
                    sx, 0, spriteWidth, spriteHeight,
                    this.x - offsetX, this.y, this.width, this.height
                );
            }
            ctx.restore();
        } else {
            // Fallback rectangle
            ctx.fillStyle = '#ff69b4';
            ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);
        }

        // Draw projectiles
        ctx.fillStyle = '#ffff00';
        this.projectiles.forEach(p => {
            ctx.fillRect(p.x - offsetX, p.y, p.width, p.height);
        });

        ctx.restore();
    }

    takeDamage() {
        if (!this.invulnerable) {
            this.lives--;
            this.invulnerable = true;
            this.invulnerableTimer = 90; // 1.5 seconds at 60fps
            if (window.gameAudio) window.gameAudio.playDamage();

            return this.lives > 0;
        }
        return true;
    }

    getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}
