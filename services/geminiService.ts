
import { GoogleGenAI, Type } from "@google/genai";
import { Song, InstrumentType } from "../types";
import { STEPS_PER_BAR, DEFAULT_SYNTH_PARAMS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSynthwaveSong = async (description: string): Promise<Song | null> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Create a Synthwave/Retrowave musical loop composition (4 bars, but we only need 1 bar/16 steps pattern for this demo).
    
    Theme: ${description}.
    
    Requirements:
    - BPM between 80 and 130.
    - Key should be minor (e.g., Am, Fm, Cm) appropriate for synthwave.
    - 4 Tracks exactly: BASS, LEAD, PAD, DRUMS.
    - For DRUMS track: Use "KICK", "SNARE", "HIHAT" as pitch values.
    - For BASS/LEAD/PAD: Use standard note names like "C2", "G#3", "A4".
    - Each track must have an array of notes. A note has a 'step' (0 to 15).
    - Make it musical and rhythmic.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            bpm: { type: Type.INTEGER },
            key: { type: Type.STRING },
            description: { type: Type.STRING },
            tracks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING, enum: [InstrumentType.BASS, InstrumentType.LEAD, InstrumentType.PAD, InstrumentType.DRUMS] },
                  notes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        step: { type: Type.INTEGER },
                        pitch: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      const rawData = JSON.parse(response.text);
      
      // Post-process to ensure valid structure matches our internal types
      const processedTracks = rawData.tracks.map((t: any, idx: number) => {
        let color = 'cyan';
        let vol = 0.7;
        if (t.type === InstrumentType.BASS) { color = 'blue'; vol = 0.8; }
        if (t.type === InstrumentType.LEAD) { color = 'fuchsia'; vol = 0.6; }
        if (t.type === InstrumentType.PAD) { color = 'purple'; vol = 0.5; }
        if (t.type === InstrumentType.DRUMS) { color = 'yellow'; vol = 0.9; }

        return {
          id: `t-${idx}-${Date.now()}`,
          name: t.name,
          type: t.type,
          color: color,
          volume: vol,
          muted: false,
          synthParams: { ...DEFAULT_SYNTH_PARAMS },
          notes: t.notes.map((n: any) => ({
            step: n.step,
            pitch: n.pitch,
            active: true
          })).filter((n: any) => n.step >= 0 && n.step < STEPS_PER_BAR)
        };
      });

      return {
        title: rawData.title,
        bpm: rawData.bpm,
        key: rawData.key,
        description: rawData.description,
        tracks: processedTracks
      };
    }
    return null;
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return null;
  }
};
