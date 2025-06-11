import configData from './config.yaml';

// Define types for audio player configuration
export interface AudioPlayerConfig {
  enabled: boolean;
  position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  theme: string;
  autoplay: boolean;
  volume: number;
  mini: boolean;
  showLrc: boolean;
  fixed: boolean;
  meting?: {
    enabled: boolean;
    server: 'netease' | 'tencent' | 'kugou' | 'xiami' | 'baidu';
    type: 'song' | 'playlist' | 'album' | 'search' | 'artist';
    id: string | number;
    mutex?: boolean;
    listFolded?: boolean;
    listMaxHeight?: string;
    order?: string;
    loop?: string;
    preload?: string;
  };
  audio: Array<{
    name: string;
    artist: string;
    url: string;
    cover: string;
    lrc?: string;
  }>;
}

// Define website metadata configuration
export interface WebsiteConfig {
  title: string;
  titleSeparator?: string;
  favicon?: string;
  description?: string;
}

// Define config interface
export interface Config {
  website?: WebsiteConfig;
  audioPlayer?: AudioPlayerConfig;
  [key: string]: any; // Allow other config properties
}

// The YAML file is directly imported and parsed by the Vite plugin
export const config: Config = configData;

export default config;
