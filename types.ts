
export enum InstrumentType {
  BASS = 'BASS',
  LEAD = 'LEAD',
  PAD = 'PAD',
  DRUMS = 'DRUMS'
}

export type ViewMode = 'SEQUENCER' | 'ECHO_POND';

export interface Note {
  step: number; // 0-15 for a 16-step sequencer
  pitch: string; // e.g., "C2", "F#4", or "KICK", "SNARE" for drums
  active: boolean;
}

export interface SynthParams {
  filterCutoff: number; // 0.1 to 1.0
  release: number;      // 0.1 to 1.0
  detune: number;       // 0.0 to 1.0
  reverbSend: number;   // 0.0 to 1.0
}

export interface Track {
  id: string;
  name: string;
  type: InstrumentType;
  color: string; // Tailwind color class based
  volume: number; // 0-1
  muted: boolean;
  synthParams: SynthParams;
  notes: Note[];
}

export interface Song {
  title: string;
  bpm: number;
  key: string;
  description: string;
  tracks: Track[];
}

export const DEFAULT_SONG: Song = {
  title: "Neon Genesis",
  bpm: 110,
  key: "Am",
  description: "A blank canvas waiting for digital dreams.",
  tracks: []
};
