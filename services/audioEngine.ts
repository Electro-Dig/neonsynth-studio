import { NOTE_FREQUENCIES } from '../constants';
import { InstrumentType, SynthParams } from '../types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  constructor() {}

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Master Bus Processing
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.6;

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-20, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      // Setup Effects
      this.setupReverb();
      this.setupDelay();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private setupReverb() {
    if (!this.ctx) return;
    this.reverbNode = this.ctx.createConvolver();
    
    // Create a simple impulse response for a "Plate" style reverb
    const duration = 2.5;
    const decay = 2.0;
    const rate = this.ctx.sampleRate;
    const length = rate * duration;
    const impulse = this.ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      // Exponential decay noise
      const n = i / length;
      const env = Math.pow(1 - n, decay);
      left[i] = (Math.random() * 2 - 1) * env;
      right[i] = (Math.random() * 2 - 1) * env;
    }

    this.reverbNode.buffer = impulse;
    this.reverbNode.connect(this.masterGain!);
  }

  private setupDelay() {
    if (!this.ctx) return;
    this.delayNode = this.ctx.createDelay();
    this.delayNode.delayTime.value = 0.375; // Dotted 8thish note at 120bpm approx, fixed for vibe
    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.value = 0.4;

    this.delayNode.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);
    this.delayNode.connect(this.masterGain!);
  }

  getFreq(pitch: string): number {
    return NOTE_FREQUENCIES[pitch] || 440;
  }

  playNote(instrument: InstrumentType, pitch: string, startTime: number, duration: number, volume: number, params: SynthParams) {
    if (!this.ctx || !this.masterGain) return;
    if (volume <= 0) return;

    const now = startTime;
    const freq = this.getFreq(pitch);

    switch (instrument) {
      case InstrumentType.BASS:
        this.playBass(freq, now, duration, volume, params);
        break;
      case InstrumentType.LEAD:
        this.playLead(freq, now, duration, volume, params);
        break;
      case InstrumentType.PAD:
        this.playPadChord(freq, now, duration, volume, params);
        break;
      case InstrumentType.DRUMS:
        this.playDrum(pitch, now, volume, params);
        break;
    }
  }

  private playBass(freq: number, time: number, duration: number, vol: number, params: SynthParams) {
    if (!this.ctx || !this.masterGain) return;
    
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator(); // Sub
    const filter = this.ctx.createBiquadFilter();
    const amp = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.value = freq;
    // Detune adds thickness for bass
    osc1.detune.value = (params.detune * 20) - 10; 

    osc2.type = 'sine';
    osc2.frequency.value = freq / 2; // Sub octave

    // Filter Envelope
    // Cutoff mapped 100Hz -> 3000Hz (Lowpass)
    // Lower Q for punchier bass
    const maxCutoff = 80 + (params.filterCutoff * 3500);
    
    filter.type = 'lowpass';
    filter.Q.value = 2; 
    filter.frequency.setValueAtTime(80, time);
    filter.frequency.linearRampToValueAtTime(maxCutoff, time + 0.005); // Fast attack
    filter.frequency.exponentialRampToValueAtTime(80, time + duration * 0.6 + 0.1); // Decay

    // Amp Envelope
    // Release mapped 0.05s -> 0.5s
    const releaseTime = 0.05 + (params.release * 0.5);

    amp.gain.setValueAtTime(0, time);
    amp.gain.linearRampToValueAtTime(vol, time + 0.005);
    amp.gain.exponentialRampToValueAtTime(0.001, time + duration + releaseTime);

    osc1.connect(filter);
    osc2.connect(filter); 
    filter.connect(amp);
    amp.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + releaseTime + 0.1);
    osc2.stop(time + duration + releaseTime + 0.1);
  }

  private playLead(freq: number, time: number, duration: number, vol: number, params: SynthParams) {
    if (!this.ctx || !this.masterGain) return;

    // SuperSaw-ish
    const oscs: OscillatorNode[] = [];
    // Detune spread increases with param
    const spread = params.detune * 30; 
    const detunes = [0, spread, -spread]; 
    const types: OscillatorType[] = ['sawtooth', 'sawtooth', 'square'];

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    // Map cutoff 500 -> 12000
    const cutoff = 400 + (params.filterCutoff * 10000);
    filter.frequency.value = cutoff;
    filter.Q.value = 1;
    
    const amp = this.ctx.createGain();
    // Release 0.1 -> 2.0
    const releaseTime = 0.1 + (params.release * 1.0);

    amp.gain.setValueAtTime(0, time);
    amp.gain.linearRampToValueAtTime(vol * 0.6, time + 0.02);
    amp.gain.linearRampToValueAtTime(vol * 0.4, time + 0.1);
    amp.gain.linearRampToValueAtTime(0.001, time + duration + releaseTime);

    // Effect Sends
    const reverbSend = this.ctx.createGain();
    reverbSend.gain.value = params.reverbSend * 0.6;
    const delaySend = this.ctx.createGain();
    delaySend.gain.value = 0.3;

    amp.connect(this.masterGain);
    if (this.reverbNode) amp.connect(reverbSend).connect(this.reverbNode);
    if (this.delayNode) amp.connect(delaySend).connect(this.delayNode);

    types.forEach((type, i) => {
      const osc = this.ctx!.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = detunes[i];
      osc.connect(filter);
      oscs.push(osc);
      osc.start(time);
      osc.stop(time + duration + releaseTime + 0.2);
    });

    filter.connect(amp);
  }

  private playPadChord(rootFreq: number, time: number, duration: number, vol: number, params: SynthParams) {
    if (!this.ctx || !this.masterGain) return;

    const intervals = [1, 1.189, 1.498]; // Minor Triad
    
    const mainFilter = this.ctx.createBiquadFilter();
    mainFilter.type = 'lowpass';
    mainFilter.Q.value = 0.5;
    
    // Pad filter usually sweeps.
    const baseCutoff = 200 + (params.filterCutoff * 600);
    const peakCutoff = 600 + (params.filterCutoff * 3000);

    mainFilter.frequency.setValueAtTime(baseCutoff, time);
    mainFilter.frequency.linearRampToValueAtTime(peakCutoff, time + duration * 0.6); // Swell
    mainFilter.frequency.linearRampToValueAtTime(baseCutoff, time + duration + 1.0);

    const mainAmp = this.ctx.createGain();
    // Pads have long release: 0.5 -> 4.0s
    const releaseTime = 0.5 + (params.release * 4.0);

    mainAmp.gain.setValueAtTime(0, time);
    mainAmp.gain.linearRampToValueAtTime(vol * 0.3, time + duration * 0.4); // Slow attack
    mainAmp.gain.linearRampToValueAtTime(0.001, time + duration + releaseTime); 

    const reverbSend = this.ctx.createGain();
    reverbSend.gain.value = params.reverbSend * 1.2; // Pads love reverb

    mainAmp.connect(this.masterGain);
    if (this.reverbNode) mainAmp.connect(reverbSend).connect(this.reverbNode);

    const detuneAmount = params.detune * 12;

    intervals.forEach(ratio => {
      const osc1 = this.ctx!.createOscillator();
      const osc2 = this.ctx!.createOscillator();
      
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      
      osc1.frequency.value = rootFreq * ratio;
      osc2.frequency.value = rootFreq * ratio;
      
      osc1.detune.value = -detuneAmount;
      osc2.detune.value = detuneAmount;

      osc1.connect(mainFilter);
      osc2.connect(mainFilter);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration + releaseTime + 0.5);
      osc2.stop(time + duration + releaseTime + 0.5);
    });

    mainFilter.connect(mainAmp);
  }

  private playDrum(type: string, time: number, volume: number, params: SynthParams) {
    if (!this.ctx || !this.masterGain) return;
    
    const reverbSend = this.ctx.createGain();
    reverbSend.gain.value = params.reverbSend * 0.5;
    
    // KICK
    if (type === "KICK" || type === "C2") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      const startFreq = 150 + (params.detune * 50);
      const endFreq = 35 + (params.detune * 10);

      osc.frequency.setValueAtTime(startFreq, time);
      osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.12);
      
      gain.gain.setValueAtTime(volume * 1.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5 + (params.release * 0.2));

      // Click
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'square';
      clickOsc.frequency.value = 3000 * params.filterCutoff + 500;
      clickGain.gain.setValueAtTime(volume * 0.3, time);
      clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.015);
      
      osc.connect(gain).connect(this.masterGain);
      clickOsc.connect(clickGain).connect(this.masterGain);
      
      osc.start(time);
      osc.stop(time + 0.6);
      clickOsc.start(time);
      clickOsc.stop(time + 0.1);
    } 
    // SNARE
    else if (type === "SNARE" || type === "D2" || type === "E2") {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220 + (params.detune * 50), time);
      osc.frequency.exponentialRampToValueAtTime(120, time + 0.15);
      oscGain.gain.setValueAtTime(volume * 0.7, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 1000 + (params.filterCutoff * 2000);
      
      const noiseGain = this.ctx.createGain();
      // Gated reverb feel: Hold volume then cut
      noiseGain.gain.setValueAtTime(volume * 0.9, time);
      noiseGain.gain.linearRampToValueAtTime(volume * 0.5, time + 0.2);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.35 + (params.release * 0.3));

      osc.connect(oscGain).connect(this.masterGain);
      noise.connect(noiseFilter).connect(noiseGain).connect(this.masterGain);
      
      // Snare loves reverb
      if (this.reverbNode) {
          const snareRev = this.ctx.createGain();
          snareRev.gain.value = params.reverbSend * 1.5;
          noiseGain.connect(snareRev).connect(this.reverbNode);
      }

      osc.start(time);
      osc.stop(time + 0.2);
      noise.start(time);
      noise.stop(time + 1.0);
    }
    // HIHAT
    else if (type === "HIHAT" || type.includes("F#")) {
      const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'highpass'; // Crisper hi-hats
      bandpass.frequency.value = 6000 + (params.filterCutoff * 5000);
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.25, time);
      const dur = 0.04 + (params.release * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      ratios.forEach(ratio => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'square';
        osc.frequency.value = 60 * ratio + (params.detune * 200); 
        osc.connect(bandpass);
        osc.start(time);
        osc.stop(time + dur + 0.05);
      });

      bandpass.connect(gain).connect(this.masterGain);
    }
  }

  get currentTime() {
    return this.ctx?.currentTime || 0;
  }
}

export const audioEngine = new AudioEngine();