// Asset resolver utility for handling static asset resolution in markdown content
// Updated for the new preprocessing system that serves assets as static files

/**
 * Get all available static assets by scanning the projects.json and blogs.json data
 */
async function getAllStaticAssets(): Promise<string[]> {
  const assets: string[] = [];
  
  try {
    // Load static data to get asset paths
    const [blogsResponse, projectsResponse] = await Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/blogs.json`),
      fetch(`${import.meta.env.BASE_URL}data/projects.json`)
    ]);
    
    if (blogsResponse.ok) {
      const blogs = await blogsResponse.json();
      for (const blog of blogs) {
        if (blog.assetPaths) {
          assets.push(...blog.assetPaths);
        }
        // Also add the content directory path for assets in the same folder
        const contentDir = blog.contentPath.replace('/index.md', '');
        assets.push(`${contentDir}/default_blog.png`);
        // Add common asset patterns
        const assetPatterns = [
          'default_blog.png', 'cover.jpg', 'cover.png', 'image.jpg', 'image.png'
        ];
        for (const pattern of assetPatterns) {
          assets.push(`${contentDir}/${pattern}`);
        }
      }
    }
    
    if (projectsResponse.ok) {
      const projects = await projectsResponse.json();
      for (const project of projects) {
        if (project.assetPaths) {
          assets.push(...project.assetPaths);
        }
        // Also add the content directory path for assets in the same folder
        const contentDir = project.contentPath.replace('/index.md', '');
        assets.push(`${contentDir}/default_blog.png`);
        // Add common asset patterns
        const assetPatterns = [
          'default_blog.png', 'cover.jpg', 'cover.png', 'image.jpg', 'image.png'
        ];
        for (const pattern of assetPatterns) {
          assets.push(`${contentDir}/${pattern}`);
        }
      }
    }
    
    // Remove duplicates
    return [...new Set(assets)];
    
  } catch (error) {
    console.warn('Could not load static asset data:', error);
    return [];
  }
}

/**
 * Convert asset path to static URL
 */
function getStaticAssetUrl(assetPath: string): string {
  // Remove leading './' if present
  const cleanPath = assetPath.startsWith('./') ? assetPath.slice(2) : assetPath;
  return `${import.meta.env.BASE_URL}content/${cleanPath}`;
}

/**
 * Create an asset map for a given markdown file path
 * This resolves relative image paths to proper static URLs
 */
export async function createAssetMap(markdownPath: string): Promise<Map<string, string>> {
  const assetMap = new Map<string, string>();
  
  // Extract the folder path from the markdown path
  const pathParts = markdownPath.split('/');
  const folderPath = pathParts.slice(0, -1).join('/'); // Remove index.md to get folder path
  
  // console.log('Creating asset map for markdownPath:', markdownPath);
  // console.log('Folder path:', folderPath);
  
  // Get all available assets from the static data
  const assetsFromStatic = await getAllStaticAssets();
  
  // For each asset, check if it could be referenced from this markdown file
  for (const assetPath of assetsFromStatic) {
    // Calculate relative paths that could reference this asset
    const relativePaths = calculateRelativePaths(folderPath, assetPath);
    
    // Convert to static URL
    const staticUrl = getStaticAssetUrl(assetPath);
    
    // Add all possible relative paths to the map
    relativePaths.forEach(relativePath => {
      assetMap.set(relativePath, staticUrl);
      // console.log(`Asset mapping: ${relativePath} -> ${staticUrl}`);
    });
  }
  
  return assetMap;
}

/**
 * Calculate all possible relative paths from a markdown file to an asset
 */
function calculateRelativePaths(markdownFolderPath: string, assetPath: string): string[] {
  const relativePaths: string[] = [];
  
  // console.log(`Calculating relative paths from ${markdownFolderPath} to ${assetPath}`);
  
  // Normalize paths by removing leading '../'
  const normalizeMarkdownPath = markdownFolderPath.replace(/^\.\.\//, '');
  const normalizeAssetPath = assetPath.replace(/^\.\.\//, '');
  
  // console.log(`Normalized: ${normalizeMarkdownPath} -> ${normalizeAssetPath}`);
  
  const markdownParts = normalizeMarkdownPath.split('/');
  const assetParts = normalizeAssetPath.split('/');
  
  // Get the asset filename
  const assetFilename = assetParts[assetParts.length - 1];
  
  // Case 1: Asset is in the same directory
  if (markdownParts.join('/') === assetParts.slice(0, -1).join('/')) {
    relativePaths.push(`./${assetFilename}`);
    relativePaths.push(assetFilename);
    // console.log('Case 1: Same directory');
    
    // Also add the self-referencing pattern for same directory
    // For projects/test-asset-project-1/, also match ../../projects/test-asset-project-1/
    if (markdownParts.length >= 2) {
      const parentDirName = markdownParts[markdownParts.length - 2]; // "projects"
      const currentDirName = markdownParts[markdownParts.length - 1]; // "test-asset-project-1"
      const selfRefPattern = `../../${parentDirName}/${currentDirName}/${assetFilename}`;
      relativePaths.push(selfRefPattern);
      // console.log(`Case 1b: Self-reference pattern: ${selfRefPattern}`);
    }
  }
  
  // Case 2: Asset is in a subdirectory
  const markdownDir = markdownParts.join('/');
  const assetDir = assetParts.slice(0, -1).join('/');
  
  if (assetDir.startsWith(markdownDir + '/')) {
    const relativePath = assetDir.substring(markdownDir.length + 1) + '/' + assetFilename;
    relativePaths.push(relativePath);
    relativePaths.push(`./${relativePath}`);
    // console.log('Case 2: Subdirectory');
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
  
  if (commonParts.length >= 0) { 
    const upLevels = markdownParts.length - commonParts.length;
    const downPath = assetParts.slice(commonParts.length).join('/');
    
    if (upLevels >= 0 && downPath) { 
      const upPath = '../'.repeat(upLevels);
      const fullRelativePath = upPath + downPath;
      relativePaths.push(fullRelativePath);
      // console.log(`Case 3: Parent/sibling directory, upLevels: ${upLevels}, downPath: ${downPath}, result: ${fullRelativePath}`);
    }
  }
  
  // Case 4: Additional sibling directory patterns for same content type
  // For projects/folder1/ accessing projects/folder2/, also generate ../folder2/ pattern
  if (markdownParts.length >= 2 && assetParts.length >= 3) {
    const markdownContentType = markdownParts[markdownParts.length - 2]; // e.g., "projects"
    const assetContentType = assetParts[assetParts.length - 3]; // e.g., "projects"
    
    if (markdownContentType === assetContentType) {
      const assetFolderName = assetParts[assetParts.length - 2]; // e.g., "test-project-1"
      const siblingPattern = `../${assetFolderName}/${assetFilename}`;
      relativePaths.push(siblingPattern);
      // console.log(`Case 4: Sibling directory pattern: ${siblingPattern}`);
    }
  }
  
  // 新增：始终加入“从 markdown 文件夹到 asset 的相对路径”
  try {
    const from = [...markdownParts];
    const to = [...assetParts.slice(0, -1), assetFilename];
    let i = 0;
    while (i < from.length && i < to.length && from[i] === to[i]) i++;
    const up = from.length - i;
    const down = to.slice(i);
    const rel = '../'.repeat(up) + down.join('/');
    if (rel && !relativePaths.includes(rel)) {
      relativePaths.push(rel);
    }
  } catch {
    // ignore
  }
  
  // console.log(`Final relative paths: ${relativePaths}`);
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
    try {
      const assetsFromStatic = await getAllStaticAssets();
      
      for (const assetPath of assetsFromStatic) {
        const staticUrl = getStaticAssetUrl(assetPath);
        globalAssetCache.set(assetPath, staticUrl);
      }
      
      // console.log('Loaded global asset cache:', Array.from(globalAssetCache.entries()));
    } catch (error) {
      console.warn('Could not load global asset cache:', error);
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
  
  // console.log('Creating asset map for:', markdownPath);
  // console.log('Folder path:', folderPath);
  // console.log('Available assets:', Array.from(globalAssetCache.keys()));
  
  for (const [assetPath, assetUrl] of globalAssetCache) {
    const relativePaths = calculateRelativePaths(folderPath, assetPath);
    // console.log(`Asset ${assetPath} -> relative paths:`, relativePaths);
    relativePaths.forEach(relativePath => {
      assetMap.set(relativePath, assetUrl);
    });
  }
  
  // console.log('Final asset map:', Array.from(assetMap.entries()));
  return assetMap;
}
