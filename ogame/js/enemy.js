// Enemy classes
class Enemy {
    constructor(x, y, type, sprite) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 75;
        this.velocityX = -1.5;
        this.velocityY = 0;
        this.type = type;
        this.sprite = sprite;
        this.alive = true;
        this.direction = -1;
        this.patrolStart = x - 100;
        this.patrolEnd = x + 100;
    }

    update(platforms) {
        // Simple patrol AI
        if (this.x <= this.patrolStart) {
            this.velocityX = Math.abs(this.velocityX);
            this.direction = 1;
        } else if (this.x >= this.patrolEnd) {
            this.velocityX = -Math.abs(this.velocityX);
            this.direction = -1;
        }

        // Apply physics
        Physics.applyGravity(this);
        Physics.updatePosition(this);
        Physics.checkPlatformCollision(this, platforms);
    }

    draw(ctx, offsetX = 0) {
        if (!this.alive) return;

        if (this.sprite) {
            // Draw from enemy sprite sheet based on type
            // New enemy types: poor (0), snob (1), tax (2)
            const spriteIndex = {
                'poor': 0,
                'snob': 1,
                'tax': 2
            }[this.type] || 0;

            const spriteWidth = 64;
            const spriteHeight = 64;
            const sx = spriteIndex * spriteWidth;

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
            // Fallback colors
            const colors = {
                'poor': '#8B4513',
                'snob': '#800080',
                'tax': '#555555'
            };
            ctx.fillStyle = colors[this.type] || '#ff0000';
            ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);
        }
    }


    checkPlayerCollision(player) {
        if (!this.alive) return null;

        const playerBounds = player.getBounds();

        if (checkCollision(this, playerBounds)) {
            // Check if player is above enemy (jumping on them)
            // More generous check: if player's bottom is above enemy's center, it's a stomp
            const playerBottom = playerBounds.y + playerBounds.height;
            const enemyCenter = this.y + this.height / 2;

            if (playerBottom < enemyCenter + 15) {
                // Player is above enemy - always defeat, never damage
                this.alive = false;
                player.velocityY = -8; // Bounce
                return 'defeat';
            } else {
                return 'damage';
            }
        }


        // Check projectile collision
        for (let i = player.projectiles.length - 1; i >= 0; i--) {
            const proj = player.projectiles[i];
            if (checkCollision(this, proj)) {
                this.alive = false;
                player.projectiles.splice(i, 1);
                return 'defeat';
            }
        }

        return null;
    }

    getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}
