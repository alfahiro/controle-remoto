import React from 'react';
import { Power } from 'lucide-react';

interface TopBarProps {
  onOpenModal: (modal: 'wifi' | 'channels' | 'keyboard' | 'ircodes') => void;
  powerOn: boolean;
  onTogglePower: () => void;
  connectedIp?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenModal,
  powerOn,
  onTogglePower,
  connectedIp,
}) => {
  return (
    <header className="w-full bg-[#0d1017]/90 backdrop-blur-md border-b border-neutral-800/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <span className="text-base sm:text-lg font-black tracking-[0.2em] text-white">
            PHILCO
          </span>
          <span className="text-xs font-semibold text-indigo-400 font-mono">
            VIRTUAL
          </span>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
          <button
            onClick={() => onOpenModal('wifi')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            {connectedIp ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 font-mono text-xs">Wi-Fi: {connectedIp}</span>
              </>
            ) : (
              <span>Conectar Wi-Fi</span>
            )}
          </button>
          <button
            onClick={() => onOpenModal('channels')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Guia de Canais
          </button>
          <button
            onClick={() => onOpenModal('keyboard')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Teclado Remoto
          </button>
          <button
            onClick={() => onOpenModal('ircodes')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Códigos IR
          </button>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onTogglePower}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow ${
              powerOn
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{powerOn ? 'TV Ligada' : 'Ligar TV'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
