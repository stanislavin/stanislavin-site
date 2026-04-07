// Level definitions
const LEVELS = [
    {
        name: 'Москва',
        background: 'assets/backgrounds/moscow.png',
        platforms: [
            { x: 0, y: 550, width: 800, height: 50 },      // Ground
            { x: 200, y: 450, width: 150, height: 20 },     // Platform 1
            { x: 450, y: 380, width: 150, height: 20 },     // Platform 2
            { x: 100, y: 320, width: 120, height: 20 },     // Platform 3
            { x: 650, y: 280, width: 140, height: 20 },     // Platform 4
            { x: 350, y: 220, width: 100, height: 20 },     // Platform 5
            { x: 1000, y: 450, width: 200, height: 20 },    // Extended platform
            { x: 1300, y: 350, width: 150, height: 20 },
            { x: 1600, y: 550, width: 400, height: 50 },    // Ground extended
        ],
        enemies: [
            { x: 300, y: 400, type: 'snob' },
            { x: 500, y: 320, type: 'poor' },
            { x: 700, y: 500, type: 'snob' },
            { x: 1100, y: 400, type: 'tax' },
            { x: 1400, y: 300, type: 'poor' },
        ],

        powerups: [
            { x: 250, y: 400, amount: 250000 },
            { x: 1350, y: 300, amount: 500000 },
        ],
        goal: { x: 1800, y: 500, width: 50, height: 50 },
        moneyPerEnemy: 250000,
        hasFancy: false,
    },
    {
        name: 'Белград',
        background: 'assets/backgrounds/belgrade.png',
        platforms: [
            { x: 0, y: 550, width: 800, height: 50 },
            { x: 150, y: 470, width: 100, height: 20 },
            { x: 300, y: 400, width: 100, height: 20 },
            { x: 500, y: 350, width: 120, height: 20 },
            { x: 200, y: 280, width: 100, height: 20 },
            { x: 650, y: 450, width: 100, height: 20 },
            { x: 800, y: 380, width: 120, height: 20 },
            { x: 1000, y: 480, width: 150, height: 20 },
            { x: 1200, y: 400, width: 100, height: 20 },
            { x: 1400, y: 330, width: 120, height: 20 },
            { x: 1600, y: 550, width: 500, height: 50 },
        ],
        enemies: [
            { x: 200, y: 500, type: 'snob' },
            { x: 350, y: 350, type: 'tax' },
            { x: 550, y: 300, type: 'poor' },
            { x: 850, y: 330, type: 'tax' },
            { x: 1050, y: 430, type: 'tax' },
            { x: 1250, y: 350, type: 'snob' },
            { x: 1450, y: 280, type: 'poor' },
            { x: 1700, y: 500, type: 'snob' },
        ],

        powerups: [
            { x: 320, y: 350, amount: 500000 },
            { x: 820, y: 330, amount: 750000 },
            { x: 1420, y: 280, amount: 250000 },
        ],
        goal: { x: 2000, y: 500, width: 50, height: 50 },
        hasFancy: true,
        moneyPerEnemy: 500000,
    },
    {
        name: 'Санкт-Петербург',
        background: 'assets/backgrounds/petersburg.png',
        platforms: [
            { x: 0, y: 550, width: 600, height: 50 },
            { x: 100, y: 480, width: 80, height: 20 },
            { x: 250, y: 420, width: 90, height: 20 },
            { x: 420, y: 360, width: 100, height: 20 },
            { x: 600, y: 300, width: 110, height: 20 },
            { x: 150, y: 240, width: 80, height: 20 },
            { x: 780, y: 420, width: 100, height: 20 },
            { x: 950, y: 360, width: 100, height: 20 },
            { x: 1150, y: 480, width: 120, height: 20 },
            { x: 1350, y: 400, width: 100, height: 20 },
            { x: 1550, y: 340, width: 110, height: 20 },
            { x: 1750, y: 280, width: 100, height: 20 },
            { x: 1950, y: 550, width: 600, height: 50 },
            { x: 2300, y: 450, width: 250, height: 20 }, // Boss arena
        ],
        enemies: [
            { x: 150, y: 500, type: 'tax' },
            { x: 300, y: 370, type: 'poor' },
            { x: 470, y: 310, type: 'snob' },
            { x: 650, y: 250, type: 'poor' },
            { x: 830, y: 370, type: 'tax' },
            { x: 1000, y: 310, type: 'snob' },
            { x: 1200, y: 430, type: 'snob' },
            { x: 1400, y: 350, type: 'poor' },
            { x: 1600, y: 290, type: 'tax' },
            { x: 2000, y: 500, type: 'tax' },
        ],

        powerups: [
            { x: 270, y: 370, amount: 500000 },
            { x: 620, y: 250, amount: 1000000 },
            { x: 1000, y: 260, amount: 500000 },
            { x: 1570, y: 290, amount: 1000000 },
        ],
        hasBoss: true,
        hasFancy: true,
        bossPosition: { x: 2400, y: 370 },
        goal: { x: 2650, y: 500, width: 50, height: 50 },
        moneyPerEnemy: 500000,
    }
];
