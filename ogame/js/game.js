// Main game class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.keys = {};
        this.state = 'menu'; // menu, playing, gameOver, victory
        this.currentLevel = 0;
        this.money = 0;
        this.cameraX = 0;

        this.sprites = {};
        this.sounds = {};

        this.player = null;
        this.enemies = [];
        this.powerups = [];
        this.companion = null;
        this.boss = null;
        this.platforms = [];
        this.background = null;

        this.audio = new AudioManager();

        this.setupEventListeners();
        this.loadAssets();
    }


    setupEventListeners() {
        // Keyboard input
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Menu buttons
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('retryBtn').addEventListener('click', () => {
            this.currentLevel = 0;
            this.money = 0;
            this.startGame();
        });

        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.currentLevel = 0;
            this.money = 0;
            this.startGame();
        });
    }

    async loadAssets() {
        try {
            this.sprites.player = await loadImage('assets/sprites/olga.png');
            this.sprites.enemies = await loadImage('assets/sprites/enemies.png');
            this.sprites.fancy = await loadImage('assets/sprites/fancy.png');
            this.sprites.ganvest = await loadImage('assets/sprites/ganvest.png');
            this.sprites.powerups = await loadImage('assets/sprites/powerups.png');

            console.log('All assets loaded!');
        } catch (error) {
            console.error('Error loading assets:', error);
        }
    }

    async startGame() {
        this.hideAllScreens();
        document.getElementById('hud').classList.remove('hidden');

        await this.loadLevel(this.currentLevel);
        this.state = 'playing';
        this.audio.startBackgroundMusic(this.currentLevel);
        window.gameAudio = this.audio; // Make audio accessible globally
        this.gameLoop();
    }

    async loadLevel(levelIndex) {
        const level = LEVELS[levelIndex];

        // Load background
        this.background = await loadImage(level.background);

        // Create player
        this.player = new Player(100, 400, this.sprites.player);

        // Create platforms
        this.platforms = level.platforms.map(p => ({ ...p }));

        // Create enemies
        this.enemies = level.enemies.map(e =>
            new Enemy(e.x, e.y, e.type, this.sprites.enemies)
        );

        // Create powerups (now money)
        this.powerups = level.powerups.map(p =>
            new Money(p.x, p.y, p.amount, this.sprites.powerups)
        );

        // Create companion (Fancy) if level has it
        if (level.hasFancy) {
            this.companion = new Companion(this.player.x - 80, this.player.y, this.sprites.fancy);
        } else {
            this.companion = null;
        }

        // Create boss if level has it
        if (level.hasBoss) {
            this.boss = new Boss(level.bossPosition.x, level.bossPosition.y, this.sprites.ganvest);
        } else {
            this.boss = null;
        }

        this.cameraX = 0;

        // Update HUD
        document.getElementById('levelName').textContent = level.name;
        document.getElementById('lives').textContent = this.player.lives;
        document.getElementById('money').textContent = this.money.toLocaleString();
    }

    gameLoop() {
        if (this.state !== 'playing') return;

        this.update();
        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        const level = LEVELS[this.currentLevel];

        // Update player
        this.player.update(this.keys, this.platforms);

        // Update camera to follow player
        this.cameraX = Math.max(0, this.player.x - this.canvas.width / 3);

        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.update(this.platforms);

            const collision = enemy.checkPlayerCollision(this.player);
            if (collision === 'defeat') {
                this.money += level.moneyPerEnemy;
                document.getElementById('money').textContent = this.money.toLocaleString();
                this.audio.playEnemyDefeat();
            } else if (collision === 'damage') {
                if (!this.player.takeDamage()) {
                    this.gameOver();
                } else {
                    document.getElementById('lives').textContent = this.player.lives;
                }
            }
        });

        // Update powerups (money)
        this.powerups.forEach(powerup => {
            powerup.update();
            powerup.checkCollection(this.player, this);
        });

        // Update companion
        if (this.companion) {
            this.companion.update(this.player);
            this.companion.attackNearbyEnemies(this.enemies, this.cameraX);
        }

        // Update boss
        if (this.boss) {
            this.boss.update(this.platforms, this.player);

            const bossCollision = this.boss.checkPlayerCollision(this.player);
            if (bossCollision === 'hit') {
                this.audio.playBossHit();
            }
            if (bossCollision === 'defeated') {
                this.money += 2000000; // Big bonus for defeating boss
                document.getElementById('money').textContent = this.money.toLocaleString();
                this.audio.playVictory();
            }
        }


        // Check goal
        if (checkCollision(this.player.getBounds(), level.goal)) {
            this.levelComplete();
        }

        // Keep player in bounds
        if (this.player.y > this.canvas.height) {
            if (!this.player.takeDamage()) {
                this.gameOver();
            } else {
                this.player.y = 100;
                this.player.velocityY = 0;
                document.getElementById('lives').textContent = this.player.lives;
            }
        }
    }

    render() {
        const ctx = this.ctx;

        // Clear canvas
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        if (this.background) {
            const bgX = -this.cameraX * 0.5;
            ctx.drawImage(this.background, bgX, 0, this.canvas.width * 1.5, this.canvas.height);
        }

        // Draw platforms with brick pattern
        this.platforms.forEach(platform => {
            const px = platform.x - this.cameraX;
            const py = platform.y;
            const pw = platform.width;
            const ph = platform.height;

            // Brick colors
            const brickColor = '#A0522D';
            const mortarColor = '#8B7355';
            const brickHighlight = '#CD853F';

            // Fill background (mortar)
            ctx.fillStyle = mortarColor;
            ctx.fillRect(px, py, pw, ph);

            // Draw bricks
            const brickWidth = 30;
            const brickHeight = 15;
            const mortarWidth = 2;

            ctx.fillStyle = brickColor;
            let row = 0;
            for (let y = py; y < py + ph; y += brickHeight + mortarWidth) {
                const offset = (row % 2 === 0) ? 0 : brickWidth / 2;
                for (let x = px - offset; x < px + pw; x += brickWidth + mortarWidth) {
                    const bx = Math.max(px, x);
                    const bw = Math.min(x + brickWidth, px + pw) - bx;
                    const by = y;
                    const bh = Math.min(brickHeight, py + ph - y);

                    if (bw > 0 && bh > 0) {
                        ctx.fillStyle = brickColor;
                        ctx.fillRect(bx, by, bw, bh);

                        // Add subtle highlight on top edge
                        ctx.fillStyle = brickHighlight;
                        ctx.fillRect(bx, by, bw, 2);
                    }
                }
                row++;
            }

            // Draw border
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.strokeRect(px, py, pw, ph);
        });


        // Draw powerups
        this.powerups.forEach(powerup => powerup.draw(ctx, this.cameraX));

        // Draw enemies
        this.enemies.forEach(enemy => enemy.draw(ctx, this.cameraX));

        // Draw companion
        if (this.companion) {
            this.companion.draw(ctx, this.cameraX);
        }

        // Draw boss
        if (this.boss) {
            this.boss.draw(ctx, this.cameraX);
        }

        // Draw player
        this.player.draw(ctx, this.cameraX);

        // Draw goal
        const level = LEVELS[this.currentLevel];
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 3;
        ctx.fillRect(
            level.goal.x - this.cameraX,
            level.goal.y,
            level.goal.width,
            level.goal.height
        );
        ctx.strokeRect(
            level.goal.x - this.cameraX,
            level.goal.y,
            level.goal.width,
            level.goal.height
        );

        // Draw goal text
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏠', level.goal.x - this.cameraX + 25, level.goal.y + 30);
    }

    async levelComplete() {
        if (this.currentLevel < LEVELS.length - 1) {
            this.currentLevel++;
            this.audio.stopBackgroundMusic();
            await this.loadLevel(this.currentLevel);
            this.audio.startBackgroundMusic(this.currentLevel);
        } else {
            this.victory();
        }
    }


    gameOver() {
        this.state = 'gameOver';
        this.audio.stopBackgroundMusic();
        this.audio.playGameOver();
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('gameOver').classList.remove('hidden');
    }

    victory() {
        this.state = 'victory';
        this.audio.stopBackgroundMusic();
        this.audio.playVictory();
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('victoryMoney').textContent =
            `Заработано: ${this.money.toLocaleString()} ₽`;
        document.getElementById('victory').classList.remove('hidden');
    }

    hideAllScreens() {
        document.getElementById('menu').classList.add('hidden');
        document.getElementById('gameOver').classList.add('hidden');
        document.getElementById('victory').classList.add('hidden');
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    const game = new Game();
});
