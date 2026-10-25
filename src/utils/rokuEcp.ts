// Roku External Control Protocol (ECP) Integration for Philco Roku TVs

export interface NetworkConfig {
  ipAddress: string;
  port: number;
  enabled: boolean;
  modelDetected: string;
}

const DEFAULT_CONFIG: NetworkConfig = {
  ipAddress: '',
  port: 8060,
  enabled: false,
  modelDetected: 'Philco Roku TV Smart',
};

const STORAGE_KEY = 'philco_remote_network_config';

export function getStoredNetworkConfig(): NetworkConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_CONFIG;
}

export function saveNetworkConfig(cfg: NetworkConfig) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    // fallback
  }
}

// Maps generic remote action to Roku ECP key
export const ROKU_KEY_MAP: Record<string, string> = {
  power: 'Power',
  home: 'Home',
  back: 'Back',
  up: 'Up',
  down: 'Down',
  left: 'Left',
  right: 'Right',
  ok: 'Select',
  replay: 'InstantReplay',
  options: 'Info',
  play_pause: 'Play',
  rewind: 'Rev',
  fast_forward: 'Fwd',
  volume_up: 'VolumeUp',
  volume_down: 'VolumeDown',
  mute: 'VolumeMute',
};

// Known Roku App IDs in Brazil
export const ROKU_APP_IDS: Record<string, string> = {
  netflix: '12',
  youtube: '837',
  globoplay: '61322',
  prime: '13',
  disney: '291097',
  spotify: '22271',
  apple: '551012',
};

/**
 * Sends a command to a real Philco Roku TV over local network using no-cors mode
 */
export async function sendRokuEcpCommand(
  keyOrAction: string,
  config = getStoredNetworkConfig()
): Promise<{ success: boolean; message: string }> {
  if (!config.enabled || !config.ipAddress) {
    return { success: false, message: 'Wi-Fi desativado ou IP não configurado' };
  }

  const cleanIp = config.ipAddress.trim();
  const rokuKey = ROKU_KEY_MAP[keyOrAction] || keyOrAction;
  const url = `http://${cleanIp}:${config.port}/keypress/${rokuKey}`;

  try {
    // mode: 'no-cors' allows sending simple POST payload across local subnet without CORS block
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-store',
    });
    return { success: true, message: `Comando ${rokuKey} enviado para ${cleanIp}` };
  } catch (err) {
    return {
      success: false,
      message: `Erro ao enviar comando para ${cleanIp}: ${(err as Error).message}`,
    };
  }
}

/**
 * Launch an app on Philco Roku TV
 */
export async function launchRokuApp(
  appIdKey: string,
  config = getStoredNetworkConfig()
): Promise<{ success: boolean; message: string }> {
  if (!config.enabled || !config.ipAddress) {
    return { success: false, message: 'Wi-Fi não configurado' };
  }

  const cleanIp = config.ipAddress.trim();
  const numericId = ROKU_APP_IDS[appIdKey];
  if (!numericId) {
    return { success: false, message: 'App não encontrado no catálogo Roku' };
  }

  const url = `http://${cleanIp}:${config.port}/launch/${numericId}`;

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-store',
    });
    return { success: true, message: `App aberto na TV (${appIdKey})` };
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
}

/**
 * Send typed search string to Philco Roku TV
 */
export async function sendRokuText(
  text: string,
  config = getStoredNetworkConfig()
): Promise<void> {
  if (!config.enabled || !config.ipAddress) return;
  const cleanIp = config.ipAddress.trim();

  // Roku supports Lit_<character>
  for (const char of text) {
    try {
      const encodedChar = encodeURIComponent(char);
      const url = `http://${cleanIp}:${config.port}/keypress/Lit_${encodedChar}`;
      await fetch(url, { method: 'POST', mode: 'no-cors' });
      await new Promise((r) => setTimeout(r, 60));
    } catch {
      // Continue next char
    }
  }
}
