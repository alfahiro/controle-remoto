import React, { useState, useRef } from 'react';
import { MousePointer, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { triggerHaptic, playButtonClickSound } from '../utils/audio';

interface TouchpadTabProps {
  onDirectionAction: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onSelectAction: () => void;
  onBackAction: () => void;
}

export const TouchpadTab: React.FC<TouchpadTabProps> = ({
  onDirectionAction,
  onSelectAction,
  onBackAction,
}) => {
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [touchActive, setTouchActive] = useState(false);
  const padRef = useRef<HTMLDivElement>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setTouchActive(true);
    lastTouchRef.current = { x: e.clientX, y: e.clientY };
    triggerHaptic(15);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!touchActive || !padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const xPct = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 5), 95);
    const yPct = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 5), 95);

    setCursorPos({ x: xPct, y: yPct });

    if (lastTouchRef.current) {
      const dx = e.clientX - lastTouchRef.current.x;
      const dy = e.clientY - lastTouchRef.current.y;
      const threshold = 35;

      if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) onDirectionAction('right');
          else onDirectionAction('left');
        } else {
          if (dy > 0) onDirectionAction('down');
          else onDirectionAction('up');
        }
        triggerHaptic(20);
        lastTouchRef.current = { x: e.clientX, y: e.clientY };
      }
    }
  };

  const handlePointerUp = () => {
    setTouchActive(false);
    lastTouchRef.current = null;
  };

  const handleTapCenter = () => {
    playButtonClickSound();
    triggerHaptic(25);
    onSelectAction();
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-neutral-900/90 rounded-3xl border border-neutral-800 shadow-xl select-none">
      <div className="flex items-center justify-between mb-3 text-xs text-neutral-400">
        <div className="flex items-center gap-1.5 font-medium text-neutral-200">
          <MousePointer className="w-4 h-4 text-cyan-400" />
          <span>Touchpad & Gestos</span>
        </div>
        <span>Deslize para mover · Toque para clicar</span>
      </div>

      {/* Main Touch Area */}
      <div
        ref={padRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-64 sm:h-72 rounded-2xl bg-neutral-950 border-2 border-dashed border-neutral-700/80 flex items-center justify-center cursor-crosshair overflow-hidden touch-none"
      >
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Cursor Point */}
        <div
          className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-cyan-400 bg-cyan-500/20 shadow-[0_0_12px_#06b6d4] pointer-events-none transition-transform duration-75 flex items-center justify-center ${
            touchActive ? 'scale-125' : 'scale-100'
          }`}
          style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
        >
          <div className="w-2 h-2 rounded-full bg-cyan-300" />
        </div>

        {/* Center Prompt */}
        {!touchActive && (
          <div className="text-center pointer-events-none opacity-40">
            <MousePointer className="w-8 h-8 mx-auto mb-1 text-neutral-400" />
            <p className="text-xs text-neutral-300">Área de Toque Virtual</p>
          </div>
        )}
      </div>

      {/* Bottom Trackpad Buttons */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        <button
          onClick={onBackAction}
          className="h-12 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 text-xs font-semibold flex items-center justify-center border border-neutral-700 cursor-pointer"
        >
          Voltar
        </button>

        <button
          onClick={handleTapCenter}
          className="h-12 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-cyan-900/40 cursor-pointer"
        >
          Clique / OK
        </button>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => {
              triggerHaptic(15);
              onDirectionAction('up');
            }}
            className="h-12 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700 cursor-pointer"
            title="Rolar Cima"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              triggerHaptic(15);
              onDirectionAction('down');
            }}
            className="h-12 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700 cursor-pointer"
            title="Rolar Baixo"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
