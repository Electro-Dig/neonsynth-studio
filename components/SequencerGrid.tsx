
import React from 'react';
import { Track, InstrumentType } from '../types';
import { STEPS_PER_BAR } from '../constants';

interface SequencerGridProps {
  track: Track;
  currentStep: number;
  isSelected: boolean;
  onToggleNote: (trackId: string, step: number, defaultPitch: string) => void;
  onSelectTrack: (trackId: string) => void;
}

const getDisplayPitch = (trackType: InstrumentType) => {
  if (trackType === InstrumentType.BASS) return "C2";
  if (trackType === InstrumentType.LEAD) return "C4";
  if (trackType === InstrumentType.PAD) return "F3";
  if (trackType === InstrumentType.DRUMS) return "KICK";
  return "C3";
};

export const SequencerGrid: React.FC<SequencerGridProps> = ({ track, currentStep, isSelected, onToggleNote, onSelectTrack }) => {
  
  const steps = Array.from({ length: STEPS_PER_BAR }, (_, i) => i);
  const isStepActive = (step: number) => track.notes.find(n => n.step === step && n.active);

  const getCellStyles = (step: number, activeNote: any, isCurrent: boolean) => {
    // Removed 'relative' here to simplify z-indexing for borders if needed, added border-r border-slate-800
    let classes = "h-full flex-1 border-r border-slate-800 relative transition-all duration-75 flex items-center justify-center font-mono text-[10px] tracking-widest ";
    
    // Beat markers (every 4 steps) - thicker right border
    if ((step + 1) % 4 === 0) {
        classes += "border-r-slate-600 ";
    } else {
        classes += "border-r-slate-800/50 ";
    }

    // Active State
    if (activeNote) {
        const baseColors: Record<string, string> = {
          fuchsia: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50",
          blue: "bg-blue-500/20 text-blue-300 border-blue-500/50",
          cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50",
          purple: "bg-purple-500/20 text-purple-300 border-purple-500/50",
          yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
          red: "bg-red-500/20 text-red-300 border-red-500/50",
          pink: "bg-pink-500/20 text-pink-300 border-pink-500/50",
          indigo: "bg-indigo-500/20 text-indigo-300 border-indigo-500/50",
          orange: "bg-orange-500/20 text-orange-300 border-orange-500/50",
          green: "bg-green-500/20 text-green-300 border-green-500/50",
          slate: "bg-slate-500/20 text-slate-300 border-slate-500/50",
        };
        
        classes += (baseColors[track.color] || "bg-slate-500 text-white") + " shadow-[inset_0_0_15px_rgba(0,0,0,0.2)] ";

        // Bright flash when playing
        if (isCurrent) {
            classes += "brightness-150 bg-opacity-80 z-10 border-white/80 text-white shadow-[0_0_10px_rgba(255,255,255,0.8)] ";
        }
    } else {
        // Inactive State
        classes += "bg-transparent text-slate-700 hover:bg-slate-800/30 hover:text-slate-500 ";
        if (isCurrent) {
            classes += "bg-white/5 text-slate-600 ";
        }
    }

    return classes;
  };

  return (
    <div className={`flex flex-row w-full h-32 border-b border-slate-800 bg-[#0f0f13] ${isSelected ? 'bg-slate-800/30' : ''}`}>
      {/* Track Header - Left Sidebar (Clickable for selection) */}
      <div 
        onClick={() => onSelectTrack(track.id)}
        className={`w-48 flex-shrink-0 border-r p-3 flex flex-col justify-between relative overflow-hidden cursor-pointer transition-colors 
            ${isSelected ? `bg-slate-800 border-${track.color}-500/50` : 'bg-slate-900/80 border-slate-700 hover:bg-slate-800'}
        `}
      >
        {/* Color strip left */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 shadow-[0_0_10px_rgba(255,255,255,0.3)] ${isSelected ? `bg-${track.color}-400` : `bg-${track.color}-500/50`}`}></div>
        
        <div className="ml-2">
            <h3 className={`text-xs font-black truncate uppercase tracking-wider font-['Orbitron'] mb-1 ${isSelected ? `text-${track.color}-300` : `text-${track.color}-400/70`}`}>
                {track.name}
            </h3>
            <span className="text-[9px] text-slate-500 font-mono block">{track.type}</span>
        </div>

        <div className="space-y-2 ml-2 pointer-events-none">
            <div className="flex justify-between items-center">
                 <span className="text-[9px] text-gray-500">VOL</span>
                 <div className="flex flex-col gap-[1px] w-16">
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-${track.color}-500`} style={{width: `${track.volume * 100}%`}}></div>
                    </div>
                 </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-[9px] text-gray-500">MUTE</span>
                <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)] ${track.muted ? 'bg-red-500 box-shadow-[0_0_8px_red]' : 'bg-slate-700'}`}></div>
            </div>
        </div>

        {isSelected && (
            <div className="absolute top-2 right-2">
                <div className={`h-1.5 w-1.5 rounded-full bg-${track.color}-400 animate-pulse`}></div>
            </div>
        )}
      </div>
      
      {/* Horizontal Grid Steps */}
      {/* Removed the bg-[linear-gradient...] here to fix alignment */}
      <div className="flex flex-row flex-1 relative">
        {steps.map((step) => {
          const activeNote = isStepActive(step);
          const defaultPitch = activeNote ? activeNote.pitch : getDisplayPitch(track.type);
          
          return (
            <button
              key={step}
              onClick={() => onToggleNote(track.id, step, defaultPitch)}
              className={getCellStyles(step, activeNote, currentStep === step)}
              title={`Step ${step + 1} - ${track.name}`}
            >
                {activeNote ? (
                   <span className="truncate pointer-events-none">
                       {track.type === InstrumentType.DRUMS 
                           ? (activeNote.pitch === 'KICK' ? 'KICK' : activeNote.pitch === 'SNARE' ? 'SNAR' : activeNote.pitch.substring(0, 4))
                           : activeNote.pitch}
                   </span>
                ) : (
                   <span className="opacity-10 group-hover:opacity-30 scale-50 group-hover:scale-100 transition-all">●</span>
                )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
