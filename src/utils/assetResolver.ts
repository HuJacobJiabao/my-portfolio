// Asset resolver utility for handling Vite asset imports in markdown content
// This utility helps resolve relative asset paths to proper Vite asset URLs

/**
 * Create an asset map for a given markdown file path
 * This resolves relative image paths to Vite asset URLs
 */
export async function createAssetMap(markdownPath: string): Promise<Map<string, string>> {
  const assetMap = new Map<string, string>();
  
  // Load all potential image assets from the content directory
  const assetModules = import.meta.glob('../content/**/*.{png,jpg,jpeg,gif,svg,webp}', { 
    query: '?url', 
    import: 'default' 
  });
  
  // Extract the folder path from the markdown path
  const pathParts = markdownPath.split('/');
  const folderPath = pathParts.slice(0, -1).join('/'); // Remove index.md to get folder path
  
  // For each asset module, check if it could be referenced from this markdown file
  for (const [assetPath, assetLoader] of Object.entries(assetModules)) {
    try {
      const assetUrl = await assetLoader() as string;
      
      // Calculate relative paths that could reference this asset
      const relativePaths = calculateRelativePaths(folderPath, assetPath);
      
      // Add all possible relative paths to the map
      relativePaths.forEach(relativePath => {
        assetMap.set(relativePath, assetUrl);
      });
      
    } catch (error) {
      console.warn(`Could not load asset: ${assetPath}`, error);
    }
  }
  
  return assetMap;
}

/**
 * Calculate all possible relative paths from a markdown file to an asset
 */
function calculateRelativePaths(markdownFolderPath: string, assetPath: string): string[] {
  const relativePaths: string[] = [];
  
  // Normalize paths by removing leading '../'
  const normalizeMarkdownPath = markdownFolderPath.replace(/^\.\.\//, '');
  const normalizeAssetPath = assetPath.replace(/^\.\.\//, '');
  
  const markdownParts = normalizeMarkdownPath.split('/');
  const assetParts = normalizeAssetPath.split('/');
  
  // Get the asset filename
  const assetFilename = assetParts[assetParts.length - 1];
  
  // Case 1: Asset is in the same directory
  if (markdownParts.join('/') === assetParts.slice(0, -1).join('/')) {
    relativePaths.push(`./${assetFilename}`);
    relativePaths.push(assetFilename);
  }
  
  // Case 2: Asset is in a subdirectory
  const markdownDir = markdownParts.join('/');
  const assetDir = assetParts.slice(0, -1).join('/');
  
  if (assetDir.startsWith(markdownDir + '/')) {
    const relativePath = assetDir.substring(markdownDir.length + 1) + '/' + assetFilename;
    relativePaths.push(relativePath);
    relativePaths.push(`./${relativePath}`);
  }
  
  // Case 3: Asset is in a parent or sibling directory
  const commonParts: string[] = [];
  const minLength = Math.min(markdownParts.length, assetParts.length - 1);
  
  for (let i = 0; i < minLength; i++) {
    if (markdownParts[i] === assetParts[i]) {
      commonParts.push(markdownParts[i]);
    } else {
      break;
    }
  }
  
  if (commonParts.length > 0) {
    const upLevels = markdownParts.length - commonParts.length;
    const downPath = assetParts.slice(commonParts.length).join('/');
    
    if (upLevels > 0 && downPath) {
      const upPath = '../'.repeat(upLevels);
      relativePaths.push(upPath + downPath);
    }
  }
  
  return relativePaths;
}

/**
 * Global asset cache to avoid reloading assets for each markdown file
 */
const globalAssetCache = new Map<string, string>();
let globalAssetCachePromise: Promise<void> | null = null;

/**
 * Load all assets into a global cache once
 */
async function loadGlobalAssetCache(): Promise<void> {
  if (globalAssetCachePromise) {
    return globalAssetCachePromise;
  }
  
  globalAssetCachePromise = (async () => {
    const assetModules = import.meta.glob('../content/**/*.{png,jpg,jpeg,gif,svg,webp}', { 
      query: '?url', 
      import: 'default' 
    });
    
    for (const [assetPath, assetLoader] of Object.entries(assetModules)) {
      try {
        const assetUrl = await assetLoader() as string;
        globalAssetCache.set(assetPath, assetUrl);
      } catch (error) {
        console.warn(`Could not load asset: ${assetPath}`, error);
      }
    }
  })();
  
  return globalAssetCachePromise;
}

/**
 * Create an asset map using the global cache (more efficient for multiple calls)
 */
export async function createAssetMapFromCache(markdownPath: string): Promise<Map<string, string>> {
  await loadGlobalAssetCache();
  
  const assetMap = new Map<string, string>();
  const pathParts = markdownPath.split('/');
  const folderPath = pathParts.slice(0, -1).join('/');
  
  for (const [assetPath, assetUrl] of globalAssetCache) {
    const relativePaths = calculateRelativePaths(folderPath, assetPath);
    relativePaths.forEach(relativePath => {
      assetMap.set(relativePath, assetUrl);
    });
  }
  
  return assetMap;
}
