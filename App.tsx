
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { SequencerGrid } from './components/SequencerGrid';
import { EchoPond } from './components/EchoPond';
import { Song, DEFAULT_SONG, Note, InstrumentType, ViewMode } from './types';
import { generateSynthwaveSong } from './services/geminiService';
import { audioEngine } from './services/audioEngine';
import { STEPS_PER_BAR } from './constants';
import { PRESETS } from './presets';

const App: React.FC = () => {
  // Start with the first preset
  const [song, setSong] = useState<Song>(PRESETS[0]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(PRESETS[0].tracks[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>('SEQUENCER');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Use refs for audio scheduling
  const songRef = useRef(song);
  const stepRef = useRef(0);
  const isPlayingRef = useRef(false);
  const nextNoteTimeRef = useRef(0);
  const timerIDRef = useRef<number | null>(null);

  // Keep songRef synced with state
  useEffect(() => {
    songRef.current = song;
  }, [song]);

  // Generate Song Logic
  const handleGenerate = async (description: string) => {
    setIsGenerating(true);
    if (isPlaying) handlePlayToggle(); 
    
    const newSong = await generateSynthwaveSong(description);
    if (newSong) {
      setSong(newSong);
      if (newSong.tracks.length > 0) setSelectedTrackId(newSong.tracks[0].id);
    } else {
      alert("AI 生成超时，请重试。");
    }
    setIsGenerating(false);
  };

  const handleLoadPreset = (preset: Song) => {
     if (isPlaying) handlePlayToggle();
     const deepCopy = JSON.parse(JSON.stringify(preset));
     setSong(deepCopy);
     if (deepCopy.tracks.length > 0) setSelectedTrackId(deepCopy.tracks[0].id);
     setCurrentStep(0);
     stepRef.current = 0;
  };

  // Sequencer / Playback Logic
  const scheduleNotes = (stepNumber: number, time: number) => {
    songRef.current.tracks.forEach(track => {
      if (track.muted) return;
      
      track.notes.forEach(note => {
        if (note.active && note.step === stepNumber) {
          const secondsPerBeat = 60.0 / songRef.current.bpm;
          const noteDuration = secondsPerBeat / 4; 
          
          // 1. Play Audio
          audioEngine.playNote(track.type, note.pitch, time, noteDuration, track.volume, track.synthParams);

          // 2. Dispatch Visual Event (Sync with audio time via timeout)
          // We calculate the delay between "now" and the scheduled "time"
          const delayMs = (time - audioEngine.currentTime) * 1000;
          
          setTimeout(() => {
              window.dispatchEvent(new CustomEvent('neon-note-on', {
                  detail: {
                      trackId: track.id,
                      type: track.type,
                      pitch: note.pitch,
                      color: track.color,
                      volume: track.volume,
                      synthParams: track.synthParams
                  }
              }));
          }, Math.max(0, delayMs));
        }
      });
    });
  };

  const scheduler = useCallback(() => {
    const lookahead = 0.1; 
    const interval = 25;

    if (!isPlayingRef.current) return;

    const secondsPerBeat = 60.0 / songRef.current.bpm;
    const secondsPerStep = secondsPerBeat / 4; // 16th notes

    while (nextNoteTimeRef.current < audioEngine.currentTime + lookahead) {
      scheduleNotes(stepRef.current, nextNoteTimeRef.current);
      
      const currentVisualStep = stepRef.current;
      setCurrentStep(currentVisualStep);

      stepRef.current = (stepRef.current + 1) % STEPS_PER_BAR;
      nextNoteTimeRef.current += secondsPerStep;
    }

    timerIDRef.current = window.setTimeout(scheduler, interval);
  }, []);

  const handlePlayToggle = () => {
    audioEngine.init(); 

    if (isPlaying) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (timerIDRef.current) window.clearTimeout(timerIDRef.current);
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      stepRef.current = 0;
      setCurrentStep(0);
      nextNoteTimeRef.current = audioEngine.currentTime + 0.05; 
      scheduler();
    }
  };

  useEffect(() => {
    return () => {
      if (timerIDRef.current) window.clearTimeout(timerIDRef.current);
    };
  }, []);

  // Edit Logic
  const toggleNote = (trackId: string, step: number, defaultPitch: string) => {
    setSong(prev => {
      const newTracks = prev.tracks.map(t => {
        if (t.id !== trackId) return t;
        const existingNoteIndex = t.notes.findIndex(n => n.step === step);
        let newNotes = [...t.notes];
        if (existingNoteIndex >= 0) {
          newNotes.splice(existingNoteIndex, 1);
        } else {
          newNotes.push({ step, pitch: defaultPitch, active: true });
        }
        return { ...t, notes: newNotes };
      });
      return { ...prev, tracks: newTracks };
    });
    if (trackId !== selectedTrackId) setSelectedTrackId(trackId);
  };

  const updateTrackVolume = (trackId: string, vol: number) => {
    setSong(prev => ({
      ...prev,
      tracks: prev.tracks.map(t => t.id === trackId ? { ...t, volume: vol } : t)
    }));
    if (trackId !== selectedTrackId) setSelectedTrackId(trackId);
  };

  const toggleTrackMute = (trackId: string) => {
    setSong(prev => ({
      ...prev,
      tracks: prev.tracks.map(t => t.id === trackId ? { ...t, muted: !t.muted } : t)
    }));
  };

  const updateSynthParams = (trackId: string, param: string, value: number) => {
      setSong(prev => ({
          ...prev,
          tracks: prev.tracks.map(t => 
              t.id === trackId 
              ? { ...t, synthParams: { ...t.synthParams, [param]: value } }
              : t
          )
      }));
  };

  const handleBpmChange = (bpm: number) => {
      setSong(prev => ({ ...prev, bpm }));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a10] text-white font-mono selection:bg-fuchsia-500 selection:text-white">
      {/* Left Panel: Controls */}
      <ControlPanel 
        song={song}
        selectedTrackId={selectedTrackId}
        isPlaying={isPlaying}
        isGenerating={isGenerating}
        onPlayToggle={handlePlayToggle}
        onGenerate={handleGenerate}
        onBpmChange={handleBpmChange}
        onUpdateTrackVolume={updateTrackVolume}
        onToggleTrackMute={toggleTrackMute}
        onUpdateSynthParams={updateSynthParams}
        onLoadPreset={handleLoadPreset}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col relative z-10 bg-[#111116]">
        
        {/* Info Bar / View Switcher */}
        <div className="h-14 border-b border-slate-800 flex items-center px-6 justify-between bg-slate-900 shadow-lg shrink-0 z-30 relative">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-white font-['Orbitron'] tracking-widest uppercase">{song.title}</h2>
                    <span className="bg-slate-800 text-cyan-400 text-[10px] px-2 py-0.5 rounded border border-slate-700 font-bold">KEY: {song.key}</span>
                </div>
                
                {/* View Mode Tabs */}
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/5 ml-4">
                    <button 
                        onClick={() => setViewMode('SEQUENCER')}
                        className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'SEQUENCER' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        SEQUENCER
                    </button>
                    <button 
                        onClick={() => setViewMode('ECHO_POND')}
                        className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'ECHO_POND' ? 'bg-fuchsia-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        ECHO POND
                    </button>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <span className="text-xs text-gray-500 italic hidden md:block">{song.description}</span>
                <div className="flex gap-2 items-center bg-black/30 px-3 py-1 rounded-full border border-white/5">
                    <div className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-900'}`}></div>
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider">{isPlaying ? 'PLAYING' : 'STOPPED'}</span>
                </div>
            </div>
        </div>

        {/* Content Area - Conditional Rendering */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-[#0a0a0e]">
            
            {viewMode === 'ECHO_POND' ? (
                <EchoPond 
                  tracks={song.tracks}
                  onToggleMute={toggleTrackMute}
                />
            ) : (
                <>
                    {/* Timeline Ruler (Top) */}
                    <div className="h-8 flex flex-row w-full border-b border-slate-800 bg-[#0f0f13] flex-shrink-0">
                        <div className="w-48 border-r border-slate-700 bg-slate-900/50 flex-shrink-0"></div> 
                        <div className="flex-1 flex flex-row">
                        {Array.from({length: 16}).map((_, i) => (
                            <div key={i} className={`flex-1 border-r border-slate-800/50 text-[10px] flex items-center justify-center ${currentStep === i ? 'text-white font-bold bg-white/5' : 'text-slate-600'} ${(i+1)%4===0 ? 'border-r-slate-600' : ''}`}>
                                {(i + 1).toString().padStart(2, '0')}
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Scrollable Tracks Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                        
                        {/* Vertical Playhead Overlay */}
                        <div className="absolute top-0 bottom-0 pointer-events-none z-20 flex flex-row left-48 right-0">
                            <div className="flex flex-row w-full h-full relative">
                                {Array.from({length: 16}).map((_, i) => (
                                    <div key={i} className="flex-1 h-full relative">
                                        {currentStep === i && (
                                            <div className="absolute inset-y-0 left-0 w-full bg-white/5 border-l border-r border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] animate-pulse z-30">
                                                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan-400 shadow-[0_0_10px_cyan]"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tracks */}
                        {song.tracks.map(track => (
                            <SequencerGrid 
                                key={track.id}
                                track={track}
                                currentStep={currentStep}
                                isSelected={selectedTrackId === track.id}
                                onToggleNote={toggleNote}
                                onSelectTrack={setSelectedTrackId}
                            />
                        ))}
                        
                        {/* Empty space at bottom */}
                        <div className="h-32 w-full bg-[#0a0a0e] opacity-50"></div>
                    </div>
                </>
            )}
        </div>
        
      </div>
    </div>
  );
};

export default App;
