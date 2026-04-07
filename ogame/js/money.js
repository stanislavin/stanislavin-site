// Money class (formerly PowerUp)
class Money {
    constructor(x, y, amount, sprite) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.amount = amount || 10000;
        this.sprite = sprite;
        this.collected = false;
        this.bobOffset = 0;
        this.bobTimer = 0;
    }

    update() {
        // Bob up and down animation
        this.bobTimer += 0.1;
        this.bobOffset = Math.sin(this.bobTimer) * 5;
    }

    draw(ctx, offsetX = 0) {
        if (this.collected) return;

        if (this.sprite) {
            // Use the first frame of the powerups sprite sheet (which was the STAR)
            const sx = 0;
            const spriteSize = 128;

            ctx.drawImage(
                this.sprite,
                sx, 0, spriteSize, spriteSize,
                this.x - offsetX, this.y + this.bobOffset, this.width, this.height
            );
        } else {
            // Fallback
            ctx.fillStyle = '#FFD700'; // Gold
            ctx.fillRect(this.x - offsetX, this.y + this.bobOffset, this.width, this.height);
        }
    }

    checkCollection(player, game) {
        if (this.collected) return false;

        if (checkCollision(this, player.getBounds())) {
            this.collected = true;
            game.money += this.amount;
            document.getElementById('money').textContent = game.money.toLocaleString();
            if (window.gameAudio) window.gameAudio.playPowerUp(); // Use same sound for now
            return true;
        }
        return false;
    }
}
