import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import YAML from 'yaml';

/**
 * Load site configuration from YAML file
 */
export function loadSiteConfig() {
  try {
    // Get project root directory
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const projectRoot = path.resolve(__dirname, '../..');
    
    // Read config YAML file
    const configPath = path.join(projectRoot, 'src', 'config', 'config.yaml');
    const configContent = fs.readFileSync(configPath, 'utf-8');
    
    // Parse YAML
    const config = YAML.parse(configContent);
    return config;
  } catch (error) {
    console.error('Error loading site config:', error);
    // Return default values if config can't be loaded
    return {
      site: {
        content: {
          blogs: {
            defaultCover: 'default_cover.jpg',
            defaultHeaderBackground: 'background/default_blog.png'
          },
          projects: {
            defaultCover: 'default_cover.jpg',
            defaultHeaderBackground: 'background/default_proj.jpg'
          }
        }
      }
    };
  }
}

/**
 * Get default cover image for content type
 */
export function getDefaultCoverImage(contentType: 'blogs' | 'projects'): string {
  const config = loadSiteConfig();
  return contentType === 'blogs'
    ? config.content.blogs.defaultCover
    : config.content.projectConfig.defaultCover;
}

/**
 * Get default header background for content type
 */
export function getDefaultHeaderBackground(contentType: 'blogs' | 'projects'): string {
  const config = loadSiteConfig();
  return contentType === 'blogs'
    ? config.content.blogs.defaultHeaderBackground
    : config.content.projectConfig.defaultHeaderBackground;
}
