// Simple audio system using Web Audio API
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.3;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    // Resume audio context (needed for autoplay policy)
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Play a simple tone
    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;

        this.resume();

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Sound effects
    playJump() {
        this.playTone(400, 0.1, 'square');
        setTimeout(() => this.playTone(500, 0.1, 'square'), 50);
    }

    playEnemyDefeat() {
        this.playTone(800, 0.05, 'sawtooth');
        setTimeout(() => this.playTone(600, 0.05, 'sawtooth'), 50);
        setTimeout(() => this.playTone(400, 0.1, 'sawtooth'), 100);
    }

    playPowerUp() {
        this.playTone(523, 0.1, 'sine'); // C
        setTimeout(() => this.playTone(659, 0.1, 'sine'), 100); // E
        setTimeout(() => this.playTone(784, 0.15, 'sine'), 200); // G
    }

    playDamage() {
        this.playTone(200, 0.2, 'sawtooth');
    }

    playVictory() {
        const notes = [523, 587, 659, 784]; // C D E G
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine'), i * 150);
        });
    }

    playGameOver() {
        this.playTone(400, 0.15, 'sawtooth');
        setTimeout(() => this.playTone(300, 0.15, 'sawtooth'), 150);
        setTimeout(() => this.playTone(200, 0.3, 'sawtooth'), 300);
    }

    playShoot() {
        this.playTone(1000, 0.05, 'square');
    }

    playBossHit() {
        this.playTone(150, 0.1, 'sawtooth');
    }

    // Background music - different melody per level
    startBackgroundMusic(level = 0) {
        if (!this.enabled || !this.audioContext) return;

        // Different melodies for each level
        const melodies = [
            // Level 0: Moscow - Russian-inspired minor melody
            [
                { freq: 440, duration: 0.3 },  // A
                { freq: 493, duration: 0.3 },  // B
                { freq: 523, duration: 0.3 },  // C
                { freq: 493, duration: 0.3 },  // B
                { freq: 440, duration: 0.3 },  // A
                { freq: 392, duration: 0.3 },  // G
                { freq: 440, duration: 0.6 },  // A
            ],
            // Level 1: Belgrade - Balkan-inspired rhythm
            [
                { freq: 587, duration: 0.2 },  // D
                { freq: 659, duration: 0.2 },  // E
                { freq: 698, duration: 0.4 },  // F
                { freq: 659, duration: 0.2 },  // E
                { freq: 587, duration: 0.2 },  // D
                { freq: 523, duration: 0.2 },  // C
                { freq: 587, duration: 0.2 },  // D
                { freq: 698, duration: 0.4 },  // F
            ],
            // Level 2: St. Petersburg - Classical-inspired elegant melody
            [
                { freq: 523, duration: 0.4 },  // C
                { freq: 659, duration: 0.2 },  // E
                { freq: 784, duration: 0.2 },  // G
                { freq: 880, duration: 0.4 },  // A
                { freq: 784, duration: 0.2 },  // G
                { freq: 659, duration: 0.2 },  // E
                { freq: 523, duration: 0.4 },  // C
                { freq: 392, duration: 0.4 },  // G low
            ],
        ];

        const melody = melodies[level] || melodies[0];
        let currentNote = 0;

        // Different tempos per level
        const tempos = [400, 350, 450];
        const tempo = tempos[level] || 400;

        this.musicInterval = setInterval(() => {
            if (!this.enabled) return;

            this.resume();
            const note = melody[currentNote];
            this.playTone(note.freq * 0.5, note.duration, 'triangle'); // Lower octave for bg music

            currentNote = (currentNote + 1) % melody.length;
        }, tempo);
    }


    stopBackgroundMusic() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopBackgroundMusic();
        }
        return this.enabled;
    }
}
