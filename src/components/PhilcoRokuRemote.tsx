import React from 'react';
import {
  Power,
  Home,
  ArrowLeft,
  RotateCcw,
  Volume2,
  Volume1,
  VolumeX,
  Play,
  Pause,
  FastForward,
  Rewind,
  Asterisk,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { StreamingAppId } from '../types';

interface PhilcoRokuRemoteProps {
  onAction: (action: string) => void;
  onAppShortcut: (app: StreamingAppId) => void;
  isTransmitting: boolean;
  powerOn: boolean;
}

export const PhilcoRokuRemote: React.FC<PhilcoRokuRemoteProps> = ({
  onAction,
  onAppShortcut,
  isTransmitting,
  powerOn,
}) => {
  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[310px] bg-gradient-to-b from-neutral-800 via-neutral-900 to-neutral-950 p-4 sm:p-5 rounded-[40px] sm:rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] border-2 border-neutral-700/60 select-none">
      
      {/* Top IR Emitter LED Bulb */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
        <div
          className={`w-6 h-3 rounded-t-full transition-all duration-150 ${
            isTransmitting
              ? 'bg-purple-400 shadow-[0_0_16px_#c084fc]'
              : 'bg-neutral-700/80'
          }`}
        />
      </div>

      {/* Top Header: Power & Brand indicator */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <div className="text-[10px] tracking-widest text-neutral-400 font-bold uppercase font-mono">
          ROKU TV
        </div>
        <button
          onClick={() => onAction('power')}
          title="Ligar / Desligar TV Philco"
          aria-label="Power"
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
            powerOn
              ? 'bg-red-600 text-white shadow-red-900/50 hover:bg-red-500'
              : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
          }`}
        >
          <Power className="w-5 h-5" />
        </button>
      </div>

      {/* Back and Home row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => onAction('back')}
          title="Voltar"
          aria-label="Voltar"
          className="h-11 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 active:scale-95 text-neutral-200 flex items-center justify-center border border-neutral-700/50 shadow transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onAction('home')}
          title="Página Inicial (Home)"
          aria-label="Home"
          className="h-11 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 active:scale-95 text-neutral-200 flex items-center justify-center border border-neutral-700/50 shadow transition-all cursor-pointer"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>

      {/* Directional Pad (Roku Purple Iconic D-Pad) */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 mx-auto my-3 flex items-center justify-center">
        {/* Outer circular bevel */}
        <div className="absolute inset-0 rounded-full bg-neutral-950/80 border border-neutral-700/40 shadow-inner" />

        {/* Up */}
        <button
          onClick={() => onAction('up')}
          title="Navegar para cima"
          aria-label="Para cima"
          className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-14 rounded-t-3xl bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800 active:scale-95 text-white flex items-center justify-center shadow transition-all cursor-pointer"
        >
          <ChevronUp className="w-7 h-7" />
        </button>

        {/* Down */}
        <button
          onClick={() => onAction('down')}
          title="Navegar para baixo"
          aria-label="Para baixo"
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-14 rounded-b-3xl bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800 active:scale-95 text-white flex items-center justify-center shadow transition-all cursor-pointer"
        >
          <ChevronDown className="w-7 h-7" />
        </button>

        {/* Left */}
        <button
          onClick={() => onAction('left')}
          title="Navegar para a esquerda"
          aria-label="Para a esquerda"
          className="absolute left-1 top-1/2 -translate-y-1/2 w-14 h-16 rounded-l-3xl bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800 active:scale-95 text-white flex items-center justify-center shadow transition-all cursor-pointer"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* Right */}
        <button
          onClick={() => onAction('right')}
          title="Navegar para a direita"
          aria-label="Para a direita"
          className="absolute right-1 top-1/2 -translate-y-1/2 w-14 h-16 rounded-r-3xl bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800 active:scale-95 text-white flex items-center justify-center shadow transition-all cursor-pointer"
        >
          <ChevronRight className="w-7 h-7" />
        </button>

        {/* Center OK Button */}
        <button
          onClick={() => onAction('ok')}
          title="Confirmar seleção"
          aria-label="OK"
          className="relative z-10 w-16 h-16 rounded-full bg-indigo-800 hover:bg-indigo-700 active:bg-indigo-900 active:scale-90 text-white font-bold text-sm tracking-wide flex items-center justify-center shadow-lg border border-indigo-400/30 transition-all cursor-pointer"
        >
          OK
        </button>
      </div>

      {/* Secondary Controls (Replay & Asterisk / Options) */}
      <div className="grid grid-cols-2 gap-4 my-3">
        <button
          onClick={() => onAction('replay')}
          title="Replay Instantâneo (10 segundos)"
          aria-label="Replay"
          className="h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700/50 shadow transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => onAction('options')}
          title="Opções (*)"
          aria-label="Opções"
          className="h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700/50 shadow transition-all cursor-pointer font-bold text-lg"
        >
          <Asterisk className="w-5 h-5" />
        </button>
      </div>

      {/* Media Playback Controls */}
      <div className="grid grid-cols-3 gap-2 my-3">
        <button
          onClick={() => onAction('rewind')}
          title="Retroceder"
          aria-label="Retroceder"
          className="h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700/50 shadow transition-all cursor-pointer"
        >
          <Rewind className="w-4 h-4" />
        </button>
        <button
          onClick={() => onAction('play_pause')}
          title="Reproduzir / Pausar"
          aria-label="Play Pause"
          className="h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 active:scale-95 text-neutral-100 flex items-center justify-center border border-neutral-700/50 shadow transition-all cursor-pointer"
        >
          <div className="flex items-center gap-0.5">
            <Play className="w-3.5 h-3.5 fill-current" />
            <Pause className="w-3.5 h-3.5 fill-current" />
          </div>
        </button>
        <button
          onClick={() => onAction('fast_forward')}
          title="Avançar"
          aria-label="Avançar"
          className="h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700/50 shadow transition-all cursor-pointer"
        >
          <FastForward className="w-4 h-4" />
        </button>
      </div>

      {/* Volume Quick Controls Row */}
      <div className="grid grid-cols-3 gap-2 my-3 bg-neutral-950/60 p-1.5 rounded-2xl border border-neutral-800">
        <button
          onClick={() => onAction('volume_down')}
          title="Diminuir Volume"
          aria-label="Volume Menos"
          className="h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 active:scale-95 text-neutral-200 flex items-center justify-center gap-1 text-xs font-semibold transition-all cursor-pointer"
        >
          <Volume1 className="w-4 h-4" />
          <span>VOL -</span>
        </button>
        <button
          onClick={() => onAction('mute')}
          title="Mudo"
          aria-label="Silenciar Áudio"
          className="h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 active:scale-95 text-neutral-200 flex items-center justify-center transition-all cursor-pointer"
        >
          <VolumeX className="w-4 h-4" />
        </button>
        <button
          onClick={() => onAction('volume_up')}
          title="Aumentar Volume"
          aria-label="Volume Mais"
          className="h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 active:scale-95 text-neutral-200 flex items-center justify-center gap-1 text-xs font-semibold transition-all cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>VOL +</span>
        </button>
      </div>

      {/* Quick Streaming App Buttons (Official Philco Roku Preset) */}
      <div className="grid grid-cols-2 gap-2.5 my-3 pt-1">
        {/* Netflix */}
        <button
          onClick={() => onAppShortcut('netflix')}
          title="Abrir Netflix"
          className="h-11 rounded-xl bg-[#000000] hover:bg-neutral-900 active:scale-95 border border-neutral-700 text-[#E50914] font-black text-sm tracking-wider flex items-center justify-center shadow transition-all cursor-pointer"
        >
          NETFLIX
        </button>

        {/* Globoplay */}
        <button
          onClick={() => onAppShortcut('globoplay')}
          title="Abrir Globoplay"
          className="h-11 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-95 border border-neutral-700 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-1 shadow transition-all cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          <span>globoplay</span>
        </button>

        {/* Prime Video */}
        <button
          onClick={() => onAppShortcut('prime')}
          title="Abrir Prime Video"
          className="h-11 rounded-xl bg-[#000511] hover:bg-[#000c24] active:scale-95 border border-neutral-700 text-[#00A8E1] font-bold text-xs tracking-tight flex items-center justify-center shadow transition-all cursor-pointer"
        >
          prime video
        </button>

        {/* Disney+ / YouTube */}
        <button
          onClick={() => onAppShortcut('youtube')}
          title="Abrir YouTube"
          className="h-11 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-95 border border-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow transition-all cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-red-600 fill-red-600" />
          <span>YouTube</span>
        </button>
      </div>

      {/* Bottom Philco Engraved Wordmark */}
      <div className="text-center pt-2 pb-1">
        <span className="text-sm font-black tracking-[0.3em] text-neutral-400 select-none">
          PHILCO
        </span>
      </div>
    </div>
  );
};
