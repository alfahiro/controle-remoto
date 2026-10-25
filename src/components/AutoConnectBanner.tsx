import React, { useState } from 'react';
import {
  Wifi,
  CheckCircle2,
  RefreshCw,
  Tv,
  Signal,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { DiscoveredTvDevice } from '../utils/autoDiscovery';
import { triggerHaptic, playButtonClickSound } from '../utils/audio';

interface AutoConnectBannerProps {
  currentDevice: DiscoveredTvDevice | null;
  isScanning: boolean;
  scanProgressText: string;
  onScanAgain: () => void;
  onOpenManualConfig: () => void;
  onSendTestPing: () => void;
}

export const AutoConnectBanner: React.FC<AutoConnectBannerProps> = ({
  currentDevice,
  isScanning,
  scanProgressText,
  onScanAgain,
  onOpenManualConfig,
  onSendTestPing,
}) => {
  const [testSent, setTestSent] = useState(false);

  const handleTest = () => {
    playButtonClickSound();
    triggerHaptic(20);
    setTestSent(true);
    onSendTestPing();
    setTimeout(() => setTestSent(false), 2000);
  };

  return (
    <div className="w-full bg-gradient-to-r from-neutral-900/95 via-[#0d1527]/90 to-neutral-900/95 border border-indigo-950/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 mb-5 shadow-xl transition-all">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left Side: Status & Device Info */}
        <div className="flex items-center gap-3">
          {/* Animated Icon Ring */}
          <div className="relative shrink-0">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                isScanning
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : currentDevice?.isOnline
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
              }`}
            >
              {isScanning ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : currentDevice?.isOnline ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Wifi className="w-5 h-5" />
              )}
            </div>

            {/* Pulsing indicator */}
            {currentDevice?.isOnline && !isScanning && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-white">
                {isScanning
                  ? 'Buscando TV Philco no Wi-Fi...'
                  : currentDevice?.isOnline
                  ? 'TV Philco Conectada Automaticamente'
                  : 'Nenhuma TV conectada'}
              </span>

              {currentDevice?.isOnline && !isScanning && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 font-semibold">
                  IP: {currentDevice.ip}
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-400 mt-0.5">
              {isScanning ? (
                scanProgressText || 'Escaneando sub-redes 192.168.1.x, 192.168.0.x e 192.168.15.x...'
              ) : currentDevice?.isOnline ? (
                <span className="flex items-center gap-3">
                  <span>{currentDevice.model}</span>
                  <span>·</span>
                  <span className="text-emerald-400">Sinal Wi-Fi {currentDevice.signalStrength}%</span>
                  <span>·</span>
                  <span className="font-mono text-neutral-500">{currentDevice.latencyMs}ms</span>
                </span>
              ) : (
                'Ative a busca automática para localizar sua TV no Wi-Fi'
              )}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          {/* Test Signal Button */}
          {currentDevice?.isOnline && !isScanning && (
            <button
              onClick={handleTest}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                testSent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{testSent ? 'Sinal Enviado!' : 'Testar Comunicação'}</span>
            </button>
          )}

          {/* Rescan Button */}
          <button
            onClick={() => {
              playButtonClickSound();
              triggerHaptic(20);
              onScanAgain();
            }}
            disabled={isScanning}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isScanning ? 'Buscando...' : 'Reescanear'}</span>
          </button>

          {/* Manual IP Adjustment Link */}
          <button
            onClick={onOpenManualConfig}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 cursor-pointer transition-colors"
          >
            Ajustar IP
          </button>
        </div>
      </div>
    </div>
  );
};
