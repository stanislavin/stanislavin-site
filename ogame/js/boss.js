// Boss class (Ganvest)
class Boss {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 125;
        this.sprite = sprite;
        this.health = 10;
        this.maxHealth = 10;
        this.velocityX = 2;
        this.velocityY = 0;
        this.direction = -1;
        this.invulnerable = false;
        this.invulnerableTimer = 0;
        this.speechTimer = 0;
        this.showSpeech = true;
        this.defeated = false;
        this.attackTimer = 0;
    }

    update(platforms, player) {
        if (this.defeated) return;

        // Move back and forth
        this.x += this.velocityX * this.direction;

        if (this.x < player.x - 200) {
            this.direction = 1;
        } else if (this.x > player.x + 200) {
            this.direction = -1;
        }

        // Apply physics
        Physics.applyGravity(this);
        Physics.updatePosition(this);
        Physics.checkPlatformCollision(this, platforms);

        // Speech bubble is always on
        this.showSpeech = true;

        // Invulnerability
        if (this.invulnerable) {
            this.invulnerableTimer--;
            if (this.invulnerableTimer <= 0) {
                this.invulnerable = false;
            }
        }

        // Attack timer
        this.attackTimer++;
    }

    draw(ctx, offsetX = 0) {
        if (this.defeated) return;

        // Flicker when invulnerable
        if (this.invulnerable && Math.floor(this.invulnerableTimer / 5) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        if (this.sprite) {
            ctx.save();
            if (this.direction < 0) {
                ctx.scale(-1, 1);
                ctx.drawImage(
                    this.sprite,
                    -(this.x - offsetX + this.width), this.y,
                    this.width, this.height
                );
            } else {
                ctx.drawImage(
                    this.sprite,
                    this.x - offsetX, this.y,
                    this.width, this.height
                );
            }
            ctx.restore();
        } else {
            ctx.fillStyle = '#FF00FF';
            ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);
        }

        ctx.globalAlpha = 1;

        // Health bar
        const barWidth = 100;
        const barHeight = 10;
        const barX = this.x - offsetX + (this.width - barWidth) / 2;
        const barY = this.y - 20;

        ctx.fillStyle = '#000';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(barX, barY, (this.health / this.maxHealth) * barWidth, barHeight);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Speech bubble with "фа пепе шнейне"
        if (this.showSpeech) {
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;

            const bubbleX = this.x - offsetX + this.width / 2 - 60;
            const bubbleY = this.y - 60;

            ctx.fillRect(bubbleX, bubbleY, 120, 30);
            ctx.strokeRect(bubbleX, bubbleY, 120, 30);

            ctx.fillStyle = '#000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('фа пепе шнейне', bubbleX + 60, bubbleY + 20);
        }
    }

    checkPlayerCollision(player) {
        if (this.defeated) return null;

        const playerBounds = player.getBounds();

        if (checkCollision(this, playerBounds)) {
            // Check if player is jumping on boss
            if (player.velocityY > 0 && playerBounds.y + playerBounds.height - 10 < this.y + this.height / 2) {
                if (!this.invulnerable) {
                    this.health--;
                    this.invulnerable = true;
                    this.invulnerableTimer = 60;

                    if (this.health <= 0) {
                        this.defeated = true;
                        return 'defeated';
                    }
                }
                player.velocityY = -10;
                return 'hit';
            } else {
                return null;
            }
        }

        // Check projectile collision
        for (let i = player.projectiles.length - 1; i >= 0; i--) {
            const proj = player.projectiles[i];
            if (checkCollision(this, proj)) {
                if (!this.invulnerable) {
                    this.health--;
                    this.invulnerable = true;
                    this.invulnerableTimer = 30;

                    if (this.health <= 0) {
                        this.defeated = true;
                        return 'defeated';
                    }
                }
                player.projectiles.splice(i, 1);
                return 'hit';
            }
        }

        return null;
    }

    getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}
