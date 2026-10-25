import React, { useState, useEffect, useCallback, useTransition } from 'react';
import {
  RemoteModel,
  TvState,
  TvSource,
  StreamingAppId,
} from './types';
import { BRAZILIAN_CHANNELS, STREAMING_APPS } from './data/tvData';
import {
  playButtonClickSound,
  playIrBeepSound,
  playPowerOnChime,
  playPowerOffSound,
  playVolumeTickSound,
  triggerHaptic,
  isSoundEnabled,
  setSoundEnabled,
  isHapticsEnabled,
  setHapticsEnabled,
} from './utils/audio';
import {
  getStoredNetworkConfig,
  sendRokuEcpCommand,
  launchRokuApp,
  sendRokuText,
  NetworkConfig,
} from './utils/rokuEcp';
import { TopBar } from './components/TopBar';
import { PhilcoTvScreen } from './components/PhilcoTvScreen';
import { PhilcoRokuRemote } from './components/PhilcoRokuRemote';
import { PhilcoAndroidRemote } from './components/PhilcoAndroidRemote';
import { PhilcoClassicRemote } from './components/PhilcoClassicRemote';
import { TouchpadTab } from './components/TouchpadTab';
import { KeyboardModal } from './components/KeyboardModal';
import { ChannelsDrawer } from './components/ChannelsDrawer';
import { NetworkConnectModal } from './components/NetworkConnectModal';
import { IrCodesModal } from './components/IrCodesModal';
import { AutoConnectBanner } from './components/AutoConnectBanner';
import {
  scanLocalNetwork,
  DiscoveredTvDevice,
  getAutoConnectedDevice,
  saveAutoConnectedDevice,
} from './utils/autoDiscovery';
import {
  Tv,
  Wifi,
  Keyboard,
  Radio,
  Volume2,
  VolumeX,
  Vibrate,
  Sliders,
  Sparkles,
  MousePointer,
  Info,
  Clock,
  Layers,
  Check,
} from 'lucide-react';

