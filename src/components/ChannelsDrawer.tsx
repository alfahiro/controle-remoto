import React from 'react';
import { TvChannel } from '../types';
import { BRAZILIAN_CHANNELS } from '../data/tvData';
import { Tv, X, Play, Clock, Sparkles } from 'lucide-react';
import { triggerHaptic, playButtonClickSound } from '../utils/audio';

interface ChannelsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentChannelIndex: number;
  onSelectChannel: (index: number) => void;
}

export const ChannelsDrawer: React.FC<ChannelsDrawerProps> = ({
  isOpen,
  onClose,
  currentChannelIndex,
  onSelectChannel,
}) => {
  if (!isOpen) return null;

  const handleTune = (idx: number) => {
    playButtonClickSound();
    triggerHaptic(25);
    onSelectChannel(idx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl max-h-[85vh] bg-neutral-900 border border-neutral-700 rounded-3xl p-5 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Canais Digitais do Brasil</h3>
              <p className="text-xs text-neutral-400">Sintonize com 1 toque em sua TV Philco</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Grid */}
        <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-2">
          {BRAZILIAN_CHANNELS.map((ch, idx) => {
            const isCurrent = currentChannelIndex === idx;
            return (
              <div
                key={ch.number}
                onClick={() => handleTune(idx)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-lg'
                    : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-800/60 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-md shrink-0"
                    style={{ backgroundColor: ch.color }}
                  >
                    {ch.logoText}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-400">
                        {ch.number}
                      </span>
                      <h4 className="text-sm font-semibold text-white">{ch.name}</h4>
                      {isCurrent && (
                        <span className="text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 px-1.5 py-0.2 rounded font-medium">
                          No Ar
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      {ch.currentShow}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      <span>A seguir: {ch.nextShow}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                  }`}
                >
                  {isCurrent ? 'Sintonizado' : 'Assistir'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between shrink-0">
          <span>Padrão Brasileiro SBTVD / ISDB-T (HD 1080i)</span>
          <span className="text-indigo-400">8 Canais configurados</span>
        </div>
      </div>
    </div>
  );
};
