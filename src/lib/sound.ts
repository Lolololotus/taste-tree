'use client';

class SoundManager {
    private static instance: SoundManager;
    private ctx: AudioContext | null = null;
    private bgmOscillator: OscillatorNode | null = null;
    private bgmGain: GainNode | null = null;
    private isMuted: boolean = false;

    private constructor() { }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    private init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    public playTypewriter() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        // Creating a short "click" noise
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // 8-bit-ish square click
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);

        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.05);

        // Add a secondary high tick
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(2000, t);
        gain2.gain.setValueAtTime(0.02, t);
        gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.02);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(t);
        osc2.stop(t + 0.02);
    }

    public playGrowth() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Success shine sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t); // A4
        osc.frequency.linearRampToValueAtTime(880, t + 0.2); // A5

        gain.gain.setValueAtTime(0.05, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.5);
    }

    public playSeed() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.2);

        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.2);
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted && this.bgmGain) {
            this.bgmGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
        } else if (!this.isMuted && this.bgmGain) {
            this.bgmGain.gain.setTargetAtTime(0.05, this.ctx?.currentTime || 0, 0.5);
        }
        return this.isMuted;
    }
}

export const soundManager = SoundManager.getInstance();
