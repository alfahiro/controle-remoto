import React, { useState } from 'react';
import { Keyboard, Send, X, CornerDownLeft, Sparkles } from 'lucide-react';
import { triggerHaptic, playButtonClickSound } from '../utils/audio';

interface KeyboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendText: (text: string) => void;
}

export const KeyboardModal: React.FC<KeyboardModalProps> = ({
  isOpen,
  onClose,
  onSendText,
}) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'Filmes de Ação',
    'Música Pop Brasil',
    'Desenhos infantis',
    'Jornal Nacional',
    'Futebol ao vivo',
    'Receitas fáceis',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    playButtonClickSound();
    triggerHaptic(25);
    onSendText(text);
    setText('');
    onClose();
  };

  const handleQuickSend = (prompt: string) => {
    playButtonClickSound();
    triggerHaptic(20);
    onSendText(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Teclado Virtual Philco</h3>
              <p className="text-[11px] text-neutral-400">Envie textos e buscas diretamente para a TV</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Digite o que deseja buscar na TV:
          </label>
          <div className="relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ex: Stranger Things, CazéTV, Sertanejo..."
              autoFocus
              className="w-full h-12 pl-4 pr-12 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Buscas Rápidas:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleQuickSend(item)}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs border border-neutral-700/60 transition-colors cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
          <span>Suporta Roku ECP e digitação no simulador</span>
          <span className="font-mono">Pressione Enter</span>
        </div>
      </div>
    </div>
  );
};
