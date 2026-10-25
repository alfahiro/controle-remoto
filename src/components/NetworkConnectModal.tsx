import React, { useState, useEffect } from 'react';
import {
  Wifi,
  X,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Zap,
  Radio,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  getStoredNetworkConfig,
  saveNetworkConfig,
  sendRokuEcpCommand,
  NetworkConfig,
} from '../utils/rokuEcp';
import {
  scanLocalNetwork,
  DiscoveredTvDevice,
  COMMON_SUBNETS,
} from '../utils/autoDiscovery';
import { triggerHaptic, playButtonClickSound } from '../utils/audio';

interface NetworkConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: (config: NetworkConfig) => void;
  onAutoDeviceSelected?: (device: DiscoveredTvDevice) => void;
}

export const NetworkConnectModal: React.FC<NetworkConnectModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
  onAutoDeviceSelected,
}) => {
  const [config, setConfig] = useState<NetworkConfig>(getStoredNetworkConfig());
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [activeGuideTab, setActiveGuideTab] = useState<'roku' | 'android'>('roku');
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState<DiscoveredTvDevice[]>([]);

  useEffect(() => {
    if (isOpen) {
      setConfig(getStoredNetworkConfig());
      setTestStatus('idle');
      setStatusMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAutoScan = async () => {
    setIsScanning(true);
    setTestStatus('testing');
    setStatusMessage('Buscando TVs Philco automaticamente na sua rede local...');
    try {
      const devices = await scanLocalNetwork();
      setFoundDevices(devices);
      if (devices.length > 0) {
        const best = devices[0];
        const updatedConfig: NetworkConfig = {
          ...config,
          ipAddress: best.ip,
          port: best.port,
          enabled: true,
          modelDetected: best.name,
        };
        setConfig(updatedConfig);
        saveNetworkConfig(updatedConfig);
        onConfigUpdated(updatedConfig);
        onAutoDeviceSelected?.(best);
        setTestStatus('success');
        setStatusMessage(`Conectado automaticamente à ${best.name} (${best.ip})!`);
      } else {
        setTestStatus('error');
        setStatusMessage('Nenhuma TV Philco respondeu no escaneamento.');
      }
    } catch {
      setTestStatus('error');
      setStatusMessage('Erro durante o escaneamento da rede.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectDevice = (dev: DiscoveredTvDevice) => {
    const updatedConfig: NetworkConfig = {
      ...config,
      ipAddress: dev.ip,
      port: dev.port,
      enabled: true,
      modelDetected: dev.name,
    };
    setConfig(updatedConfig);
    saveNetworkConfig(updatedConfig);
    onConfigUpdated(updatedConfig);
    onAutoDeviceSelected?.(dev);
    triggerHaptic(20);
    playButtonClickSound();
    setTestStatus('success');
    setStatusMessage(`TV Philco selecionada: ${dev.ip}`);
  };

  const handleSave = () => {
    saveNetworkConfig(config);
    onConfigUpdated(config);
    playButtonClickSound();
    triggerHaptic(25);
    onClose();
  };

  const handleTestPing = async () => {
    if (!config.ipAddress.trim()) {
      setTestStatus('error');
      setStatusMessage('Digite o endereço IP da TV Philco');
      return;
    }

    setTestStatus('testing');
    setStatusMessage('Enviando sinal de teste para a TV...');

    try {
      const res = await sendRokuEcpCommand('home', { ...config, enabled: true });
      setTestStatus('success');
      setStatusMessage(
        res.success
          ? 'Comando enviado! Se a TV estiver no mesmo Wi-Fi, a tela inicial foi acionada.'
          : res.message
      );
    } catch {
      setTestStatus('error');
      setStatusMessage('Não foi possível alcançar a TV. Verifique se estão no mesmo Wi-Fi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg max-h-[90vh] bg-neutral-900 border border-neutral-700 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Conexão Wi-Fi com a TV Philco</h3>
              <p className="text-xs text-neutral-400">Detecção automática e configuração de IP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-4">
          
          {/* Automated Discovery Primary Button */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-blue-950/70 border border-indigo-500/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Busca Automática no Wi-Fi
              </span>
              <span className="text-[11px] text-indigo-300 font-mono">1-Clique</span>
            </div>
            <p className="text-xs text-neutral-300 mb-3">
              Detecta a sub-rede do seu roteador e descobre o endereço IP da TV Philco sem precisar digitar nada.
            </p>
            <button
              type="button"
              onClick={handleAutoScan}
              disabled={isScanning}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 cursor-pointer transition-all active:scale-[0.98]"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Escaneando rede Wi-Fi...' : 'Escanear e Conectar Automaticamente'}</span>
            </button>
          </div>

          {/* Found Devices List if scanned */}
          {foundDevices.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-300">
                Dispositivos Philco Detectados:
              </span>
              {foundDevices.map((dev) => (
                <div
                  key={dev.ip}
                  onClick={() => handleSelectDevice(dev)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    config.ipAddress === dev.ip
                      ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-md'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{dev.name}</span>
                      {config.ipAddress === dev.ip && (
                        <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded">
                          Ativo
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      IP: {dev.ip} · {dev.latencyMs}ms · Sinal {dev.signalStrength}%
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 text-xs font-medium text-neutral-200"
                  >
                    {config.ipAddress === dev.ip ? 'Conectado' : 'Selecionar'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Enable Toggle Switch */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-white block">
                Envio de Comandos via Wi-Fi
              </span>
              <span className="text-xs text-neutral-400">
                Dispara comandos para o IP da TV ao apertar qualquer botão
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-neutral-300">
                  Endereço IP da TV (IPv4)
                </label>
                <span className="text-[11px] text-neutral-400">Atalhos rápidos:</span>
              </div>

              {/* Subnet Quick Fill Buttons */}
              <div className="flex gap-1.5 mb-2 flex-wrap">
                {COMMON_SUBNETS.slice(0, 3).map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setConfig({ ...config, ipAddress: `${sub}.105` })}
                    className="px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-mono cursor-pointer"
                  >
                    {sub}.105
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: 192.168.1.105 ou 192.168.0.25"
                  value={config.ipAddress}
                  onChange={(e) => setConfig({ ...config, ipAddress: e.target.value })}
                  className="flex-1 h-11 px-3.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleTestPing}
                  className="px-4 h-11 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  Testar Sinal
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Porta ECP / API
              </label>
              <input
                type="number"
                value={config.port}
                onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value, 10) || 8060 })}
                className="w-full h-11 px-3.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Porta padrão 8060 para Philco Roku TV (protocolo ECP).
              </p>
            </div>
          </div>

          {/* Test Status feedback */}
          {testStatus !== 'idle' && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testStatus === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : testStatus === 'error'
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300'
              }`}
            >
              {testStatus === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
              {testStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* How to find the TV IP Guide */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>Como descobrir o IP na sua TV Philco:</span>
              </div>
              <div className="flex rounded-lg bg-neutral-800 p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveGuideTab('roku')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    activeGuideTab === 'roku' ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Roku TV
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGuideTab('android')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    activeGuideTab === 'android' ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Android TV
                </button>
              </div>
            </div>

            {activeGuideTab === 'roku' ? (
              <ol className="text-xs text-neutral-300 space-y-1.5 list-decimal list-inside">
                <li>No controle da TV, aperte o botão <strong className="text-white">Home</strong></li>
                <li>Vá até <strong className="text-white">Configurações</strong> &gt; <strong className="text-white">Rede</strong></li>
                <li>Selecione <strong className="text-white">Sobre</strong></li>
                <li>Veja o campo <span className="font-mono text-emerald-400 font-bold">Endereço IP</span> (ex: 192.168.1.105)</li>
                <li>Verifique se o celular/PC está conectado ao <strong className="text-white">mesmo Wi-Fi</strong></li>
              </ol>
            ) : (
              <ol className="text-xs text-neutral-300 space-y-1.5 list-decimal list-inside">
                <li>Abra as <strong className="text-white">Configurações</strong> (ícone de engrenagem)</li>
                <li>Navegue até <strong className="text-white">Rede e Internet</strong> ou <strong className="text-white">Sobre o Dispositivo</strong></li>
                <li>Clique no nome da sua rede Wi-Fi conectada</li>
                <li>Copie o número mostrado em <span className="font-mono text-emerald-400 font-bold">Endereço IP</span></li>
              </ol>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:bg-neutral-800 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 cursor-pointer active:scale-95"
          >
            Salvar Conexão
          </button>
        </div>
      </div>
    </div>
  );
};
