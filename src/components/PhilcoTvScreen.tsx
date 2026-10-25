import React, { useState, useEffect } from 'react';
import {
  TvState,
  RemoteModel,
  StreamingAppId,
} from '../types';
import { BRAZILIAN_CHANNELS, STREAMING_APPS } from '../data/tvData';
import {
  Volume2,
  VolumeX,
  Wifi,
  Tv as TvIcon,
  Film,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Check,
  Search,
} from 'lucide-react';

interface PhilcoTvScreenProps {
  tvState: TvState;
  remoteModel: RemoteModel;
  onSelectApp: (app: StreamingAppId) => void;
  onSetSource: (source: TvState['source']) => void;
  isCompact?: boolean;
}

export const PhilcoTvScreen: React.FC<PhilcoTvScreenProps> = ({
  tvState,
  remoteModel,
  onSelectApp,
  onSetSource,
  isCompact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState('20:45');
  const [volumeVisible, setVolumeVisible] = useState(false);
  const [channelBannerVisible, setChannelBannerVisible] = useState(false);

  // Keep clock updated
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Show volume overlay when volume changes
  useEffect(() => {
    if (tvState.power) {
      setVolumeVisible(true);
      const timer = setTimeout(() => setVolumeVisible(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [tvState.volume, tvState.isMuted]);

  // Show channel banner when channel changes
  useEffect(() => {
    if (tvState.power && tvState.currentScreen === 'tv') {
      setChannelBannerVisible(true);
      const timer = setTimeout(() => setChannelBannerVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [tvState.channelIndex, tvState.currentScreen]);

  const currentChannel = BRAZILIAN_CHANNELS[tvState.channelIndex] || BRAZILIAN_CHANNELS[0];
  const activeAppInfo = tvState.activeApp ? STREAMING_APPS[tvState.activeApp] : null;

  const homeTiles: Array<{
    id: string;
    title: string;
    type: 'app' | 'source' | 'channel' | 'settings';
    action: () => void;
    color: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'netflix',
      title: 'Netflix',
      type: 'app',
      action: () => onSelectApp('netflix'),
      color: '#E50914',
      icon: <Film className="w-6 h-6 text-white" />,
    },
    {
      id: 'globoplay',
      title: 'Globoplay',
      type: 'app',
      action: () => onSelectApp('globoplay'),
      color: '#ff203a',
      icon: <span className="font-bold text-white text-base">globo</span>,
    },
    {
      id: 'youtube',
      title: 'YouTube',
      type: 'app',
      action: () => onSelectApp('youtube'),
      color: '#FF0000',
      icon: <Play className="w-6 h-6 text-white fill-white" />,
    },
    {
      id: 'prime',
      title: 'Prime Video',
      type: 'app',
      action: () => onSelectApp('prime'),
      color: '#00A8E1',
      icon: <span className="font-bold text-white text-sm">prime</span>,
    },
    {
      id: 'tv_live',
      title: 'TV Ao Vivo DTV',
      type: 'source',
      action: () => onSetSource('tv'),
      color: '#10b981',
      icon: <TvIcon className="w-6 h-6 text-white" />,
    },
    {
      id: 'hdmi1',
      title: 'HDMI 1 (Console)',
      type: 'source',
      action: () => onSetSource('hdmi1'),
      color: '#6366f1',
      icon: <span className="font-bold text-white text-xs">HDMI 1</span>,
    },
    {
      id: 'hdmi2',
      title: 'HDMI 2 (TV Box)',
      type: 'source',
      action: () => onSetSource('hdmi2'),
      color: '#8b5cf6',
      icon: <span className="font-bold text-white text-xs">HDMI 2</span>,
    },
    {
      id: 'disney',
      title: 'Disney+',
      type: 'app',
      action: () => onSelectApp('disney'),
      color: '#113CCF',
      icon: <span className="font-bold text-white text-xs">Disney+</span>,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* TV Enclosure */}
      <div className="relative w-full max-w-3xl bg-neutral-900 p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-700/60 transition-all duration-300">
        {/* TV Screen Glass Frame */}
        <div className="relative aspect-video w-full bg-black rounded-lg sm:rounded-xl overflow-hidden shadow-inner border border-neutral-800 flex items-center justify-center">
          
          {/* Signal Indicator Flash */}
          {tvState.isLedTransmitting && (
            <div className="absolute top-3 right-3 z-50 flex items-center gap-1.5 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md border border-neutral-700 text-[11px] text-emerald-400 font-mono animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{tvState.lastCommand || 'IR SIGNAL'}</span>
            </div>
          )}

          {/* SCREEN OFF STATE */}
          {!tvState.power ? (
            <div className="w-full h-full bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden select-none">
              {/* Subtle Screen Reflection Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
              <div className="text-center opacity-30 transition-opacity duration-700">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-[0.3em] text-neutral-400 uppercase font-sans">
                  PHILCO
                </span>
                <p className="text-xs text-neutral-600 mt-1 font-mono">Modo Standby</p>
              </div>
            </div>
          ) : (
            /* SCREEN ON STATE */
            <div className="w-full h-full relative overflow-hidden bg-slate-950 flex flex-col justify-between select-none">
              
              {/* TOP STATUS BAR (Present in all screens except full app video) */}
              <div className="w-full px-4 py-2 flex items-center justify-between text-xs text-slate-300 bg-gradient-to-b from-black/80 to-transparent z-20">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white tracking-wider">
                    {remoteModel === 'roku'
                      ? 'PHILCO | Roku TV'
                      : remoteModel === 'android'
                      ? 'PHILCO | Google TV'
                      : 'PHILCO Smart'}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-[11px] text-slate-400 capitalize">
                    {tvState.source === 'tv'
                      ? 'TV Digital Aberta'
                      : tvState.source.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {tvState.sleepTimerMinutes && (
                    <span className="text-[11px] text-amber-400 font-mono">
                      Sleep: {tvState.sleepTimerMinutes}m
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-[11px] text-slate-300 font-mono">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Wi-Fi 5G</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-200">{currentTime}</span>
                </div>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                
                {/* 1. TV DIGITAL BROADCAST SCREEN */}
                {tvState.currentScreen === 'tv' && (
                  <div
                    className="w-full h-full relative flex items-center justify-center overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${currentChannel.color}22 0%, #050811 100%)`,
                    }}
                  >
                    {/* Simulated live visual wave background */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
                      <div className="w-96 h-96 rounded-full border border-white/20 animate-ping" />
                    </div>

                    <div className="text-center z-10 p-4">
                      <div
                        className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-white font-extrabold text-lg sm:text-xl shadow-lg mb-3"
                        style={{ backgroundColor: currentChannel.color }}
                      >
                        {currentChannel.logoText}
                      </div>
                      <h2 className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                        {currentChannel.name}
                      </h2>
                      <p className="text-sm text-slate-300 font-medium mt-1">
                        {currentChannel.currentShow}
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-400">
                        <span>Canal {currentChannel.number}</span>
                        <span>·</span>
                        <span>1080i HD</span>
                        <span>·</span>
                        <span>Dolby 5.1</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SMART TV HOME DASHBOARD */}
                {tvState.currentScreen === 'home' && (
                  <div className="w-full h-full p-4 sm:p-6 flex flex-col justify-center overflow-hidden">
                    <div className="mb-3">
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        Aplicativos & Entradas
                      </h3>
                      <p className="text-xs text-slate-400">
                        Navegue com os direcionais do controle e pressione OK
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      {homeTiles.map((tile, idx) => {
                        const isFocused = tvState.selectedNavIndex === idx;
                        return (
                          <button
                            key={tile.id}
                            onClick={tile.action}
                            className={`p-2 sm:p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                              isFocused
                                ? 'ring-2 ring-white scale-105 bg-white/20 shadow-xl'
                                : 'bg-neutral-800/80 hover:bg-neutral-700/80'
                            }`}
                          >
                            <div
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-1.5 shadow"
                              style={{ backgroundColor: tile.color }}
                            >
                              {tile.icon}
                            </div>
                            <span className="text-[11px] sm:text-xs font-medium text-white truncate max-w-full">
                              {tile.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. STREAMING APP VIEW */}
                {tvState.currentScreen === 'app' && activeAppInfo && (
                  <div
                    className="w-full h-full p-4 sm:p-6 flex flex-col justify-between"
                    style={{ backgroundColor: activeAppInfo.bgColor }}
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-black text-lg tracking-wider"
                          style={{ color: activeAppInfo.accentColor }}
                        >
                          {activeAppInfo.name.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400">| Smart Hub</span>
                      </div>
                      <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-slate-300">
                        {activeAppInfo.featuredContent.tag}
                      </span>
                    </div>

                    <div className="my-auto max-w-lg">
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        {activeAppInfo.featuredContent.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-4">
                        {activeAppInfo.featuredContent.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold text-black bg-white flex items-center gap-1.5 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-black" /> Pausar
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-black" /> Assistir
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => onSetSource('tv')}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                        >
                          Sair para TV
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-white/10 pt-2">
                      <span>Pressione Home ou Voltar no controle</span>
                      <span>Philco Smart 4K UHD</span>
                    </div>
                  </div>
                )}

                {/* 4. SETTINGS MENU OVERLAY */}
                {tvState.currentScreen === 'settings' && (
                  <div className="w-full h-full bg-slate-900/95 p-4 sm:p-6 flex flex-col justify-center max-w-md mx-auto">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                      <Sliders className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-base font-bold text-white">
                        Configurações da TV Philco
                      </h3>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded bg-slate-800/80">
                        <span className="text-slate-300">Modo de Imagem</span>
                        <span className="font-semibold text-white">Cinema Dinâmico</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-slate-800/80">
                        <span className="text-slate-300">Áudio Surround</span>
                        <span className="text-emerald-400 font-semibold">Ativado</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-slate-800/80">
                        <span className="text-slate-300">Rede Wi-Fi</span>
                        <span className="text-white font-mono">Conectado (5GHz)</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-slate-800/80">
                        <span className="text-slate-300">Sleep Timer</span>
                        <span className="text-amber-400 font-semibold">
                          {tvState.sleepTimerMinutes ? `${tvState.sleepTimerMinutes} min` : 'Desligado'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. INPUT SELECTOR OVERLAY */}
                {tvState.currentScreen === 'inputs' && (
                  <div className="w-full h-full bg-black/90 p-4 sm:p-6 flex flex-col justify-center items-center">
                    <h3 className="text-base font-bold text-white mb-4">
                      Selecionar Entrada de Sinal
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md">
                      {(['tv', 'hdmi1', 'hdmi2', 'av'] as const).map((src) => (
                        <button
                          key={src}
                          onClick={() => onSetSource(src)}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            tvState.source === src
                              ? 'border-indigo-400 bg-indigo-950/70 text-white font-bold'
                              : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <span className="text-xs uppercase">{src}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* VOLUME OVERLAY (HUD) */}
                {volumeVisible && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-neutral-700 shadow-2xl flex items-center gap-3 z-30 min-w-[200px]">
                    {tvState.isMuted || tvState.volume === 0 ? (
                      <VolumeX className="w-5 h-5 text-red-500 shrink-0" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-white mb-1">
                        <span className="font-semibold">Volume</span>
                        <span className="font-mono">{tvState.isMuted ? 'MUDO' : tvState.volume}</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-150 ${
                            tvState.isMuted ? 'bg-red-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${tvState.isMuted ? 0 : tvState.volume}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* CHANNEL BANNER OVERLAY */}
                {channelBannerVisible && tvState.currentScreen === 'tv' && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-md p-3 rounded-xl border border-neutral-700 shadow-2xl z-30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl font-black text-indigo-400">
                        {currentChannel.number}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{currentChannel.name}</h4>
                        <p className="text-xs text-slate-400">{currentChannel.currentShow}</p>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      <div>A seguir: {currentChannel.nextShow}</div>
                      <div className="font-mono text-emerald-400">DTV 1080i HD</div>
                    </div>
                  </div>
                )}

                {/* SEARCH QUERY TOAST */}
                {tvState.searchQuery && (
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-indigo-950/90 border border-indigo-500/50 px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-2 shadow-lg z-40">
                    <Search className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Digitando na TV: "{tvState.searchQuery}"</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* TV Bottom Bezel with Philco Wordmark & Sensor */}
        <div className="relative pt-2 pb-0.5 px-3 flex items-center justify-between text-neutral-400">
          {/* Left spacer */}
          <div className="w-12 text-[10px] tracking-wider text-neutral-600 font-mono">
            4K HDR
          </div>

          {/* Iconic Philco Logo */}
          <div className="text-center">
            <span className="text-xs sm:text-sm font-black tracking-[0.25em] text-neutral-200 select-none">
              PHILCO
            </span>
          </div>

          {/* Right: Infrared Sensor Dome & Power Standby LED */}
          <div className="w-12 flex items-center justify-end gap-1.5">
            {/* Sensor dome */}
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center">
              <div
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                  tvState.isLedTransmitting
                    ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                    : !tvState.power
                    ? 'bg-red-500 shadow-[0_0_6px_#ef4444]'
                    : 'bg-emerald-500 shadow-[0_0_6px_#10b981]'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TV Legs Stand */}
      <div className="w-full max-w-xl flex items-center justify-between px-8 sm:px-12 -mt-1 pointer-events-none">
        <div className="w-5 sm:w-7 h-3 sm:h-4 bg-gradient-to-b from-neutral-700 to-neutral-900 -skew-x-12 rounded-b" />
        <div className="w-5 sm:w-7 h-3 sm:h-4 bg-gradient-to-b from-neutral-700 to-neutral-900 skew-x-12 rounded-b" />
      </div>
    </div>
  );
};
