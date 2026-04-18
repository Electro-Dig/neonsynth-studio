
import React, { useEffect, useRef, useState } from 'react';
import { InstrumentType, SynthParams, Track } from '../types';
import { audioEngine } from '../services/audioEngine';

// Physics Constants
const PAD_SIZE = 25;
const SOURCE_SIZE = 30;
const PAD_RANGE = 120;
const RIPPLE_SPEED = 3;
const DRAG_THRESHOLD = 5;
const LONG_PRESS_MS = 500;

interface Pad { 
    id: number; 
    x: number; 
    y: number; 
    range: number; 
    color: string; 
    strength: number; // 0.1 to 1.0, determines echo volume
}

interface Source {
    type: InstrumentType;
    x: number;
    y: number;
    active: boolean;
    color: string;
    label: string;
}

interface Ripple { 
    x: number; 
    y: number; 
    radius: number; 
    maxRadius: number; 
    triggeredPads: Set<number>; 
    
    // Audio Payload
    type: InstrumentType;
    pitch: string;
    volume: number;
    synthParams: SynthParams;
    color: string;
}

interface Aura { x: number; y: number; radius: number; maxRadius: number; color: string; }

interface EchoPondProps {
  tracks: Track[];
  onToggleMute: (trackId: string) => void;
}