export default function App() {
  const [, startTransition] = useTransition();

  // Selected remote physical model
  const [remoteModel, setRemoteModel] = useState<RemoteModel>('roku');
  const [activeTabMobile, setActiveTabMobile] = useState<'remote' | 'tv' | 'touchpad'>('remote');

  // Audio / Haptic settings
  const [soundOn, setSoundOn] = useState(true);
  const [hapticOn, setHapticOn] = useState(true);

  // Network Wi-Fi config
  const [networkConfig, setNetworkConfig] = useState<NetworkConfig>(getStoredNetworkConfig());

  // Modals
  const [activeModal, setActiveModal] = useState<'wifi' | 'channels' | 'keyboard' | 'ircodes' | null>(null);

  // TV State
  const [tvState, setTvState] = useState<TvState>({
    power: true,
    volume: 24,
    isMuted: false,
    source: 'tv',
    activeApp: null,
    channelIndex: 0,
    currentScreen: 'tv',
    selectedNavIndex: 0,
    sleepTimerMinutes: null,
    isLedTransmitting: false,
    lastCommand: null,
    osType: 'roku',
    searchQuery: '',
  });

  // Auto-Discovery Wi-Fi state
  const [discoveredDevice, setDiscoveredDevice] = useState<DiscoveredTvDevice | null>(() => {
    return getAutoConnectedDevice();
  });
  const [isAutoScanning, setIsAutoScanning] = useState(false);
  const [scanProgressText, setScanProgressText] = useState('');

  // Automated TV Discovery function
  const triggerAutoScan = useCallback(async () => {
    setIsAutoScanning(true);
    setScanProgressText('Identificando sub-rede Wi-Fi local...');

    try {
      const devices = await scanLocalNetwork((count, currentIp) => {
        setScanProgressText(`Verificando IP ${currentIp} (tentativa ${count})...`);
      });

      if (devices.length > 0) {
        const primaryTv = devices[0];
        setDiscoveredDevice(primaryTv);
        saveAutoConnectedDevice(primaryTv);

        const updatedNetConfig: NetworkConfig = {
          ipAddress: primaryTv.ip,
          port: primaryTv.port,
          enabled: true,
          modelDetected: primaryTv.name,
        };
        setNetworkConfig(updatedNetConfig);

        setScanProgressText(`Conectado com sucesso em ${primaryTv.ip}!`);
      }
    } catch {
      setScanProgressText('Finalizada verificação da rede local');
    } finally {
      setIsAutoScanning(false);
    }
  }, []);

  // Run Auto-Connect automatically when the app loads
  useEffect(() => {
    // If we already have a saved auto-connected device, verify/connect immediately
    const cached = getAutoConnectedDevice();
    if (cached && cached.ip) {
      setDiscoveredDevice(cached);
      setNetworkConfig((prev) => ({
        ...prev,
        ipAddress: cached.ip,
        port: cached.port,
        enabled: true,
        modelDetected: cached.name,
      }));
    } else {
      // First run: automatically scan local network and connect!
      triggerAutoScan();
    }
  }, [triggerAutoScan]);

  // Sync audio/haptic toggles
  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    triggerHaptic(20);
  };

  const handleToggleHaptic = () => {
    const next = !hapticOn;
    setHapticOn(next);
    setHapticsEnabled(next);
    triggerHaptic(20);
  };

  // Pulse IR LED transmitter
  const triggerIrFlash = useCallback((commandName: string) => {
    setTvState((prev) => ({
      ...prev,
      isLedTransmitting: true,
      lastCommand: commandName,
    }));
    playIrBeepSound();
    triggerHaptic(25);

    setTimeout(() => {
      setTvState((prev) => ({ ...prev, isLedTransmitting: false }));
    }, 280);
  }, []);

  // Main Action Dispatcher for all remote buttons
  const handleRemoteAction = useCallback((action: string) => {
    playButtonClickSound();

    // Send to physical TV if Wi-Fi ECP enabled
    if (networkConfig.enabled && networkConfig.ipAddress) {
      sendRokuEcpCommand(action, networkConfig);
    }

    setTvState((prev) => {
      // If TV is off, only power can turn it on
      if (!prev.power && action !== 'power') {
        return prev;
      }

      switch (action) {
        case 'power': {
          const nextPower = !prev.power;
          triggerIrFlash(nextPower ? 'POWER ON' : 'POWER OFF');
          if (nextPower) {
            playPowerOnChime();
          } else {
            playPowerOffSound();
          }
          return {
            ...prev,
            power: nextPower,
            currentScreen: nextPower ? 'tv' : 'tv',
          };
        }

        case 'volume_up': {
          triggerIrFlash('VOL +');
          const nextVol = Math.min(prev.volume + 2, 100);
          playVolumeTickSound(nextVol);
          return {
            ...prev,
            volume: nextVol,
            isMuted: false,
          };
        }

        case 'volume_down': {
          triggerIrFlash('VOL -');
          const nextVol = Math.max(prev.volume - 2, 0);
          playVolumeTickSound(nextVol);
          return {
            ...prev,
            volume: nextVol,
            isMuted: false,
          };
        }

        case 'mute': {
          triggerIrFlash('MUTE');
          return {
            ...prev,
            isMuted: !prev.isMuted,
          };
        }

        case 'channel_up': {
          triggerIrFlash('CH +');
          const nextIdx = (prev.channelIndex + 1) % BRAZILIAN_CHANNELS.length;
          return {
            ...prev,
            channelIndex: nextIdx,
            currentScreen: 'tv',
            activeApp: null,
          };
        }

        case 'channel_down': {
          triggerIrFlash('CH -');
          const nextIdx = (prev.channelIndex - 1 + BRAZILIAN_CHANNELS.length) % BRAZILIAN_CHANNELS.length;
          return {
            ...prev,
            channelIndex: nextIdx,
            currentScreen: 'tv',
            activeApp: null,
          };
        }

        case 'home': {
          triggerIrFlash('HOME');
          return {
            ...prev,
            currentScreen: 'home',
            activeApp: null,
          };
        }

        case 'back': {
          triggerIrFlash('VOLTAR');
          if (prev.currentScreen !== 'tv') {
            return {
              ...prev,
              currentScreen: 'tv',
              activeApp: null,
            };
          }
          return prev;
        }

        case 'up': {
          triggerIrFlash('CIMA');
          if (prev.currentScreen === 'home') {
            const nextIdx = Math.max(prev.selectedNavIndex - 4, 0);
            return { ...prev, selectedNavIndex: nextIdx };
          }
          return prev;
        }

        case 'down': {
          triggerIrFlash('BAIXO');
          if (prev.currentScreen === 'home') {
            const nextIdx = Math.min(prev.selectedNavIndex + 4, 7);
            return { ...prev, selectedNavIndex: nextIdx };
          }
          return prev;
        }

        case 'left': {
          triggerIrFlash('ESQUERDA');
          if (prev.currentScreen === 'home') {
            const nextIdx = Math.max(prev.selectedNavIndex - 1, 0);
            return { ...prev, selectedNavIndex: nextIdx };
          }
          return prev;
        }

        case 'right': {
          triggerIrFlash('DIREITA');
          if (prev.currentScreen === 'home') {
            const nextIdx = Math.min(prev.selectedNavIndex + 1, 7);
            return { ...prev, selectedNavIndex: nextIdx };
          }
          return prev;
        }

        case 'ok': {
          triggerIrFlash('OK');
          if (prev.currentScreen === 'home') {
            const appList: StreamingAppId[] = ['netflix', 'globoplay', 'youtube', 'prime'];
            if (prev.selectedNavIndex < appList.length) {
              return {
                ...prev,
                currentScreen: 'app',
                activeApp: appList[prev.selectedNavIndex],
              };
            } else if (prev.selectedNavIndex === 4) {
              return { ...prev, currentScreen: 'tv', source: 'tv' };
            } else if (prev.selectedNavIndex === 5) {
              return { ...prev, currentScreen: 'tv', source: 'hdmi1' };
            } else if (prev.selectedNavIndex === 6) {
              return { ...prev, currentScreen: 'tv', source: 'hdmi2' };
            } else {
              return { ...prev, currentScreen: 'app', activeApp: 'disney' };
            }
          }
          return prev;
        }

        case 'replay': {
          triggerIrFlash('REPLAY 10s');
          return prev;
        }

        case 'options':
        case 'settings':
        case 'menu': {
          triggerIrFlash('CONFIGURAÇÕES');
          return {
            ...prev,
            currentScreen: prev.currentScreen === 'settings' ? 'tv' : 'settings',
          };
        }

        case 'inputs': {
          triggerIrFlash('ENTRADAS');
          return {
            ...prev,
            currentScreen: prev.currentScreen === 'inputs' ? 'tv' : 'inputs',
          };
        }

        case 'guide': {
          triggerIrFlash('GUIA DE CANAIS');
          setActiveModal('channels');
          return prev;
        }

        case 'livetv': {
          triggerIrFlash('TV ABERTA');
          return {
            ...prev,
            currentScreen: 'tv',
            source: 'tv',
            activeApp: null,
          };
        }

        case 'sleep': {
          triggerIrFlash('SLEEP TIMER');
          const current = prev.sleepTimerMinutes;
          const next = current === null ? 30 : current === 30 ? 60 : current === 60 ? 90 : null;
          return { ...prev, sleepTimerMinutes: next };
        }

        case 'assistant': {
          triggerIrFlash('ASSISTENTE');
          setActiveModal('keyboard');
          return prev;
        }

        default:
          triggerIrFlash(action.toUpperCase());
          return prev;
      }
    });
  }, [networkConfig, triggerIrFlash]);

  // App Shortcut Dispatcher
  const handleAppShortcut = (app: StreamingAppId) => {
    playButtonClickSound();
    triggerIrFlash(`APP ${app.toUpperCase()}`);

    if (networkConfig.enabled && networkConfig.ipAddress) {
      launchRokuApp(app, networkConfig);
    }

    setTvState((prev) => ({
      ...prev,
      power: true,
      currentScreen: 'app',
      activeApp: app,
    }));
  };

  // Direct channel tune
  const handleSelectChannel = (idx: number) => {
    triggerIrFlash(`CANAL ${BRAZILIAN_CHANNELS[idx].number}`);
    setTvState((prev) => ({
      ...prev,
      power: true,
      currentScreen: 'tv',
      source: 'tv',
      activeApp: null,
      channelIndex: idx,
    }));
  };

  // Set Source
  const handleSetSource = (source: TvSource) => {
    triggerIrFlash(`ENTRADA ${source.toUpperCase()}`);
    setTvState((prev) => ({
      ...prev,
      power: true,
      currentScreen: 'tv',
      source,
      activeApp: null,
    }));
  };

  // Numeric input (0-9, ., ⌫)
  const handleNumericInput = (val: string) => {
    playButtonClickSound();
    triggerIrFlash(`NUM ${val}`);

    if (val === '⌫') return;

    // Search or tune to matching channel
    const matchingIdx = BRAZILIAN_CHANNELS.findIndex((ch) => ch.number.startsWith(val));
    if (matchingIdx !== -1) {
      setTvState((prev) => ({
        ...prev,
        power: true,
        currentScreen: 'tv',
        channelIndex: matchingIdx,
      }));
    }
  };

  // Text input from virtual keyboard
  const handleSendText = (text: string) => {
    triggerIrFlash(`DIGITOU: ${text}`);
    if (networkConfig.enabled && networkConfig.ipAddress) {
      sendRokuText(text, networkConfig);
    }
    setTvState((prev) => ({
      ...prev,
      searchQuery: text,
    }));
    setTimeout(() => {
      setTvState((prev) => ({ ...prev, searchQuery: '' }));
    }, 4000);
  };

  // Physical Keyboard listener for easy testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModal !== null) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handleRemoteAction('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleRemoteAction('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleRemoteAction('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleRemoteAction('right');
          break;
        case 'Enter':
          e.preventDefault();
          handleRemoteAction('ok');
          break;
        case 'Escape':
        case 'Backspace':
          e.preventDefault();
          handleRemoteAction('back');
          break;
        case 'Home':
          e.preventDefault();
          handleRemoteAction('home');
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleRemoteAction('volume_up');
          break;
        case '-':
          e.preventDefault();
          handleRemoteAction('volume_down');
          break;
        case 'm':
        case 'M':
          handleRemoteAction('mute');
          break;
        case 'p':
        case 'P':
          handleRemoteAction('power');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, handleRemoteAction]);

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Bar following contract */}
      <TopBar
        onOpenModal={(modal) => setActiveModal(modal)}
        powerOn={tvState.power}
        onTogglePower={() => handleRemoteAction('power')}
        connectedIp={discoveredDevice?.ip || (networkConfig.enabled ? networkConfig.ipAddress : undefined)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-start">
        
        {/* Automatic Wi-Fi TV Auto-Connect Status Banner */}
        <AutoConnectBanner
          currentDevice={discoveredDevice}
          isScanning={isAutoScanning}
          scanProgressText={scanProgressText}
          onScanAgain={triggerAutoScan}
          onOpenManualConfig={() => setActiveModal('wifi')}
          onSendTestPing={() => {
            if (networkConfig.ipAddress) {
              sendRokuEcpCommand('home', networkConfig);
              triggerIrFlash('TESTE WI-FI');
            }
          }}
        />

        {/* Top Control Bar: Remote Models, Audio/Haptics & Mobile View Tabs */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-800">
          
          {/* Model Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => {
                startTransition(() => {
                  setRemoteModel('roku');
                  setActiveTabMobile('remote');
                });
                triggerHaptic(20);
              }}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                remoteModel === 'roku'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Philco Roku TV
            </button>
            <button
              onClick={() => {
                startTransition(() => {
                  setRemoteModel('android');
                  setActiveTabMobile('remote');
                });
                triggerHaptic(20);
              }}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                remoteModel === 'android'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Philco Android TV
            </button>
            <button
              onClick={() => {
                startTransition(() => {
                  setRemoteModel('classic');
                  setActiveTabMobile('remote');
                });
                triggerHaptic(20);
              }}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                remoteModel === 'classic'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Philco Clássico
            </button>
          </div>

          {/* Quick Tools & Toggles */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            {/* Wi-Fi Status Marker */}
            <button
              onClick={() => setActiveModal('wifi')}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors ${
                networkConfig.enabled && networkConfig.ipAddress
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>
                {networkConfig.enabled && networkConfig.ipAddress
                  ? `Wi-Fi: ${networkConfig.ipAddress}`
                  : 'Configurar Wi-Fi'}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundOn ? 'Desativar som do controle' : 'Ativar som'}
              className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                soundOn
                  ? 'bg-neutral-800 border-neutral-700 text-indigo-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500'
              }`}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Haptic Toggle */}
            <button
              onClick={handleToggleHaptic}
              title={hapticOn ? 'Vibração ativada' : 'Vibração desligada'}
              className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                hapticOn
                  ? 'bg-neutral-800 border-neutral-700 text-emerald-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500'
              }`}
            >
              <Vibrate className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile View Toggle Bar (Only visible on small screens) */}
        <div className="flex lg:hidden items-center justify-center p-1 bg-neutral-900/80 rounded-2xl border border-neutral-800 mb-5">
          <button
            onClick={() => setActiveTabMobile('remote')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTabMobile === 'remote'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-neutral-400'
            }`}
          >
            Controle Remoto
          </button>
          <button
            onClick={() => setActiveTabMobile('tv')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTabMobile === 'tv'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-neutral-400'
            }`}
          >
            Simulador de TV
          </button>
          <button
            onClick={() => setActiveTabMobile('touchpad')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTabMobile === 'touchpad'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-neutral-400'
            }`}
          >
            Touchpad Mouse
          </button>
        </div>

        {/* 2-Column Responsive Split: Left TV Screen & Tools | Right Remote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (TV Simulator, Channels & Quick Actions) */}
          <div
            className={`lg:col-span-7 flex flex-col gap-6 ${
              activeTabMobile === 'remote' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* The Philco TV Screen */}
            <PhilcoTvScreen
              tvState={tvState}
              remoteModel={remoteModel}
              onSelectApp={handleAppShortcut}
              onSetSource={handleSetSource}
            />

            {/* Quick Action Hub Below TV */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveModal('channels')}
                className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/80 transition-all flex flex-col items-start gap-1 cursor-pointer group shadow"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Radio className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white mt-1">Canais TV Aberta</span>
                <span className="text-[11px] text-neutral-400">Globo, SBT, Record...</span>
              </button>

              <button
                onClick={() => setActiveModal('keyboard')}
                className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/80 transition-all flex flex-col items-start gap-1 cursor-pointer group shadow"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Keyboard className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white mt-1">Teclado de Busca</span>
                <span className="text-[11px] text-neutral-400">Digitar na TV</span>
              </button>

              <button
                onClick={() => setActiveModal('wifi')}
                className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/80 transition-all flex flex-col items-start gap-1 cursor-pointer group shadow"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Wifi className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white mt-1">Parear TV Real</span>
                <span className="text-[11px] text-neutral-400">Roku ECP / Wi-Fi</span>
              </button>

              <button
                onClick={() => setActiveModal('ircodes')}
                className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/80 transition-all flex flex-col items-start gap-1 cursor-pointer group shadow"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white mt-1">Códigos IR NEC</span>
                <span className="text-[11px] text-neutral-400">Automação Hex</span>
              </button>
            </div>

            {/* Quick Streaming Direct Launches */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-white">
                  Streaming Direto para Philco Smart
                </span>
                <span className="text-[11px] text-neutral-400">Toque para abrir</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {(['netflix', 'globoplay', 'prime', 'youtube', 'disney', 'spotify', 'max', 'apple'] as StreamingAppId[]).map(
                  (appKey) => {
                    const info = STREAMING_APPS[appKey];
                    return (
                      <button
                        key={appKey}
                        onClick={() => handleAppShortcut(appKey)}
                        className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
                          style={{ backgroundColor: info.accentColor }}
                        >
                          {info.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[10px] font-medium text-neutral-300 truncate max-w-full">
                          {info.name}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Brazilian Channels Quick Tune Bar */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-white">
                  Canais Favoritos do Brasil
                </span>
                <button
                  onClick={() => setActiveModal('channels')}
                  className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
                >
                  Ver Guia Completo EPG
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BRAZILIAN_CHANNELS.slice(0, 4).map((ch, idx) => (
                  <button
                    key={ch.number}
                    onClick={() => handleSelectChannel(idx)}
                    className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 flex items-center gap-2.5 text-left transition-all cursor-pointer"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                      style={{ backgroundColor: ch.color }}
                    >
                      {ch.logoText}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate">{ch.name}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{ch.number}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Physical Remote Control or Touchpad) */}
          <div
            className={`lg:col-span-5 flex flex-col items-center justify-center ${
              activeTabMobile === 'tv' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {activeTabMobile === 'touchpad' ? (
              <TouchpadTab
                onDirectionAction={(dir) => handleRemoteAction(dir)}
                onSelectAction={() => handleRemoteAction('ok')}
                onBackAction={() => handleRemoteAction('back')}
              />
            ) : (
              <div className="w-full flex flex-col items-center">
                {/* Visual model label */}
                <div className="text-center mb-3">
                  <span className="text-xs font-semibold text-neutral-400">
                    Controle Virtual:{' '}
                    <span className="text-indigo-400">
                      {remoteModel === 'roku'
                        ? 'Philco Roku TV'
                        : remoteModel === 'android'
                        ? 'Philco Android / Google TV'
                        : 'Philco Smart Clássico'}
                    </span>
                  </span>
                </div>

                {/* Selected Physical Remote Control Component */}
                {remoteModel === 'roku' && (
                  <PhilcoRokuRemote
                    onAction={handleRemoteAction}
                    onAppShortcut={handleAppShortcut}
                    isTransmitting={tvState.isLedTransmitting}
                    powerOn={tvState.power}
                  />
                )}

                {remoteModel === 'android' && (
                  <PhilcoAndroidRemote
                    onAction={handleRemoteAction}
                    onAppShortcut={handleAppShortcut}
                    onNumericInput={handleNumericInput}
                    isTransmitting={tvState.isLedTransmitting}
                    powerOn={tvState.power}
                  />
                )}

                {remoteModel === 'classic' && (
                  <PhilcoClassicRemote
                    onAction={handleRemoteAction}
                    onAppShortcut={handleAppShortcut}
                    onNumericInput={handleNumericInput}
                    isTransmitting={tvState.isLedTransmitting}
                    powerOn={tvState.power}
                  />
                )}

                {/* Keyboard Shortcuts Hint */}
                <div className="mt-4 text-center text-[11px] text-neutral-500 hidden sm:block">
                  <span>Atalhos de teclado: Setas direcionais · Enter para OK · P para Power · +/- Volume</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <NetworkConnectModal
        isOpen={activeModal === 'wifi'}
        onClose={() => setActiveModal(null)}
        onConfigUpdated={(cfg) => setNetworkConfig(cfg)}
        onAutoDeviceSelected={(dev) => {
          setDiscoveredDevice(dev);
          saveAutoConnectedDevice(dev);
        }}
      />

      <ChannelsDrawer
        isOpen={activeModal === 'channels'}
        onClose={() => setActiveModal(null)}
        currentChannelIndex={tvState.channelIndex}
        onSelectChannel={handleSelectChannel}
      />

      <KeyboardModal
        isOpen={activeModal === 'keyboard'}
        onClose={() => setActiveModal(null)}
        onSendText={handleSendText}
      />

      <IrCodesModal
        isOpen={activeModal === 'ircodes'}
        onClose={() => setActiveModal(null)}
      />

      {/* Quiet, clean footer */}
      <footer className="w-full border-t border-neutral-900 py-4 px-6 text-center text-xs text-neutral-500 mt-8">
        <span>Controle Remoto Virtual para TV Philco · Compatível com modelos Roku TV, Android TV e Smart Clássico</span>
      </footer>
    </div>
  );
}
