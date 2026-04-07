// Companion class (Fancy)
class Companion {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 70;
        this.sprite = sprite;
        this.targetX = x;
        this.targetY = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.frame = 0;
        this.frameTimer = 0;
    }

    update(player) {
        // Follow player with some lag
        const followDistance = 80;
        const followSpeed = 0.1;

        this.targetX = player.x - followDistance;
        this.targetY = player.y;

        this.velocityX = (this.targetX - this.x) * followSpeed;
        this.velocityY = (this.targetY - this.y) * followSpeed;

        this.x += this.velocityX;
        this.y += this.velocityY;

        // Animation
        this.frameTimer++;
        if (this.frameTimer >= 15) {
            this.frame = (this.frame + 1) % 2;
            this.frameTimer = 0;
        }
    }

    draw(ctx, offsetX = 0) {
        if (this.sprite) {
            const spriteWidth = 64;
            const spriteHeight = 64;
            const sx = this.frame * spriteWidth;

            ctx.drawImage(
                this.sprite,
                sx, 0, spriteWidth, spriteHeight,
                this.x - offsetX, this.y, this.width, this.height
            );
        } else {
            // Fallback - purple and yellow circle
            ctx.fillStyle = '#9370DB';
            ctx.beginPath();
            ctx.arc(this.x - offsetX + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    attackNearbyEnemies(enemies, offsetX = 0) {
        // Fancy helps defeat enemies within range
        const attackRange = 100;

        enemies.forEach(enemy => {
            if (!enemy.alive) return;

            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < attackRange && Math.random() < 0.02) {
                enemy.alive = false;
            }
        });
    }
}
