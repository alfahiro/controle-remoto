export type RemoteModel = 'roku' | 'android' | 'classic';

export type TvSource = 'tv' | 'hdmi1' | 'hdmi2' | 'av' | 'usb';

export type StreamingAppId = 'netflix' | 'globoplay' | 'prime' | 'youtube' | 'disney' | 'spotify' | 'max' | 'apple';

export interface TvChannel {
  number: string;
  name: string;
  logoText: string;
  color: string;
  currentShow: string;
  nextShow: string;
  category: string;
  rating: string;
}

export interface TvState {
  power: boolean;
  volume: number; // 0 - 100
  isMuted: boolean;
  source: TvSource;
  activeApp: StreamingAppId | null;
  channelIndex: number;
  currentScreen: 'home' | 'tv' | 'app' | 'settings' | 'inputs' | 'guide';
  selectedNavIndex: number; // for D-pad navigation on home / settings
  sleepTimerMinutes: number | null; // null or remaining minutes
  isLedTransmitting: boolean;
  lastCommand: string | null;
  osType: 'roku' | 'android' | 'linux';
  searchQuery: string;
}

export interface StreamingAppInfo {
  id: StreamingAppId;
  name: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  subtitle: string;
  featuredContent: {
    title: string;
    description: string;
    tag: string;
  };
}

export interface IrCodeEntry {
  functionName: string;
  necHex: string;
  protocol: string;
  description: string;
}
