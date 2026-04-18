
import { Song, InstrumentType } from './types';
import { SOUND_LIBRARY } from './constants';

export const PRESETS: Song[] = [
  {
    title: "NEON SKYLINE",
    bpm: 118,
    key: "Fm",
    description: "Classic Outrun. Driving bass, heroic lead, and punchy drums.",
    tracks: [
      {
        id: 's1-bass', name: 'Rolling Moog', type: InstrumentType.BASS, color: 'blue', volume: 0.85, muted: false,
        synthParams: SOUND_LIBRARY.BASS["Rolling Moog"],
        notes: [
          { step: 0, pitch: "F1", active: true }, { step: 1, pitch: "F1", active: true }, { step: 2, pitch: "F1", active: true }, { step: 3, pitch: "F1", active: true },
          { step: 4, pitch: "F1", active: true }, { step: 5, pitch: "F1", active: true }, { step: 6, pitch: "F1", active: true }, { step: 7, pitch: "F1", active: true },
          { step: 8, pitch: "Db1", active: true }, { step: 9, pitch: "Db1", active: true }, { step: 10, pitch: "Db1", active: true }, { step: 11, pitch: "Db1", active: true },
          { step: 12, pitch: "Eb1", active: true }, { step: 13, pitch: "Eb1", active: true }, { step: 14, pitch: "Eb1", active: true }, { step: 15, pitch: "Eb1", active: true },
        ]
      },
      {
        id: 's1-lead', name: 'Hero Lead', type: InstrumentType.LEAD, color: 'fuchsia', volume: 0.75, muted: false,
        synthParams: SOUND_LIBRARY.LEAD["Hero Lead"],
        notes: [
          { step: 0, pitch: "C5", active: true }, { step: 3, pitch: "Bb4", active: true },
          { step: 6, pitch: "Ab4", active: true }, { step: 7, pitch: "Bb4", active: true },
          { step: 14, pitch: "C5", active: true },
        ]
      },
      {
        id: 's1-pad', name: 'Jupiter Strings', type: InstrumentType.PAD, color: 'purple', volume: 0.6, muted: false,
        synthParams: SOUND_LIBRARY.PAD["Jupiter Strings"],
        notes: [
          { step: 0, pitch: "F3", active: true }, 
          { step: 8, pitch: "Ab3", active: true }, 
        ]
      },
      {
        id: 's1-drums', name: 'LinnDrum', type: InstrumentType.DRUMS, color: 'yellow', volume: 0.9, muted: false,
        synthParams: SOUND_LIBRARY.DRUMS["LinnDrum Classic"],
        notes: [
          { step: 0, pitch: "KICK", active: true }, { step: 8, pitch: "KICK", active: true },
          { step: 4, pitch: "SNARE", active: true }, { step: 12, pitch: "SNARE", active: true },
          { step: 2, pitch: "HIHAT", active: true }, { step: 6, pitch: "HIHAT", active: true },
          { step: 10, pitch: "HIHAT", active: true }, { step: 14, pitch: "HIHAT", active: true },
        ]
      },
    ]
  },
  {
    title: "NEON TOKYO",
    bpm: 124,
    key: "Dm",
    description: "Future Funk & French House vibes. Groovy bass and filtered leads.",
    tracks: [
      {
        id: 'nt-bass', name: 'Slap Bass', type: InstrumentType.BASS, color: 'cyan', volume: 0.9, muted: false,
        synthParams: SOUND_LIBRARY.BASS["Acid Saw"],
        notes: [
          { step: 0, pitch: "D1", active: true }, { step: 2, pitch: "D2", active: true },
          { step: 4, pitch: "D1", active: true }, { step: 6, pitch: "F1", active: true },
          { step: 8, pitch: "G1", active: true }, { step: 10, pitch: "A1", active: true },
          { step: 12, pitch: "C2", active: true }, { step: 14, pitch: "A1", active: true },
        ]
      },
      {
        id: 'nt-lead', name: 'Disco Keys', type: InstrumentType.LEAD, color: 'pink', volume: 0.7, muted: false,
        synthParams: SOUND_LIBRARY.LEAD["Glass FM"],
        notes: [
          { step: 4, pitch: "F4", active: true }, { step: 4, pitch: "A4", active: true },
          { step: 12, pitch: "E4", active: true }, { step: 12, pitch: "G4", active: true },
        ]
      },
      {
        id: 'nt-pad', name: 'Warmth', type: InstrumentType.PAD, color: 'orange', volume: 0.6, muted: false,
        synthParams: SOUND_LIBRARY.PAD["Retro Warmth"],
        notes: [
          { step: 0, pitch: "D3", active: true },
          { step: 8, pitch: "F3", active: true },
        ]
      },
      {
        id: 'nt-drums', name: 'House Kit', type: InstrumentType.DRUMS, color: 'green', volume: 0.9, muted: false,
        synthParams: SOUND_LIBRARY.DRUMS["Tight & Dry"],
        notes: [
          { step: 0, pitch: "KICK", active: true }, { step: 4, pitch: "KICK", active: true },
          { step: 8, pitch: "KICK", active: true }, { step: 12, pitch: "KICK", active: true },
          { step: 2, pitch: "HIHAT", active: true }, { step: 6, pitch: "HIHAT", active: true },
          { step: 10, pitch: "HIHAT", active: true }, { step: 14, pitch: "HIHAT", active: true },
          { step: 4, pitch: "SNARE", active: true }, { step: 12, pitch: "SNARE", active: true },
        ]
      }
    ]
  },
  {
    title: "TURBO KILLER",
    bpm: 140,
    key: "Em",
    description: "Aggressive Darksynth. High tempo, distorted bass.",
    tracks: [
      {
        id: 'tk-bass', name: 'Distortion', type: InstrumentType.BASS, color: 'red', volume: 0.95, muted: false,
        synthParams: { ...SOUND_LIBRARY.BASS["Deep Reese"], filterCutoff: 0.9, detune: 0.4 },
        notes: Array.from({length: 16}).map((_, i) => ({ step: i, pitch: "E1", active: true }))
      },
      {
        id: 'tk-lead', name: 'Screamer', type: InstrumentType.LEAD, color: 'orange', volume: 0.8, muted: false,
        synthParams: { ...SOUND_LIBRARY.LEAD["Hero Lead"], detune: 0.5 },
        notes: [
          { step: 0, pitch: "E4", active: true }, { step: 3, pitch: "G4", active: true },
          { step: 6, pitch: "B4", active: true }, { step: 9, pitch: "C5", active: true },
          { step: 12, pitch: "B4", active: true }, { step: 15, pitch: "G4", active: true },
        ]
      },
      {
        id: 'tk-pad', name: 'Horror', type: InstrumentType.PAD, color: 'slate', volume: 0.5, muted: false,
        synthParams: SOUND_LIBRARY.PAD["Dark Sweep"],
        notes: [
          { step: 0, pitch: "E3", active: true },
          { step: 8, pitch: "C3", active: true },
        ]
      },
      {
        id: 'tk-drums', name: 'Heavy Metal', type: InstrumentType.DRUMS, color: 'zinc', volume: 1.0, muted: false,
        synthParams: SOUND_LIBRARY.DRUMS["Gated Reverb"],
        notes: [
          { step: 0, pitch: "KICK", active: true }, { step: 2, pitch: "KICK", active: true },
          { step: 4, pitch: "SNARE", active: true }, { step: 6, pitch: "KICK", active: true },
          { step: 8, pitch: "KICK", active: true }, { step: 10, pitch: "KICK", active: true },
          { step: 12, pitch: "SNARE", active: true }, { step: 14, pitch: "KICK", active: true },
        ]
      }
    ]
  },
  {
    title: "DIGITAL LOVE",
    bpm: 118,
    key: "Bm",
    description: "French House filter sweeps and catchy hooks.",
    tracks: [
      {
        id: 'dl-bass', name: 'Funky Bass', type: InstrumentType.BASS, color: 'fuchsia', volume: 0.85, muted: false,
        synthParams: SOUND_LIBRARY.BASS["Cyber Pluck"],
        notes: [
          { step: 0, pitch: "B1", active: true }, { step: 2, pitch: "B2", active: true },
          { step: 3, pitch: "B1", active: true }, { step: 5, pitch: "D2", active: true },
          { step: 8, pitch: "A1", active: true }, { step: 10, pitch: "A2", active: true },
          { step: 11, pitch: "A1", active: true }, { step: 14, pitch: "E2", active: true },
        ]
      },
      {
        id: 'dl-lead', name: 'Filtered', type: InstrumentType.LEAD, color: 'yellow', volume: 0.6, muted: false,
        synthParams: { ...SOUND_LIBRARY.LEAD["Vangelis Brass"], filterCutoff: 0.3, release: 0.1 },
        notes: [
          { step: 2, pitch: "D4", active: true }, { step: 3, pitch: "F#4", active: true },
          { step: 5, pitch: "A4", active: true }, { step: 10, pitch: "B4", active: true },
        ]
      },
      {
        id: 'dl-pad', name: 'Phaser Pad', type: InstrumentType.PAD, color: 'purple', volume: 0.5, muted: false,
        synthParams: SOUND_LIBRARY.PAD["Crystal Choir"],
        notes: [
          { step: 0, pitch: "B2", active: true },
          { step: 8, pitch: "A2", active: true },
        ]
      },
      {
        id: 'dl-drums', name: 'Club Mix', type: InstrumentType.DRUMS, color: 'cyan', volume: 0.9, muted: false,
        synthParams: SOUND_LIBRARY.DRUMS["LinnDrum Classic"],
        notes: [
           { step: 0, pitch: "KICK", active: true }, { step: 4, pitch: "KICK", active: true },
           { step: 8, pitch: "KICK", active: true }, { step: 12, pitch: "KICK", active: true },
           { step: 2, pitch: "HIHAT", active: true }, { step: 6, pitch: "HIHAT", active: true },
           { step: 10, pitch: "HIHAT", active: true }, { step: 14, pitch: "HIHAT", active: true },
           { step: 4, pitch: "SNARE", active: true }, { step: 12, pitch: "SNARE", active: true },
        ]
      }
    ]
  },
  {
    title: "MIAMI NIGHTS",
    bpm: 100,
    key: "Cm",
    description: "Classic 80s cop show soundtrack vibes.",
    tracks: [
      {
        id: 'mn-bass', name: 'Moog Bass', type: InstrumentType.BASS, color: 'blue', volume: 0.9, muted: false,
        synthParams: SOUND_LIBRARY.BASS["Rolling Moog"],
        notes: [
           { step: 0, pitch: "C1", active: true }, { step: 1, pitch: "C2", active: true },
           { step: 2, pitch: "C1", active: true }, { step: 3, pitch: "C2", active: true },
           { step: 8, pitch: "Eb1", active: true }, { step: 9, pitch: "Eb2", active: true },
           { step: 12, pitch: "F1", active: true }, { step: 13, pitch: "F2", active: true },
        ]
      },
      {
        id: 'mn-lead', name: 'Poly Synth', type: InstrumentType.LEAD, color: 'teal', volume: 0.65, muted: false,
        synthParams: SOUND_LIBRARY.LEAD["Hero Lead"],
        notes: [
           { step: 0, pitch: "G4", active: true }, { step: 4, pitch: "Bb4", active: true },
           { step: 8, pitch: "C5", active: true }, { step: 14, pitch: "G4", active: true },
        ]
      },
      {
        id: 'mn-pad', name: 'Night Pad', type: InstrumentType.PAD, color: 'indigo', volume: 0.5, muted: false,
        synthParams: SOUND_LIBRARY.PAD["Dark Sweep"],
        notes: [
           { step: 0, pitch: "C3", active: true },
           { step: 8, pitch: "Eb3", active: true },
        ]
      },
      {
        id: 'mn-drums', name: 'Miami Drums', type: InstrumentType.DRUMS, color: 'pink', volume: 0.9, muted: false,
        synthParams: SOUND_LIBRARY.DRUMS["Gated Reverb"],
        notes: [
           { step: 0, pitch: "KICK", active: true }, { step: 4, pitch: "SNARE", active: true },
           { step: 8, pitch: "KICK", active: true }, { step: 10, pitch: "KICK", active: true },
           { step: 12, pitch: "SNARE", active: true }, { step: 15, pitch: "SNARE", active: true },
        ]
      }
    ]
  },
  {
    title: "CYBER NOIR",
    bpm: 90,
    key: "Cm",
    description: "Dark, moody, and cinematic. Slow tempo with heavy atmosphere.",
    tracks: [
      {
        id: 's2-bass', name: 'Deep Reese', type: InstrumentType.BASS, color: 'red', volume: 0.9, muted: false,
        synthParams: SOUND_LIBRARY.BASS["Deep Reese"],
        notes: [
          { step: 0, pitch: "C1", active: true }, { step: 3, pitch: "C1", active: true },
          { step: 6, pitch: "Eb1", active: true }, { step: 9, pitch: "Bb0", active: true },
          { step: 14, pitch: "C1", active: true },
        ]
      },
      {
        id: 's2-lead', name: 'Vangelis Brass', type: InstrumentType.LEAD, color: 'orange', volume: 0.7, muted: false,
        synthParams: SOUND_LIBRARY.LEAD["Vangelis Brass"],
        notes: [
          { step: 2, pitch: "G4", active: true }, 
          { step: 10, pitch: "F4", active: true }, { step: 12, pitch: "Eb4", active: true },
        ]
      },
      {
        id: 's2-pad', name: 'Dark Sweep', type: InstrumentType.PAD, color: 'slate', volume: 0.65, muted: false,
        synthParams: SOUND_LIBRARY.PAD["Dark Sweep"],
        notes: [
          { step: 0, pitch: "C3", active: true }, 
          { step: 8, pitch: "Ab2", active: true }, 
        ]
      },
      {
        id: 's2-drums', name: 'Gated Reverb', type: InstrumentType.DRUMS, color: 'cyan', volume: 0.95, muted: false,
        synthParams: SOUND_LIBRARY.DRUMS["Gated Reverb"],
        notes: [
          { step: 0, pitch: "KICK", active: true }, { step: 8, pitch: "KICK", active: true },
          { step: 15, pitch: "KICK", active: true },
          { step: 4, pitch: "SNARE", active: true }, { step: 12, pitch: "SNARE", active: true },
        ]
      },
    ]
  },
  {
    title: "VHS DREAMS",
    bpm: 85,
    key: "Eb",
    description: "Lo-fi chillwave. Wobbly pitch and relaxed beats.",
    tracks: [
      {
        id: 'vhs-bass', name: 'Sub', type: InstrumentType.BASS, color: 'indigo', volume: 0.8, muted: false,
        synthParams: { ...SOUND_LIBRARY.BASS["Deep Reese"], filterCutoff: 0.2 },
        notes: [
          { step: 0, pitch: "Eb1", active: true }, { step: 8, pitch: "Ab0", active: true },
          { step: 14, pitch: "Bb0", active: true },
        ]
      },
      {
        id: 'vhs-lead', name: 'Wobbly Key', type: InstrumentType.LEAD, color: 'violet', volume: 0.6, muted: false,
        synthParams: { ...SOUND_LIBRARY.LEAD["Lo-Fi Chip"], detune: 0.6, release: 0.4 },
        notes: [
           { step: 2, pitch: "Bb4", active: true }, { step: 3, pitch: "C5", active: true },
           { step: 6, pitch: "G4", active: true }, { step: 10, pitch: "F4", active: true },
        ]
      },
      {
        id: 'vhs-pad', name: 'Dusty Pad', type: InstrumentType.PAD, color: 'pink', volume: 0.5, muted: false,
        synthParams: SOUND_LIBRARY.PAD["Retro Warmth"],
        notes: [
           { step: 0, pitch: "Eb3", active: true },
           { step: 8, pitch: "C3", active: true },
        ]
      },
      {
        id: 'vhs-drums', name: 'Lo-Fi', type: InstrumentType.DRUMS, color: 'emerald', volume: 0.8, muted: false,
        synthParams: SOUND_LIBRARY.DRUMS["Lo-Fi Crunch"],
        notes: [
           { step: 0, pitch: "KICK", active: true }, { step: 8, pitch: "KICK", active: true },
           { step: 10, pitch: "KICK", active: true },
           { step: 4, pitch: "SNARE", active: true }, { step: 12, pitch: "SNARE", active: true },
        ]
      }
    ]
  },
  {
    title: "ITALO HEAT",
    bpm: 122,
    key: "F#m",
    description: "Italo Disco style. Melodic bass and bright leads.",
    tracks: [
      {
        id: 'ih-bass', name: 'Arp Bass', type: InstrumentType.BASS, color: 'orange', volume: 0.8, muted: false,
        synthParams: SOUND_LIBRARY.BASS["Rolling Moog"],
        notes: [
           { step: 0, pitch: "F#1", active: true }, { step: 1, pitch: "A1", active: true },
           { step: 2, pitch: "F#1", active: true }, { step: 3, pitch: "C#2", active: true },
           { step: 4, pitch: "F#1", active: true }, { step: 5, pitch: "A1", active: true },
           { step: 6, pitch: "F#1", active: true }, { step: 7, pitch: "E1", active: true },
           { step: 8, pitch: "F#1", active: true }, { step: 9, pitch: "A1", active: true },
           { step: 10, pitch: "F#1", active: true }, { step: 11, pitch: "C#2", active: true },
           { step: 12, pitch: "F#1", active: true }, { step: 13, pitch: "A1", active: true },
           { step: 14, pitch: "F#1", active: true }, { step: 15, pitch: "E1", active: true },
        ]
      },
      {
        id: 'ih-lead', name: 'Bright Saw', type: InstrumentType.LEAD, color: 'yellow', volume: 0.7, muted: false,
        synthParams: SOUND_LIBRARY.LEAD["Hero Lead"],
        notes: [
           { step: 0, pitch: "C#5", active: true }, { step: 2, pitch: "A4", active: true },
           { step: 4, pitch: "F#4", active: true }, { step: 6, pitch: "A4", active: true },
           { step: 12, pitch: "E5", active: true },
        ]
      },
      {
        id: 'ih-pad', name: 'String', type: InstrumentType.PAD, color: 'red', volume: 0.5, muted: false,
        synthParams: SOUND_LIBRARY.PAD["Jupiter Strings"],
        notes: [
           { step: 0, pitch: "F#3", active: true },
           { step: 8, pitch: "A3", active: true },
        ]
      },
      {
        id: 'ih-drums', name: 'Disco Kit', type: InstrumentType.DRUMS, color: 'cyan', volume: 0.9, muted: false,
        synthParams: SOUND_LIBRARY.DRUMS["LinnDrum Classic"],
        notes: [
           { step: 0, pitch: "KICK", active: true }, { step: 4, pitch: "KICK", active: true },
           { step: 8, pitch: "KICK", active: true }, { step: 12, pitch: "KICK", active: true },
           { step: 2, pitch: "HIHAT", active: true }, { step: 6, pitch: "HIHAT", active: true },
           { step: 10, pitch: "HIHAT", active: true }, { step: 14, pitch: "HIHAT", active: true },
           { step: 4, pitch: "SNARE", active: true }, { step: 12, pitch: "SNARE", active: true },
        ]
      }
    ]
  },
  {
    title: "MEMORY TAPE",
    bpm: 105,
    key: "Eb",
    description: "Dreamwave aesthetic. Washed out pads and nostalgic melodies.",
    tracks: [
      {
        id: 's3-bass', name: 'Cyber Pluck', type: InstrumentType.BASS, color: 'pink', volume: 0.8, muted: false,
        synthParams: SOUND_LIBRARY.BASS["Cyber Pluck"],
        notes: [
          { step: 0, pitch: "Eb2", active: true }, { step: 2, pitch: "Eb2", active: true },
          { step: 4, pitch: "Bb1", active: true }, { step: 6, pitch: "Bb1", active: true },
          { step: 8, pitch: "Ab1", active: true }, { step: 10, pitch: "Ab1", active: true },
          { step: 12, pitch: "G1", active: true }, { step: 14, pitch: "Bb1", active: true },
        ]
      },
      {
        id: 's3-lead', name: 'Glass FM', type: InstrumentType.LEAD, color: 'cyan', volume: 0.6, muted: false,
        synthParams: SOUND_LIBRARY.LEAD["Glass FM"],
        notes: [
          { step: 0, pitch: "G4", active: true }, { step: 2, pitch: "Bb4", active: true },
          { step: 4, pitch: "C5", active: true }, 
          { step: 12, pitch: "D5", active: true },
        ]
      },
      {
        id: 's3-pad', name: 'Retro Warmth', type: InstrumentType.PAD, color: 'indigo', volume: 0.7, muted: false,
        synthParams: SOUND_LIBRARY.PAD["Retro Warmth"],
        notes: [
          { step: 0, pitch: "Eb3", active: true }, 
          { step: 8, pitch: "C3", active: true }, 
        ]
      },
      {
        id: 's3-drums', name: 'Tight & Dry', type: InstrumentType.DRUMS, color: 'emerald', volume: 0.8, muted: false,
        synthParams: SOUND_LIBRARY.DRUMS["Tight & Dry"],
        notes: [
          { step: 0, pitch: "KICK", active: true }, { step: 4, pitch: "KICK", active: true },
          { step: 8, pitch: "KICK", active: true }, { step: 12, pitch: "KICK", active: true },
          { step: 2, pitch: "HIHAT", active: true }, { step: 6, pitch: "HIHAT", active: true },
          { step: 10, pitch: "HIHAT", active: true }, { step: 14, pitch: "HIHAT", active: true },
          { step: 4, pitch: "SNARE", active: true }, { step: 12, pitch: "SNARE", active: true },
        ]
      },
    ]
  },
  {
    title: "ARCADE HERO",
    bpm: 128,
    key: "Gm",
    description: "Upbeat, chiptune-infused synthwave. Fast and energetic.",
    tracks: [
      {
        id: 's4-bass', name: 'Acid Saw', type: InstrumentType.BASS, color: 'lime', volume: 0.85, muted: false,
        synthParams: SOUND_LIBRARY.BASS["Acid Saw"],
        notes: [
           { step: 0, pitch: "G1", active: true }, { step: 2, pitch: "G2", active: true },
           { step: 4, pitch: "G1", active: true }, { step: 6, pitch: "Bb1", active: true },
           { step: 8, pitch: "C2", active: true }, { step: 10, pitch: "C3", active: true },
           { step: 12, pitch: "D2", active: true }, { step: 14, pitch: "F2", active: true },
        ]
      },
      {
        id: 's4-lead', name: 'Lo-Fi Chip', type: InstrumentType.LEAD, color: 'yellow', volume: 0.7, muted: false,
        synthParams: SOUND_LIBRARY.LEAD["Lo-Fi Chip"],
        notes: [
           { step: 0, pitch: "G4", active: true }, { step: 1, pitch: "A4", active: true }, { step: 2, pitch: "Bb4", active: true },
           { step: 4, pitch: "D5", active: true }, { step: 6, pitch: "C5", active: true },
           { step: 12, pitch: "G4", active: true }, { step: 14, pitch: "F4", active: true },
        ]
      },
      {
        id: 's4-pad', name: 'Crystal Choir', type: InstrumentType.PAD, color: 'sky', volume: 0.5, muted: false,
        synthParams: SOUND_LIBRARY.PAD["Crystal Choir"],
        notes: [
           { step: 0, pitch: "G3", active: true },
           { step: 8, pitch: "Eb3", active: true },
        ]
      },
      {
        id: 's4-drums', name: 'Lo-Fi Crunch', type: InstrumentType.DRUMS, color: 'fuchsia', volume: 0.9, muted: false,
        synthParams: SOUND_LIBRARY.DRUMS["Lo-Fi Crunch"],
        notes: [
            { step: 0, pitch: "KICK", active: true }, { step: 4, pitch: "SNARE", active: true },
            { step: 8, pitch: "KICK", active: true }, { step: 12, pitch: "SNARE", active: true },
            { step: 14, pitch: "KICK", active: true },
            { step: 2, pitch: "HIHAT", active: true }, { step: 6, pitch: "HIHAT", active: true },
            { step: 10, pitch: "HIHAT", active: true }, { step: 14, pitch: "HIHAT", active: true },
        ]
      }
    ]
  },
  {
    title: "TECH NOIR",
    bpm: 100,
    key: "Am",
    description: "Gritty industrial textures meets melodic synthpop.",
    tracks: [
      {
        id: 's5-bass', name: 'Deep Reese', type: InstrumentType.BASS, color: 'rose', volume: 0.9, muted: false,
        synthParams: SOUND_LIBRARY.BASS["Deep Reese"],
        notes: [
             { step: 0, pitch: "A0", active: true }, { step: 3, pitch: "A0", active: true },
             { step: 6, pitch: "A0", active: true }, { step: 8, pitch: "C1", active: true },
             { step: 11, pitch: "E1", active: true }, { step: 14, pitch: "E1", active: true },
        ]
      },
      {
        id: 's5-lead', name: 'Hero Lead', type: InstrumentType.LEAD, color: 'violet', volume: 0.65, muted: false,
        synthParams: SOUND_LIBRARY.LEAD["Hero Lead"],
        notes: [
             { step: 4, pitch: "E4", active: true }, { step: 5, pitch: "E4", active: true },
             { step: 12, pitch: "C5", active: true }, { step: 13, pitch: "B4", active: true },
        ]
      },
      {
        id: 's5-pad', name: 'Dark Sweep', type: InstrumentType.PAD, color: 'zinc', volume: 0.6, muted: false,
        synthParams: SOUND_LIBRARY.PAD["Dark Sweep"],
        notes: [
             { step: 0, pitch: "A2", active: true }, 
             { step: 8, pitch: "G2", active: true },
        ]
      },
      {
        id: 's5-drums', name: 'Gated Reverb', type: InstrumentType.DRUMS, color: 'orange', volume: 0.95, muted: false,
        synthParams: SOUND_LIBRARY.DRUMS["Gated Reverb"],
        notes: [
            { step: 0, pitch: "KICK", active: true }, { step: 8, pitch: "KICK", active: true },
            { step: 4, pitch: "SNARE", active: true }, { step: 12, pitch: "SNARE", active: true },
            { step: 2, pitch: "HIHAT", active: true }, { step: 6, pitch: "HIHAT", active: true },
            { step: 10, pitch: "HIHAT", active: true }, { step: 14, pitch: "HIHAT", active: true },
            { step: 15, pitch: "KICK", active: true },
        ]
      }
    ]
  },
  {
    title: "BLADE RUNNER",
    bpm: 65,
    key: "E",
    description: "Slow, atmospheric, and majestic Vangelis-style cinema.",
    tracks: [
      {
        id: 'br-bass', name: 'Drone', type: InstrumentType.BASS, color: 'blue', volume: 0.8, muted: false,
        synthParams: { ...SOUND_LIBRARY.BASS["Deep Reese"], release: 0.8 },
        notes: [
             { step: 0, pitch: "E1", active: true }, 
             { step: 8, pitch: "E1", active: true },
        ]
      },
      {
        id: 'br-lead', name: 'CS-80', type: InstrumentType.LEAD, color: 'orange', volume: 0.8, muted: false,
        synthParams: { ...SOUND_LIBRARY.LEAD["Vangelis Brass"], reverbSend: 0.9 },
        notes: [
             { step: 0, pitch: "E4", active: true }, 
             { step: 4, pitch: "G#4", active: true },
             { step: 10, pitch: "B4", active: true },
        ]
      },
      {
        id: 'br-pad', name: 'Fog', type: InstrumentType.PAD, color: 'slate', volume: 0.6, muted: false,
        synthParams: SOUND_LIBRARY.PAD["Dark Sweep"],
        notes: [
             { step: 0, pitch: "E2", active: true },
             { step: 8, pitch: "B2", active: true },
        ]
      },
      {
        id: 'br-drums', name: 'Heartbeat', type: InstrumentType.DRUMS, color: 'red', volume: 0.9, muted: false,
        synthParams: { ...SOUND_LIBRARY.DRUMS["Gated Reverb"], reverbSend: 0.8 },
        notes: [
             { step: 0, pitch: "KICK", active: true }, 
             { step: 12, pitch: "KICK", active: true },
        ]
      }
    ]
  },
  {
    title: "CYBER CHASE",
    bpm: 130,
    key: "Gm",
    description: "High speed pursuit. Tight bass and fast arps.",
    tracks: [
      {
        id: 'cc-bass', name: 'Pulse Bass', type: InstrumentType.BASS, color: 'cyan', volume: 0.9, muted: false,
        synthParams: { ...SOUND_LIBRARY.BASS["Rolling Moog"], release: 0.1 },
        notes: Array.from({length: 16}).map((_, i) => ({ step: i, pitch: "G1", active: true }))
      },
      {
        id: 'cc-lead', name: 'Arp Lead', type: InstrumentType.LEAD, color: 'green', volume: 0.7, muted: false,
        synthParams: { ...SOUND_LIBRARY.LEAD["Glass FM"], release: 0.1 },
        notes: [
             { step: 0, pitch: "G4", active: true }, { step: 2, pitch: "Bb4", active: true },
             { step: 4, pitch: "D5", active: true }, { step: 6, pitch: "Bb4", active: true },
             { step: 8, pitch: "G4", active: true }, { step: 10, pitch: "F4", active: true },
             { step: 12, pitch: "G4", active: true }, { step: 14, pitch: "A4", active: true },
        ]
      },
      {
        id: 'cc-pad', name: 'Tension', type: InstrumentType.PAD, color: 'purple', volume: 0.5, muted: false,
        synthParams: SOUND_LIBRARY.PAD["Jupiter Strings"],
        notes: [
             { step: 0, pitch: "G3", active: true }, 
             { step: 8, pitch: "Eb3", active: true },
        ]
      },
      {
        id: 'cc-drums', name: 'Action Kit', type: InstrumentType.DRUMS, color: 'yellow', volume: 0.9, muted: false,
        synthParams: SOUND_LIBRARY.DRUMS["Tight & Dry"],
        notes: [
            { step: 0, pitch: "KICK", active: true }, { step: 4, pitch: "SNARE", active: true },
            { step: 8, pitch: "KICK", active: true }, { step: 12, pitch: "SNARE", active: true },
            { step: 2, pitch: "HIHAT", active: true }, { step: 6, pitch: "HIHAT", active: true },
            { step: 10, pitch: "HIHAT", active: true }, { step: 14, pitch: "HIHAT", active: true },
        ]
      }
    ]
  }
];
