import React, { useState } from 'react';
import {
  Power,
  Home,
  ArrowLeft,
  Volume2,
  Volume1,
  VolumeX,
  Play,
  Settings,
  Tv,
  Mic,
  Hash,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Radio,
} from 'lucide-react';
import { StreamingAppId } from '../types';

interface PhilcoAndroidRemoteProps {
  onAction: (action: string) => void;
  onAppShortcut: (app: StreamingAppId) => void;
  onNumericInput: (num: string) => void;
  isTransmitting: boolean;
  powerOn: boolean;
}

export const PhilcoAndroidRemote: React.FC<PhilcoAndroidRemoteProps> = ({
  onAction,
  onAppShortcut,
  onNumericInput,
  isTransmitting,
  powerOn,
}) => {
  const [showNumpad, setShowNumpad] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[310px] bg-gradient-to-b from-[#1c1f26] via-[#12151b] to-[#0b0d12] p-4 sm:p-5 rounded-[44px] shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] border-2 border-neutral-700/60 select-none">
      
      {/* Top IR Emitter */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
        <div
          className={`w-6 h-3 rounded-t-full transition-all duration-150 ${
            isTransmitting
              ? 'bg-cyan-400 shadow-[0_0_16px_#22d3ee]'
              : 'bg-neutral-700/80'
          }`}
        />
      </div>

      {/* Top Controls: Input Source, Settings & Power */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <button
          onClick={() => onAction('inputs')}
          title="Entradas (HDMI / TV / AV)"
          aria-label="Entradas"
          className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700 shadow cursor-pointer"
        >
          <Tv className="w-4 h-4" />
        </button>

        <button
          onClick={() => onAction('settings')}
          title="Configurações da TV"
          aria-label="Configurações"
          className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700 shadow cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={() => onAction('power')}
          title="Ligar / Desligar TV"
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

      {/* Sub Header: Google Assistant & Keypad Toggle */}
      <div className="flex items-center justify-around my-2 py-1 bg-neutral-900/60 rounded-2xl border border-neutral-800">
        <button
          onClick={() => onAction('assistant')}
          title="Google Assistente de Voz"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-500/30 hover:border-blue-400 text-blue-300 flex items-center gap-2 text-xs font-semibold cursor-pointer active:scale-95 transition-all"
        >
          <Mic className="w-4 h-4 text-blue-400" />
          <span>Assistente</span>
        </button>

        <button
          onClick={() => setShowNumpad(!showNumpad)}
          title="Teclado Numérico"
          className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold cursor-pointer active:scale-95 transition-all ${
            showNumpad
              ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
              : 'bg-neutral-800 border-neutral-700 text-neutral-300'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>123</span>
        </button>
      </div>

      {/* Optional Numpad Accordion */}
      {showNumpad && (
        <div className="grid grid-cols-3 gap-2 my-2 p-2.5 bg-neutral-950/80 rounded-2xl border border-neutral-800 animate-fadeIn">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((k) => (
            <button
              key={k}
              onClick={() => onNumericInput(k)}
              className="h-9 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:bg-cyan-700 text-white font-mono text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95"
            >
              {k}
            </button>
          ))}
        </div>
      )}

      {/* Circular Navigation Ring D-Pad */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 mx-auto my-3 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full bg-neutral-900 border-2 border-neutral-700/80 shadow-inner flex items-center justify-center overflow-hidden">
          
          {/* Top segment */}
          <button
            onClick={() => onAction('up')}
            title="Cima"
            aria-label="Cima"
            className="absolute top-0 left-0 right-0 h-16 hover:bg-neutral-800/80 active:bg-neutral-700 text-neutral-300 flex items-start justify-center pt-2 cursor-pointer transition-colors"
          >
            <ChevronUp className="w-6 h-6" />
          </button>

          {/* Bottom segment */}
          <button
            onClick={() => onAction('down')}
            title="Baixo"
            aria-label="Baixo"
            className="absolute bottom-0 left-0 right-0 h-16 hover:bg-neutral-800/80 active:bg-neutral-700 text-neutral-300 flex items-end justify-center pb-2 cursor-pointer transition-colors"
          >
            <ChevronDown className="w-6 h-6" />
          </button>

          {/* Left segment */}
          <button
            onClick={() => onAction('left')}
            title="Esquerda"
            aria-label="Esquerda"
            className="absolute left-0 top-0 bottom-0 w-16 hover:bg-neutral-800/80 active:bg-neutral-700 text-neutral-300 flex items-center justify-start pl-2 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right segment */}
          <button
            onClick={() => onAction('right')}
            title="Direita"
            aria-label="Direita"
            className="absolute right-0 top-0 bottom-0 w-16 hover:bg-neutral-800/80 active:bg-neutral-700 text-neutral-300 flex items-center justify-end pr-2 cursor-pointer transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Center OK Button */}
        <button
          onClick={() => onAction('ok')}
          title="OK / Enter"
          aria-label="OK"
          className="relative z-10 w-20 h-20 rounded-full bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 active:scale-95 text-white font-bold text-sm tracking-wider flex items-center justify-center shadow-lg border border-neutral-600 cursor-pointer transition-all"
        >
          OK
        </button>
      </div>

      {/* Navigation Keys: Back, Home, Live TV */}
      <div className="grid grid-cols-3 gap-3 my-3">
        <button
          onClick={() => onAction('back')}
          title="Voltar"
          aria-label="Voltar"
          className="h-11 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700/60 shadow cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onAction('home')}
          title="Página Inicial"
          aria-label="Home"
          className="h-11 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700/60 shadow cursor-pointer"
        >
          <Home className="w-5 h-5" />
        </button>
        <button
          onClick={() => onAction('livetv')}
          title="TV Aberta Ao Vivo"
          aria-label="TV Aberta"
          className="h-11 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700/60 shadow cursor-pointer"
        >
          <Radio className="w-5 h-5" />
        </button>
      </div>

      {/* Rocker Bars for Volume and Channel */}
      <div className="grid grid-cols-3 gap-3 my-3">
        {/* Volume Rocker */}
        <div className="bg-neutral-800/90 rounded-2xl p-1 flex flex-col items-center border border-neutral-700">
          <button
            onClick={() => onAction('volume_up')}
            title="Aumentar Volume"
            className="w-full h-10 flex items-center justify-center text-xs font-bold text-white hover:bg-neutral-700 rounded-xl active:scale-95 cursor-pointer"
          >
            VOL +
          </button>
          <div className="w-6 h-px bg-neutral-700 my-0.5" />
          <button
            onClick={() => onAction('volume_down')}
            title="Diminuir Volume"
            className="w-full h-10 flex items-center justify-center text-xs font-bold text-white hover:bg-neutral-700 rounded-xl active:scale-95 cursor-pointer"
          >
            VOL -
          </button>
        </div>

        {/* Center Mute & Guide */}
        <div className="flex flex-col justify-between py-1">
          <button
            onClick={() => onAction('mute')}
            title="Mudo"
            className="h-10 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 flex items-center justify-center border border-neutral-700 cursor-pointer shadow"
          >
            <VolumeX className="w-5 h-5" />
          </button>
          <button
            onClick={() => onAction('guide')}
            title="Guia de Canais (EPG)"
            className="h-10 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 text-xs font-bold flex items-center justify-center border border-neutral-700 cursor-pointer shadow"
          >
            GUIA
          </button>
        </div>

        {/* Channel Rocker */}
        <div className="bg-neutral-800/90 rounded-2xl p-1 flex flex-col items-center border border-neutral-700">
          <button
            onClick={() => onAction('channel_up')}
            title="Próximo Canal"
            className="w-full h-10 flex items-center justify-center text-xs font-bold text-white hover:bg-neutral-700 rounded-xl active:scale-95 cursor-pointer"
          >
            CH +
          </button>
          <div className="w-6 h-px bg-neutral-700 my-0.5" />
          <button
            onClick={() => onAction('channel_down')}
            title="Canal Anterior"
            className="w-full h-10 flex items-center justify-center text-xs font-bold text-white hover:bg-neutral-700 rounded-xl active:scale-95 cursor-pointer"
          >
            CH -
          </button>
        </div>
      </div>

      {/* Streaming App Buttons */}
      <div className="grid grid-cols-2 gap-2.5 my-3">
        <button
          onClick={() => onAppShortcut('youtube')}
          className="h-11 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-95 border border-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>YouTube</span>
        </button>

        <button
          onClick={() => onAppShortcut('netflix')}
          className="h-11 rounded-xl bg-black hover:bg-neutral-900 active:scale-95 border border-neutral-700 text-[#E50914] font-black text-sm tracking-wide flex items-center justify-center shadow cursor-pointer"
        >
          NETFLIX
        </button>

        <button
          onClick={() => onAppShortcut('prime')}
          className="h-11 rounded-xl bg-[#000511] hover:bg-[#000c24] active:scale-95 border border-neutral-700 text-[#00A8E1] font-bold text-xs tracking-tight flex items-center justify-center shadow cursor-pointer"
        >
          prime video
        </button>

        <button
          onClick={() => onAppShortcut('globoplay')}
          className="h-11 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-95 border border-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>globoplay</span>
        </button>
      </div>

      {/* Bottom Philco Badge */}
      <div className="text-center pt-2 pb-1">
        <span className="text-sm font-black tracking-[0.25em] text-neutral-400 select-none">
          PHILCO
        </span>
      </div>
    </div>
  );
};