export const EchoPond: React.FC<EchoPondProps> = ({ tracks, onToggleMute }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Game State Refs
  const padsRef = useRef<Pad[]>([]);
  const sourcesRef = useRef<Source[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const aurasRef = useRef<Aura[]>([]);
  
  const nextPadIdRef = useRef(0);
  const frameIdRef = useRef<number>(0);

  // UI State
  const [selectedPadId, setSelectedPadId] = useState<number | null>(null);
  const [selectedPadStrength, setSelectedPadStrength] = useState(0.5);
  const [forceUpdate, setForceUpdate] = useState(0); // To trigger re-render for Source UI updates

  // Input State Refs
  const draggingRef = useRef<{ type: 'PAD' | 'SOURCE', id: number | string, offsetX: number, offsetY: number, startX: number, startY: number } | null>(null);
  const pointerStartRef = useRef<{x: number, y: number, time: number} | null>(null);
  const longPressTimerRef = useRef<number | null>(null);

  // --- Initialization ---
  useEffect(() => {
      // Initialize Sources if empty
      if (sourcesRef.current.length === 0 && wrapperRef.current) {
          const w = wrapperRef.current.clientWidth;
          const h = wrapperRef.current.clientHeight;
          
          sourcesRef.current = [
              { type: InstrumentType.LEAD, x: w * 0.5, y: h * 0.20, active: true, color: '#e879f9', label: 'LEAD' },
              { type: InstrumentType.DRUMS, x: w * 0.5, y: h * 0.5, active: true, color: '#facc15', label: 'DRUMS' },
              { type: InstrumentType.BASS, x: w * 0.5, y: h * 0.80, active: true, color: '#3b82f6', label: 'BASS' },
              { type: InstrumentType.PAD, x: w * 0.20, y: h * 0.5, active: true, color: '#a855f7', label: 'PAD' },
          ];
      }
  }, []);

  // --- Sync Sources with Tracks Mute State ---
  useEffect(() => {
      let hasChanges = false;
      sourcesRef.current.forEach(source => {
          // Find corresponding track
          const track = tracks.find(t => t.type === source.type);
          if (track) {
              // Active if NOT muted
              const shouldBeActive = !track.muted;
              if (source.active !== shouldBeActive) {
                  source.active = shouldBeActive;
                  hasChanges = true;
              }
          }
      });
      if (hasChanges) setForceUpdate(n => n + 1);
  }, [tracks]);

  // --- Update Selected Pad Strength ---
  useEffect(() => {
      if (selectedPadId !== null) {
          const pad = padsRef.current.find(p => p.id === selectedPadId);
          if (pad) {
              pad.strength = selectedPadStrength;
          }
      }
  }, [selectedPadStrength, selectedPadId]);

  // --- Audio Playback Helper ---
  const playEcho = (ripple: Ripple, pad: Pad, distFactor: number) => {
      const duration = 0.3; 
      // Strength determines volume retention
      const echoVol = ripple.volume * 0.6 * distFactor * pad.strength; 
      
      if (echoVol < 0.01) return;

      // Modify params for "wet" echo sound
      const echoParams = { 
          ...ripple.synthParams, 
          reverbSend: Math.min(1, ripple.synthParams.reverbSend + 0.3),
          filterCutoff: ripple.synthParams.filterCutoff * (0.7 + (pad.strength * 0.3)), // Stronger pads = brighter echo
          detune: ripple.synthParams.detune + 0.05
      };

      audioEngine.playNote(
          ripple.type,
          ripple.pitch,
          audioEngine.currentTime,
          duration,
          echoVol,
          echoParams
      );
  };

  // --- Listener for Song Events ---
  useEffect(() => {
    const handleNoteOn = (e: CustomEvent) => {
        if (!canvasRef.current) return;
        const { type, pitch, volume, synthParams } = e.detail;
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;

        // Find the source object
        const source = sourcesRef.current.find(s => s.type === type);
        
        // Only emit if source exists and is ACTIVE
        if (source && source.active) {
            ripplesRef.current.push({
                x: source.x,
                y: source.y,
                radius: SOURCE_SIZE / 2,
                maxRadius: Math.max(w, h) * 1.5,
                triggeredPads: new Set(),
                type,
                pitch,
                volume,
                synthParams,
                color: source.color
            });
        }
    };

    window.addEventListener('neon-note-on', handleNoteOn as EventListener);
    return () => {
        window.removeEventListener('neon-note-on', handleNoteOn as EventListener);
    };
  }, []);

  // --- Physics & Drawing Loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const resize = () => {
        if (wrapperRef.current) {
            canvas.width = wrapperRef.current.clientWidth;
            canvas.height = wrapperRef.current.clientHeight;
        }
    };
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
        // Clear with trail effect for motion blur
        ctx.fillStyle = 'rgba(10, 10, 14, 0.25)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const gridSize = 80;
        for (let x = 0; x < canvas.width; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
        for (let y = 0; y < canvas.height; y += gridSize) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
        ctx.stroke();

        // 1. Draw Auras (Impacts)
        aurasRef.current.forEach(aura => {
            aura.radius += RIPPLE_SPEED * 0.6;
            ctx.beginPath();
            ctx.arc(aura.x, aura.y, aura.radius, 0, Math.PI * 2);
            ctx.strokeStyle = aura.color;
            ctx.lineWidth = 4 * (1 - aura.radius / aura.maxRadius);
            ctx.globalAlpha = 1 - aura.radius / aura.maxRadius;
            ctx.stroke();
            ctx.globalAlpha = 1;
        });
        aurasRef.current = aurasRef.current.filter(a => a.radius < a.maxRadius);

        // 2. Draw Sources
        sourcesRef.current.forEach(source => {
            drawSource(ctx, source);
        });

        // 3. Draw Ripples
        ripplesRef.current.forEach(ripple => {
            ripple.radius += RIPPLE_SPEED;
            
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            ctx.strokeStyle = ripple.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = Math.max(0, 1 - ripple.radius / ripple.maxRadius); 
            ctx.stroke();
            ctx.globalAlpha = 1;

            // Check Collisions with Pads
            padsRef.current.forEach(pad => {
                if (!ripple.triggeredPads.has(pad.id)) {
                    const dx = ripple.x - pad.x;
                    const dy = ripple.y - pad.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (Math.abs(dist - ripple.radius) < PAD_SIZE) {
                        ripple.triggeredPads.add(pad.id);
                        
                        // Physics Echo
                        const maxDist = Math.max(canvas.width, canvas.height);
                        const distFactor = Math.max(0.2, 1.0 - (dist / maxDist));
                        
                        playEcho(ripple, pad, distFactor);
                        
                        aurasRef.current.push({
                            x: pad.x, y: pad.y,
                            radius: PAD_SIZE,
                            maxRadius: PAD_RANGE * pad.strength, // Visual range depends on strength
                            color: ripple.color
                        });
                    }
                }
            });
        });
        ripplesRef.current = ripplesRef.current.filter(r => r.radius < r.maxRadius);

        // 4. Draw Pads
        padsRef.current.forEach(pad => {
            const isSelected = selectedPadId === pad.id;
            // Opacity based on strength
            const alpha = 0.3 + (pad.strength * 0.7);
            drawHexagon(ctx, pad.x, pad.y, PAD_SIZE, isSelected ? '#ffffff' : '#94a3b8', '#475569', alpha);
            
            if (isSelected) {
                // Pulse effect for selection
                ctx.beginPath();
                ctx.arc(pad.x, pad.y, PAD_SIZE * 1.5 + Math.sin(Date.now() / 200) * 2, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });

        frameIdRef.current = requestAnimationFrame(render);
    };
    
    render();

    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(frameIdRef.current);
    };
  }, [selectedPadId]); 

  // --- Input Handlers ---
  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      return {
          x: clientX - rect.left,
          y: clientY - rect.top
      };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault(); // Prevent scrolling on touch
      const { x, y } = getPointerPos(e);
      pointerStartRef.current = { x, y, time: Date.now() };

      // 1. Check Source Click
      const clickedSource = sourcesRef.current.find(s => Math.hypot(s.x - x, s.y - y) < SOURCE_SIZE);
      if (clickedSource) {
          draggingRef.current = { type: 'SOURCE', id: clickedSource.type, offsetX: 0, offsetY: 0, startX: x, startY: y };
          return;
      }

      // 2. Check Pad Click
      const clickedPad = padsRef.current.find(p => Math.hypot(p.x - x, p.y - y) < PAD_SIZE);
      if (clickedPad) {
          draggingRef.current = { 
              type: 'PAD', 
              id: clickedPad.id, 
              offsetX: x - clickedPad.x, 
              offsetY: y - clickedPad.y,
              startX: x, 
              startY: y
          };
          
          // Setup Long Press for deletion
          longPressTimerRef.current = window.setTimeout(() => {
              padsRef.current = padsRef.current.filter(p => p.id !== clickedPad.id);
              if (selectedPadId === clickedPad.id) setSelectedPadId(null);
              draggingRef.current = null; // Stop dragging if deleted
              setForceUpdate(n => n + 1); // Trigger render
          }, LONG_PRESS_MS);
          
          return;
      }

      // 3. Add New Pad
      // Only if we didn't click anything else
      const newId = nextPadIdRef.current++;
      const newPad: Pad = { id: newId, x, y, range: PAD_RANGE, color: '#fff', strength: 0.5 };
      padsRef.current.push(newPad);
      setSelectedPadId(newId);
      setSelectedPadStrength(0.5);
      // Also start dragging the new pad immediately for adjustments
      draggingRef.current = { type: 'PAD', id: newId, offsetX: 0, offsetY: 0, startX: x, startY: y };
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      const { x, y } = getPointerPos(e);

      // Check drag threshold to cancel long press
      if (pointerStartRef.current && Math.hypot(x - pointerStartRef.current.x, y - pointerStartRef.current.y) > DRAG_THRESHOLD) {
          if (longPressTimerRef.current) {
              clearTimeout(longPressTimerRef.current);
              longPressTimerRef.current = null;
          }
      }

      if (draggingRef.current.type === 'PAD') {
          const pad = padsRef.current.find(p => p.id === draggingRef.current?.id);
          if (pad) {
              pad.x = x - draggingRef.current.offsetX;
              pad.y = y - draggingRef.current.offsetY;
          }
      } else if (draggingRef.current.type === 'SOURCE') {
          const source = sourcesRef.current.find(s => s.type === draggingRef.current?.id);
          if (source) {
              source.x = x;
              source.y = y;
          }
      }
  };

  const handlePointerUp = (e: React.MouseEvent | React.TouchEvent) => {
      if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
      }

      // Handle Click Interactions (if not dragged much)
      const { x, y } = getPointerPos(e); // Note: this might fail on touchend as there are no touches.
      // Safe fallback for touch end is using last known pos, but usually draggingRef is enough state.
      
      if (draggingRef.current && pointerStartRef.current) {
        const dist = Math.hypot(x - pointerStartRef.current.x, y - pointerStartRef.current.y);
        const duration = Date.now() - pointerStartRef.current.time;

        if (dist < DRAG_THRESHOLD && duration < LONG_PRESS_MS) {
            // It was a click!
            if (draggingRef.current.type === 'SOURCE') {
                const type = draggingRef.current.id as InstrumentType;
                // Find track for this source
                const track = tracks.find(t => t.type === type);
                if (track) {
                    onToggleMute(track.id);
                }
            } else if (draggingRef.current.type === 'PAD') {
                const id = draggingRef.current.id as number;
                setSelectedPadId(id);
                const pad = padsRef.current.find(p => p.id === id);
                if (pad) setSelectedPadStrength(pad.strength);
            }
        }
      }

      draggingRef.current = null;
      pointerStartRef.current = null;
  };

  const clearPads = () => {
      padsRef.current = [];
      setSelectedPadId(null);
      setForceUpdate(n => n + 1);
  };

  // --- Canvas Draw Utils ---
  const drawSource = (ctx: CanvasRenderingContext2D, source: Source) => {
    const isActive = source.active;
    
    ctx.beginPath();
    ctx.arc(source.x, source.y, SOURCE_SIZE / 2, 0, Math.PI * 2);
    
    if (isActive) {
        ctx.fillStyle = source.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = source.color;
    } else {
        ctx.fillStyle = '#1e293b'; // Dimmed
        ctx.shadowBlur = 0;
    }
    ctx.fill();
    
    ctx.strokeStyle = source.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(source.label, source.x, source.y + SOURCE_SIZE + 10);
    
    if (!isActive) {
        // Draw Cross or Dim indicator
        ctx.beginPath();
        ctx.moveTo(source.x - 8, source.y - 8);
        ctx.lineTo(source.x + 8, source.y + 8);
        ctx.moveTo(source.x + 8, source.y - 8);
        ctx.lineTo(source.x - 8, source.y + 8);
        ctx.strokeStyle = '#ef4444';
        ctx.stroke();
    }
  };

  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, strokeColor: string, fillColor: string, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const hx = x + size * Math.cos(angle);
          const hy = y + size * Math.sin(angle);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;
  };

  return (
    <div className="flex flex-row h-full relative">
        {/* HUD Overlay for Selected Pad */}
        {selectedPadId !== null && (
            <div className="absolute top-4 left-4 z-10 w-64 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-lg shadow-xl animate-in slide-in-from-left-4">
                <h3 className="text-cyan-400 font-bold text-sm mb-2 uppercase tracking-widest">Echo Mixer</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    A physical reverb chamber. The music creates ripples. 
                </p>
                <ul className="text-[10px] text-slate-500 space-y-1 mb-4 list-disc pl-3">
                    <li>Drag <strong className="text-white">Sources</strong> to mix spatially.</li>
                    <li>Click <strong className="text-white">Sources</strong> to MUTE ripples.</li>
                    <li>Add <strong className="text-white">Stones</strong> to reflect echoes.</li>
                </ul>

                <div className="bg-slate-800 p-3 rounded border border-slate-700 mb-4">
                    <div className="flex justify-between text-[10px] text-white font-bold mb-1">
                        <span>ECHO STRENGTH</span>
                        <span className="text-fuchsia-400">{Math.round(selectedPadStrength * 100)}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="0.1" 
                        max="1.0" 
                        step="0.05"
                        value={selectedPadStrength}
                        onChange={(e) => setSelectedPadStrength(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </div>

                <button 
                    onClick={clearPads}
                    className="w-full py-2 border border-red-900/50 bg-red-900/20 text-red-400 text-xs font-bold rounded hover:bg-red-900/40 transition-colors uppercase"
                >
                    Clear All Stones
                </button>
            </div>
        )}

        <div 
            ref={wrapperRef} 
            className="flex-1 h-full bg-[#0a0a0e] relative overflow-hidden cursor-crosshair select-none touch-none"
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
        >
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    </div>
  );
};
