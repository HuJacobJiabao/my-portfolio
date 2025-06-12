import configData from './config.yaml';

// Utility functions for URL processing
function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

function buildUrl(path: string): string {
  if (!path) return '';
  
  // If it's already a complete URL, return as-is
  if (isExternalUrl(path)) {
    return path;
  }
  
  // For local paths, prepend the base URL
  return `${import.meta.env.BASE_URL}${path}`;
}

// Removed buildImagePath - using buildUrl for all paths

// Process configuration to convert all relative URLs to absolute URLs
function processConfig(rawConfig: any): Config {
  const processed = { ...rawConfig };
  
  // Process backgrounds
  if (processed.backgrounds) {
    processed.backgrounds = {
      global: buildUrl(processed.backgrounds.global || 'background/about.jpg'),
      hero: buildUrl(processed.backgrounds.hero || 'background/hero.jpg')
    };
  }
  
  // Process content default header backgrounds
  if (processed.content) {
    if (processed.content.blogs?.defaultHeaderBackground) {
      processed.content.blogs.defaultHeaderBackground = buildUrl(processed.content.blogs.defaultHeaderBackground);
    }
    if (processed.content.projects?.defaultHeaderBackground) {
      processed.content.projects.defaultHeaderBackground = buildUrl(processed.content.projects.defaultHeaderBackground);
    }
    if (processed.content.archive?.defaultHeaderBackground) {
      processed.content.archive.defaultHeaderBackground = buildUrl(processed.content.archive.defaultHeaderBackground);
    }
    if (processed.content.logs?.defaultHeaderBackground) {
      processed.content.logs.defaultHeaderBackground = buildUrl(processed.content.logs.defaultHeaderBackground);
    }
  }
  
  // Process home navigation photos and image sources
  if (processed.home?.navigation) {
    Object.keys(processed.home.navigation).forEach(key => {
      const section = processed.home.navigation[key];
      
      // Process photo in about section
      if (section.photo) {
        section.photo = buildUrl(section.photo);
      }
       // Process items with logo, border, tag, coverImage
      if (section.items) {
        section.items.forEach((item: any) => {
          // Process logo.src
          if (item.logo && item.logo.src) {
            item.logo.src = buildUrl(item.logo.src);
          }
          
          // Handle coverImage for projects
          if (item.coverImage) {
            item.coverImage = buildUrl(item.coverImage);
          }
          
        });
      }
      
      // Process defaultCover for projects
      if (section.defaultCover) {
        section.defaultCover = buildUrl(section.defaultCover);
      }
    });
  }
  
  return processed;
}

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

// Define background configuration
export interface BackgroundConfig {
  global: string;
  hero: string;
}

// Define contact color configuration
export interface ContactConfig {
  textColor?: string;
}

// Define config interface
export interface Config {
  website?: WebsiteConfig;
  backgrounds?: BackgroundConfig;
  audioPlayer?: AudioPlayerConfig;
  [key: string]: any; // Allow other config properties
}

// The YAML file is imported, parsed, and processed to convert relative URLs to absolute URLs
export const config: Config = processConfig(configData);

export default config;
