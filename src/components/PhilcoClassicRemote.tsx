import React from 'react';
import {
  Power,
  Volume2,
  Volume1,
  VolumeX,
  Play,
  RotateCcw,
  Moon,
  Maximize2,
  Info,
  Tv,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { StreamingAppId } from '../types';

interface PhilcoClassicRemoteProps {
  onAction: (action: string) => void;
  onAppShortcut: (app: StreamingAppId) => void;
  onNumericInput: (num: string) => void;
  isTransmitting: boolean;
  powerOn: boolean;
}

export const PhilcoClassicRemote: React.FC<PhilcoClassicRemoteProps> = ({
  onAction,
  onAppShortcut,
  onNumericInput,
  isTransmitting,
  powerOn,
}) => {
  return (
    <div className="relative mx-auto w-full max-w-[270px] sm:max-w-[300px] bg-gradient-to-b from-[#232730] via-[#16181f] to-[#0f1116] p-4 rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] border-2 border-neutral-700/60 select-none">
      
      {/* Top IR Emitter */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
        <div
          className={`w-6 h-3 rounded-t-full transition-all duration-150 ${
            isTransmitting
              ? 'bg-red-500 shadow-[0_0_16px_#ef4444]'
              : 'bg-neutral-700/80'
          }`}
        />
      </div>

      {/* Top Header: Power & Mute */}
      <div className="flex items-center justify-between mb-3 pt-1">
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

        <div className="text-[10px] tracking-widest text-neutral-400 font-bold uppercase font-mono">
          SMART DTV
        </div>

        <button
          onClick={() => onAction('mute')}
          title="Mudo"
          aria-label="Mudo"
          className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700 cursor-pointer shadow"
        >
          <VolumeX className="w-5 h-5" />
        </button>
      </div>

      {/* Numeric Keypad 1-9, ., 0, Del */}
      <div className="grid grid-cols-3 gap-2 my-2 p-2 bg-neutral-900/70 rounded-2xl border border-neutral-800">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', '⌫'].map((k) => (
          <button
            key={k}
            onClick={() => onNumericInput(k)}
            className="h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 active:scale-95 text-white font-mono text-sm font-bold flex items-center justify-center border border-neutral-700/40 shadow cursor-pointer transition-all"
          >
            {k}
          </button>
        ))}
      </div>

      {/* Utility Strip: Aspect, Sleep Timer, Source */}
      <div className="grid grid-cols-3 gap-2 my-2">
        <button
          onClick={() => onAction('aspect')}
          title="Formato de Tela (16:9 / 4:3)"
          className="h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 text-[10px] font-bold flex items-center justify-center gap-1 border border-neutral-700 cursor-pointer"
        >
          <Maximize2 className="w-3 h-3" />
          <span>ASPECT</span>
        </button>
        <button
          onClick={() => onAction('sleep')}
          title="Timer de Desligamento"
          className="h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 text-[10px] font-bold flex items-center justify-center gap-1 border border-neutral-700 cursor-pointer"
        >
          <Moon className="w-3 h-3 text-amber-400" />
          <span>SLEEP</span>
        </button>
        <button
          onClick={() => onAction('inputs')}
          title="Entrada / Source"
          className="h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 text-[10px] font-bold flex items-center justify-center gap-1 border border-neutral-700 cursor-pointer"
        >
          <Tv className="w-3 h-3" />
          <span>SOURCE</span>
        </button>
      </div>

      {/* Central Navigation D-Pad */}
      <div className="relative w-44 h-44 sm:w-48 sm:h-48 mx-auto my-3 flex items-center justify-center">
        {/* Ring */}
        <div className="absolute inset-0 rounded-full bg-neutral-900 border-2 border-neutral-700 shadow-inner flex items-center justify-center overflow-hidden">
          <button
            onClick={() => onAction('up')}
            title="Cima"
            aria-label="Cima"
            className="absolute top-0 left-0 right-0 h-14 hover:bg-neutral-800/90 active:bg-neutral-700 text-neutral-200 flex items-start justify-center pt-2 cursor-pointer"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <button
            onClick={() => onAction('down')}
            title="Baixo"
            aria-label="Baixo"
            className="absolute bottom-0 left-0 right-0 h-14 hover:bg-neutral-800/90 active:bg-neutral-700 text-neutral-200 flex items-end justify-center pb-2 cursor-pointer"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
          <button
            onClick={() => onAction('left')}
            title="Esquerda"
            aria-label="Esquerda"
            className="absolute left-0 top-0 bottom-0 w-14 hover:bg-neutral-800/90 active:bg-neutral-700 text-neutral-200 flex items-center justify-start pl-2 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => onAction('right')}
            title="Direita"
            aria-label="Direita"
            className="absolute right-0 top-0 bottom-0 w-14 hover:bg-neutral-800/90 active:bg-neutral-700 text-neutral-200 flex items-center justify-end pr-2 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Center OK */}
        <button
          onClick={() => onAction('ok')}
          title="OK"
          aria-label="OK"
          className="relative z-10 w-16 h-16 rounded-full bg-neutral-700 hover:bg-neutral-600 active:scale-95 text-white font-bold text-xs tracking-wider flex items-center justify-center shadow border border-neutral-500 cursor-pointer"
        >
          ENTER
        </button>
      </div>

      {/* Menu, Smart, Exit, Info */}
      <div className="grid grid-cols-4 gap-2 my-2 text-[10px] font-bold">
        <button
          onClick={() => onAction('menu')}
          className="h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700 cursor-pointer"
        >
          MENU
        </button>
        <button
          onClick={() => onAction('home')}
          className="h-9 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 active:scale-95 text-white flex items-center justify-center shadow cursor-pointer"
        >
          SMART
        </button>
        <button
          onClick={() => onAction('back')}
          className="h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700 cursor-pointer"
        >
          SAIR
        </button>
        <button
          onClick={() => onAction('info')}
          className="h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 flex items-center justify-center border border-neutral-700 cursor-pointer"
        >
          INFO
        </button>
      </div>

      {/* Four Color Buttons (Red, Green, Yellow, Blue for DTV Interactive) */}
      <div className="grid grid-cols-4 gap-2 my-2">
        <button
          onClick={() => onAction('color_red')}
          className="h-6 rounded-md bg-red-600 hover:bg-red-500 active:scale-95 shadow cursor-pointer"
          title="Função Vermelho"
        />
        <button
          onClick={() => onAction('color_green')}
          className="h-6 rounded-md bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow cursor-pointer"
          title="Função Verde"
        />
        <button
          onClick={() => onAction('color_yellow')}
          className="h-6 rounded-md bg-amber-500 hover:bg-amber-400 active:scale-95 shadow cursor-pointer"
          title="Função Amarelo"
        />
        <button
          onClick={() => onAction('color_blue')}
          className="h-6 rounded-md bg-blue-600 hover:bg-blue-500 active:scale-95 shadow cursor-pointer"
          title="Função Azul"
        />
      </div>

      {/* Volume and Channel Dual Rockers */}
      <div className="grid grid-cols-2 gap-3 my-2.5">
        <div className="bg-neutral-800/80 rounded-2xl p-1 border border-neutral-700 flex flex-col items-center">
          <button
            onClick={() => onAction('volume_up')}
            className="w-full h-9 flex items-center justify-center text-xs font-bold text-white hover:bg-neutral-700 rounded-xl active:scale-95 cursor-pointer"
          >
            VOL +
          </button>
          <div className="w-6 h-px bg-neutral-700 my-0.5" />
          <button
            onClick={() => onAction('volume_down')}
            className="w-full h-9 flex items-center justify-center text-xs font-bold text-white hover:bg-neutral-700 rounded-xl active:scale-95 cursor-pointer"
          >
            VOL -
          </button>
        </div>

        <div className="bg-neutral-800/80 rounded-2xl p-1 border border-neutral-700 flex flex-col items-center">
          <button
            onClick={() => onAction('channel_up')}
            className="w-full h-9 flex items-center justify-center text-xs font-bold text-white hover:bg-neutral-700 rounded-xl active:scale-95 cursor-pointer"
          >
            CH +
          </button>
          <div className="w-6 h-px bg-neutral-700 my-0.5" />
          <button
            onClick={() => onAction('channel_down')}
            className="w-full h-9 flex items-center justify-center text-xs font-bold text-white hover:bg-neutral-700 rounded-xl active:scale-95 cursor-pointer"
          >
            CH -
          </button>
        </div>
      </div>

      {/* Streaming Shortcuts */}
      <div className="grid grid-cols-3 gap-2 my-2">
        <button
          onClick={() => onAppShortcut('netflix')}
          className="h-9 rounded-xl bg-black hover:bg-neutral-900 active:scale-95 text-[#E50914] font-black text-xs border border-neutral-700 flex items-center justify-center cursor-pointer"
        >
          NETFLIX
        </button>
        <button
          onClick={() => onAppShortcut('youtube')}
          className="h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white font-bold text-xs border border-neutral-700 flex items-center justify-center gap-1 cursor-pointer"
        >
          <Play className="w-3 h-3 text-red-500 fill-red-500" />
          <span>YouTube</span>
        </button>
        <button
          onClick={() => onAppShortcut('globoplay')}
          className="h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white font-bold text-xs border border-neutral-700 flex items-center justify-center cursor-pointer"
        >
          globo
        </button>
      </div>

      {/* Philco Logo */}
      <div className="text-center pt-2 pb-0.5">
        <span className="text-sm font-black tracking-[0.25em] text-neutral-400 select-none">
          PHILCO
        </span>
      </div>
    </div>
  );
};
