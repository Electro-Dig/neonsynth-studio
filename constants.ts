import { SynthParams, InstrumentType } from './types';

export const STEPS_PER_BAR = 16;
export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Frequencies for notes C1 to B5 roughly
export const NOTE_FREQUENCIES: Record<string, number> = {
  "C1": 32.70, "C#1": 34.65, "D1": 36.71, "D#1": 38.89, "E1": 41.20, "F1": 43.65, "F#1": 46.25, "G1": 49.00, "G#1": 51.91, "A1": 55.00, "A#1": 58.27, "B1": 61.74,
  "C2": 65.41, "C#2": 69.30, "D2": 73.42, "D#2": 77.78, "E2": 82.41, "F2": 87.31, "F#2": 92.50, "G2": 98.00, "G#2": 103.83, "A2": 110.00, "A#2": 116.54, "B2": 123.47,
  "C3": 130.81, "C#3": 138.59, "D3": 146.83, "D#3": 155.56, "E3": 164.81, "F3": 174.61, "F#3": 185.00, "G3": 196.00, "G#3": 207.65, "A3": 220.00, "A#3": 233.08, "B3": 246.94,
  "C4": 261.63, "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63, "F4": 349.23, "F#4": 369.99, "G4": 392.00, "G#4": 415.30, "A4": 440.00, "A#4": 466.16, "B4": 493.88,
  "C5": 523.25, "C#5": 554.37, "D5": 587.33, "D#5": 622.25, "E5": 659.25, "F5": 698.46, "F#5": 739.99, "G5": 783.99, "G#5": 830.61, "A5": 880.00, "A#5": 932.33, "B5": 987.77
};

export const DEFAULT_SYNTH_PARAMS: SynthParams = {
  filterCutoff: 0.6,
  release: 0.4,
  detune: 0.3,
  reverbSend: 0.4
};

// Preset Library for easy sound selection
export const SOUND_LIBRARY: Record<InstrumentType, Record<string, SynthParams>> = {
    [InstrumentType.BASS]: {
        "Rolling Moog": { filterCutoff: 0.35, release: 0.2, detune: 0.1, reverbSend: 0.1 },
        "Cyber Pluck": { filterCutoff: 0.15, release: 0.1, detune: 0.0, reverbSend: 0.05 },
        "Deep Reese": { filterCutoff: 0.6, release: 0.6, detune: 0.3, reverbSend: 0.3 },
        "Acid Saw": { filterCutoff: 0.8, release: 0.2, detune: 0.05, reverbSend: 0.2 },
    },
    [InstrumentType.LEAD]: {
        "Hero Lead": { filterCutoff: 0.7, release: 0.4, detune: 0.25, reverbSend: 0.5 },
        "Glass FM": { filterCutoff: 0.9, release: 0.2, detune: 0.0, reverbSend: 0.4 },
        "Vangelis Brass": { filterCutoff: 0.4, release: 0.8, detune: 0.4, reverbSend: 0.8 },
        "Lo-Fi Chip": { filterCutoff: 1.0, release: 0.05, detune: 0.0, reverbSend: 0.1 },
    },
    [InstrumentType.PAD]: {
        "Jupiter Strings": { filterCutoff: 0.5, release: 0.9, detune: 0.4, reverbSend: 0.9 },
        "Dark Sweep": { filterCutoff: 0.2, release: 0.8, detune: 0.6, reverbSend: 0.7 },
        "Crystal Choir": { filterCutoff: 0.8, release: 1.0, detune: 0.2, reverbSend: 0.8 },
        "Retro Warmth": { filterCutoff: 0.3, release: 0.6, detune: 0.1, reverbSend: 0.6 },
    },
    [InstrumentType.DRUMS]: {
        "LinnDrum Classic": { filterCutoff: 0.8, release: 0.3, detune: 0.0, reverbSend: 0.2 },
        "Gated Reverb": { filterCutoff: 0.6, release: 0.5, detune: 0.1, reverbSend: 0.7 },
        "Tight & Dry": { filterCutoff: 0.9, release: 0.1, detune: 0.0, reverbSend: 0.0 },
        "Lo-Fi Crunch": { filterCutoff: 0.4, release: 0.2, detune: 0.2, reverbSend: 0.1 },
    }
};