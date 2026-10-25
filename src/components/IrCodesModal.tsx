import React, { useState } from 'react';
import { Radio, X, Copy, Check, Info } from 'lucide-react';
import { PHILCO_IR_CODES } from '../data/tvData';
import { triggerHaptic } from '../utils/audio';

interface IrCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IrCodesModal: React.FC<IrCodesModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    triggerHaptic(20);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[85vh] bg-neutral-900 border border-neutral-700 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Códigos Infravermelho (IR) Philco</h3>
              <p className="text-xs text-neutral-400">Tabela de comandos hexadecimais para emissores IR e automação</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tech Specs Banner */}
        <div className="my-3 p-3 bg-neutral-950/80 rounded-2xl border border-neutral-800 text-xs text-neutral-300 flex items-center gap-3 shrink-0">
          <Info className="w-4 h-4 text-purple-400 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-white">Especificação do Protocolo: </span>
            <span>NEC 32-bit (Frequência: 38 kHz · Código do Fabricante: 0xFD02). Compatível com Xiaomi Mi Remote, Broadlink, ESP32 e Flipper Zero.</span>
          </div>
        </div>

        {/* Codes Table List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {PHILCO_IR_CODES.map((item) => (
            <div
              key={item.functionName}
              className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between transition-colors"
            >
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white">{item.functionName}</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">{item.description}</p>
                <span className="text-[10px] text-purple-400 font-mono">{item.protocol}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <code className="px-2 py-1 bg-neutral-900 border border-neutral-700/80 rounded-lg text-xs font-mono text-cyan-300">
                  {item.necHex}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy(item.necHex)}
                  title="Copiar Código Hex"
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 cursor-pointer transition-colors"
                >
                  {copiedCode === item.necHex ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 shrink-0">
          <span>{PHILCO_IR_CODES.length} comandos listados</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
