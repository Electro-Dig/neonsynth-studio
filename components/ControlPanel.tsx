
import React, { useState } from 'react';
import { Song, Track } from '../types';
import { PRESETS } from '../presets';
import { SOUND_LIBRARY } from '../constants';

interface ControlPanelProps {
  song: Song;
  selectedTrackId: string | null;
  isPlaying: boolean;
  isGenerating: boolean;
  onPlayToggle: () => void;
  onGenerate: (description: string) => void;
  onBpmChange: (bpm: number) => void;
  onUpdateTrackVolume: (trackId: string, vol: number) => void;
  onUpdateSynthParams: (trackId: string, param: string, value: number) => void;
  onLoadPreset: (preset: Song) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  song,
  selectedTrackId,
  isPlaying,
  isGenerating,
  onPlayToggle,
  onGenerate,
  onBpmChange,
  onUpdateTrackVolume,
  onUpdateSynthParams,
  onLoadPreset
}) => {
  const [prompt, setPrompt] = useState("");
  const [presetSearch, setPresetSearch] = useState("");

  const selectedTrack = song.tracks.find(t => t.id === selectedTrackId);

  const handleLoadPatch = (patchName: string) => {
      if (!selectedTrack || !patchName) return;
      const patch = SOUND_LIBRARY[selectedTrack.type][patchName];
      if (patch) {
          onUpdateSynthParams(selectedTrack.id, 'filterCutoff', patch.filterCutoff);
          onUpdateSynthParams(selectedTrack.id, 'release', patch.release);
          onUpdateSynthParams(selectedTrack.id, 'detune', patch.detune);
          onUpdateSynthParams(selectedTrack.id, 'reverbSend', patch.reverbSend);
      }
  };

  const filteredPresets = PRESETS.filter(p => 
      p.title.toLowerCase().includes(presetSearch.toLowerCase()) || 
      p.description.toLowerCase().includes(presetSearch.toLowerCase()) ||
      p.bpm.toString().includes(presetSearch)
  );

  const getStyleTag = (song: Song) => {
      if (song.bpm > 130) return "DARKSYNTH";
      if (song.bpm < 80) return "CINEMATIC";
      if (song.bpm < 100) return "CHILLWAVE";
      if (song.title.includes("TOKYO") || song.title.includes("DIGITAL")) return "HOUSE";
      if (song.title.includes("ITALO")) return "DISCO";
      return "SYNTHWAVE";
  };

  return (
    <div className="p-6 bg-slate-900 border-r border-slate-800 h-full overflow-y-auto min-w-[320px] max-w-[320px] flex flex-col z-20 shadow-xl scrollbar-hide">
      
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] font-['Orbitron'] mb-2">
          NEON<br/>SYNTH
        </h1>
        <p className="text-xs text-cyan-300 tracking-[0.3em] uppercase">AI Music Studio</p>
      </div>

      {/* Sound Design (Dynamic Section) */}
      {selectedTrack ? (
        <div className="mb-8 space-y-4 bg-slate-800/50 p-4 rounded border border-slate-700 animate-in fade-in slide-in-from-left-4 duration-300">
            <h2 className={`text-sm text-${selectedTrack.color}-400 font-bold uppercase tracking-wider mb-2 border-b border-${selectedTrack.color}-900/50 pb-1`}>
                音色设计: {selectedTrack.name}
            </h2>
            
            {/* Patch Loader */}
            <div className="mb-4">
                <label className="text-[10px] uppercase text-gray-500 mb-1 block">Load Sound Bank</label>
                <select 
                    className="w-full bg-slate-900 text-white text-xs p-2 rounded border border-slate-700 focus:border-fuchsia-500 focus:outline-none"
                    onChange={(e) => handleLoadPatch(e.target.value)}
                    defaultValue=""
                >
                    <option value="" disabled>Select a Preset...</option>
                    {Object.keys(SOUND_LIBRARY[selectedTrack.type] || {}).map(patchName => (
                        <option key={patchName} value={patchName}>{patchName}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-3">
                 {/* Filter Cutoff */}
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase text-gray-400">
                        <span>Brightness (Filter)</span>
                        <span>{Math.round(selectedTrack.synthParams.filterCutoff * 100)}%</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.01" 
                        value={selectedTrack.synthParams.filterCutoff}
                        onChange={(e) => onUpdateSynthParams(selectedTrack.id, 'filterCutoff', parseFloat(e.target.value))}
                        className={`w-full h-1 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-${selectedTrack.color}-500`} />
                 </div>

                 {/* Release */}
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase text-gray-400">
                        <span>Tail (Release)</span>
                        <span>{Math.round(selectedTrack.synthParams.release * 100)}%</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.01" 
                        value={selectedTrack.synthParams.release}
                        onChange={(e) => onUpdateSynthParams(selectedTrack.id, 'release', parseFloat(e.target.value))}
                        className={`w-full h-1 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-${selectedTrack.color}-500`} />
                 </div>

                 {/* Detune */}
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase text-gray-400">
                        <span>Retro (Detune)</span>
                        <span>{Math.round(selectedTrack.synthParams.detune * 100)}%</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.01" 
                        value={selectedTrack.synthParams.detune}
                        onChange={(e) => onUpdateSynthParams(selectedTrack.id, 'detune', parseFloat(e.target.value))}
                        className={`w-full h-1 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-${selectedTrack.color}-500`} />
                 </div>

                 {/* Reverb */}
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase text-gray-400">
                        <span>Space (Reverb)</span>
                        <span>{Math.round(selectedTrack.synthParams.reverbSend * 100)}%</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.01" 
                        value={selectedTrack.synthParams.reverbSend}
                        onChange={(e) => onUpdateSynthParams(selectedTrack.id, 'reverbSend', parseFloat(e.target.value))}
                        className={`w-full h-1 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-${selectedTrack.color}-500`} />
                 </div>
            </div>
        </div>
      ) : (
        <div className="mb-8 p-4 border border-dashed border-slate-700 rounded text-center">
            <p className="text-xs text-gray-500">SELECT A TRACK TO EDIT SOUND</p>
        </div>
      )}

      {/* Presets Section - Enhanced */}
       <div className="mb-8 space-y-3 flex-1 min-h-[250px] flex flex-col">
        <h2 className="text-sm text-green-400 font-bold uppercase tracking-wider border-b border-green-900/50 pb-1 flex justify-between items-center">
          <span>Song Library</span>
          <span className="text-[10px] opacity-60">{PRESETS.length} SONGS</span>
        </h2>
        
        {/* Search */}
        <input 
            type="text" 
            placeholder="Search presets..." 
            value={presetSearch}
            onChange={(e) => setPresetSearch(e.target.value)}
            className="w-full bg-slate-800 text-xs text-gray-300 p-2 rounded border border-slate-700 focus:border-green-500 focus:outline-none mb-1"
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2 border border-slate-800 rounded bg-black/20 p-2">
          {filteredPresets.length > 0 ? (
              filteredPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => onLoadPreset(preset)}
                  className="w-full text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500/50 rounded transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-1 relative z-10">
                      <div className="text-xs font-bold text-gray-300 group-hover:text-white uppercase tracking-wide truncate pr-2">
                        {preset.title}
                      </div>
                      <span className="text-[9px] bg-slate-900 text-green-400 px-1 rounded border border-green-900/30">
                          {getStyleTag(preset)}
                      </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 group-hover:text-gray-400 relative z-10">
                    <span>{preset.bpm} BPM • {preset.key}</span>
                  </div>
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              ))
          ) : (
              <div className="text-center py-4 text-xs text-gray-600">No presets found.</div>
          )}
        </div>
      </div>

      {/* Generation Section */}
      <div className="mb-8 space-y-4">
        <h2 className="text-sm text-fuchsia-400 font-bold uppercase tracking-wider mb-2 border-b border-fuchsia-900/50 pb-1">
          AI 灵感生成
        </h2>
        <textarea 
          className="w-full bg-slate-800 text-gray-200 text-sm p-3 rounded border border-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all h-20 resize-none placeholder-slate-500"
          placeholder="描述氛围: Cyberpunk chase..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={() => onGenerate(prompt || "Classic Synthwave")}
          disabled={isGenerating}
          className={`
            w-full py-3 rounded font-bold text-white tracking-widest uppercase transition-all
            ${isGenerating 
              ? 'bg-slate-700 cursor-not-allowed' 
              : 'bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 shadow-[0_0_20px_rgba(192,38,211,0.4)] border border-fuchsia-400/30'
            }
          `}
        >
          {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  COMPUTING...
              </span>
          ) : "GENERATE NEW"}
        </button>
      </div>

      {/* Playback Controls */}
      <div className="mb-8 space-y-4">
        <h2 className="text-sm text-cyan-400 font-bold uppercase tracking-wider mb-2 border-b border-cyan-900/50 pb-1">
          播放控制
        </h2>
        
        <div className="flex gap-4 items-center">
            <button
                onClick={onPlayToggle}
                className={`
                    flex-1 py-4 rounded-lg font-bold text-xl border transition-all
                    ${isPlaying 
                        ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' 
                        : 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)] hover:bg-cyan-500/30'
                    }
                `}
            >
                {isPlaying ? 'STOP' : 'PLAY'}
            </button>
        </div>

        <div className="bg-slate-800 p-3 rounded border border-slate-700">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>TEMPO</span>
                <span className="text-cyan-300">{song.bpm} BPM</span>
            </div>
            <input 
                type="range" 
                min="60" 
                max="160" 
                value={song.bpm}
                onChange={(e) => onBpmChange(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
            />
        </div>
      </div>

      {/* Mixer */}
      <div className="flex-none">
         <h2 className="text-sm text-yellow-400 font-bold uppercase tracking-wider mb-4 border-b border-yellow-900/50 pb-1">
          混音台 Mixer
        </h2>
        <div className="space-y-4">
            {song.tracks.map(track => (
                <div key={track.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className={`text-${track.color}-400 font-bold`}>{track.name}</span>
                        <span className="text-gray-500">{Math.round(track.volume * 100)}%</span>
                    </div>
                    <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={track.volume}
                        onChange={(e) => onUpdateTrackVolume(track.id, parseFloat(e.target.value))}
                        className={`w-full accent-${track.color}-500 h-1 bg-slate-700 rounded appearance-none cursor-pointer`}
                    />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
