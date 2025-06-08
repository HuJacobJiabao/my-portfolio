# Change Log - June 8, 2025

## Summary
Updated application routing structure to use plural forms for better semantic consistency, renamed blog component file to match the new routing convention, and temporarily removed Mermaid diagram support due to rendering issues. Completely replaced gray-matter dependency with custom safeMatter parser to eliminate eval warnings and improve security. **Critical Fix**: Resolved GitHub Pages 404 errors when accessing markdown files by disabling Jekyll processing and restoring proper directory structure.

## Changes Made

### 1. Route Path Updates
Updated application routes to use plural forms for better semantic consistency:
- **Projects Route**: Changed from `/my-portfolio/project/` to `/my-portfolio/projects/`
- **Blog Route**: Changed from `/my-portfolio/blog/` to `/my-portfolio/blogs/`

### 2. File Rename
Renamed the blog page component file:
- **File Name**: Changed from `Blog.tsx` to `Blogs.tsx` to match the new plural routing convention

### 3. Mermaid Support Removal
Temporarily removed Mermaid diagram support due to ongoing rendering issues:
- **Dependencies**: Removed `mermaid` and `@types/mermaid` packages from package.json
- **Components**: Removed mermaid imports and rendering logic from MarkdownContent.tsx
- **Utilities**: Deleted mermaidRenderer.ts utility file
- **Markdown Processing**: Removed mermaid code block handling from markdown.ts
- **Styles**: Commented out all mermaid-related CSS styles (preserving for future re-enable)

### 4. Gray-Matter Replacement
Completely replaced gray-matter dependency with custom safeMatter parser:
- **Dependencies**: Removed `gray-matter` package from package.json to eliminate eval warnings
- **Parser**: Updated all frontmatter parsing to use custom `safeMatter` utility
- **Security**: Eliminated eval usage throughout the codebase for better security
- **Components**: Updated imports in contentLoader.ts, markdown.ts, and DetailPage.tsx
- **Build Config**: Cleaned up vite.config.ts to remove gray-matter specific configurations

### 5. **Content Preprocessing System Implementation**
Implemented comprehensive content preprocessing system to generate static JSON data for improved performance:
- **Static Data Generation**: Created preprocessing script that scans content directories and generates static JSON files
- **Build Integration**: Integrated preprocessing into build pipeline via `npm run preprocess` command
- **Performance Optimization**: Eliminated runtime content scanning in favor of compile-time static data generation
- **Type Safety**: Generated TypeScript interfaces for blog posts and projects with proper type definitions
- **Asset Management**: Enhanced asset path resolution and metadata extraction during preprocessing
- **JSON Output**: Generated `public/data/blogs.json` and `public/data/projects.json` for fast data loading

### 6. **GitHub Pages 404 Error Fix (Critical)**
Resolved critical deployment issue where React app couldn't fetch markdown content from GitHub Pages:
- **Root Cause**: GitHub Pages enabled Jekyll by default, which processed markdown files but didn't expose raw .md files
- **Directory Structure Issue**: Fixed incorrect deployment structure where files were placed directly in `/content/projects/` instead of proper subdirectories
- **Jekyll Disabling**: Added `.nojekyll` file to deployment package to disable Jekyll processing
- **File Recovery**: Restored `assetResolver.ts` from git history after accidental modification
- **Deployment Fix**: Rebuilt and redeployed with correct directory structure and Jekyll disabled
- **Verification**: Confirmed both local `dist/` and remote `gh-pages` branch have proper structure

## Files Modified
1. **`src/App.tsx`** - Updated route definitions and component imports
2. **`src/components/NavBar.tsx`** - Updated navigation links
3. **`src/pages/DetailPage.tsx`** - Updated contentType detection, redirect paths, and replaced gray-matter with safeMatter
4. **`src/components/Card.tsx`** - Updated project navigation paths
5. **`src/components/BlogCard.tsx`** - Updated blog navigation paths
6. **`src/utils/contentLoader.ts`** - Updated link generation and replaced gray-matter with safeMatter
7. **`src/pages/Blog.tsx`** → **`src/pages/Blogs.tsx`** - File renamed and moved
8. **`src/components/MarkdownContent.tsx`** - Removed mermaid imports and rendering logic
9. **`src/utils/markdown.ts`** - Removed mermaid code block handling and replaced gray-matter with safeMatter
10. **`src/index.css`** - Commented out mermaid-related CSS styles
11. **`src/styles/DetailPage.module.css`** - Commented out mermaid mobile styles
12. **`vite.config.ts`** - Cleaned up gray-matter references and optimizations
13. **`package.json`** - Removed mermaid, @types/mermaid, and gray-matter dependencies (build script already included .nojekyll creation)
14. **`src/scripts/preprocess-content.ts`** - Enhanced preprocessing script with comprehensive content scanning and JSON generation
15. **`public/data/blogs.json`** - Generated static JSON data for blog posts with metadata and content paths
16. **`public/data/projects.json`** - Generated static JSON data for projects with metadata, asset paths, and content paths
17. **`src/utils/staticDataLoader.ts`** - Created utility for loading preprocessed static data instead of runtime scanning
18. **`src/utils/assetResolver.ts`** - Restored from git history after accidental modification
19. **`dist/.nojekyll`** - Added to disable Jekyll processing on GitHub Pages
20. **GitHub Pages deployment** - Rebuilt and redeployed with correct directory structure

## Files Deleted
1. **`src/utils/mermaidRenderer.ts`** - Complete utility file removal

## Benefits

### ✅ Improvements
- **User Experience**: More intuitive navigation with plural route names that better represent collection pages
- **Developer Experience**: Consistent naming convention between routes and component files
- **Semantic Consistency**: Route paths now properly reflect that these are collection/listing pages
- **Security**: Eliminated eval warnings and usage by replacing gray-matter with custom parser
- **Build Quality**: Clean production builds with no warnings or security issues
- **🔥 Critical Fix**: GitHub Pages now properly serves markdown content, fixing 404 errors that prevented React app from loading project/blog content
- **Deployment Reliability**: Proper directory structure ensures consistent behavior between local and production environments
- **Performance Enhancement**: Static data preprocessing eliminates runtime content scanning for faster page loads
- **Build Optimization**: Preprocessed JSON data reduces initial load time and improves user experience

### ✅ Technical Benefits
- **Code Quality**: Improved consistency between file names, component names, and route paths
- **Architecture**: Better semantic structure with plural routes for collection pages
- **Maintainability**: Clearer naming convention reduces confusion for future development
- **Performance**: Eliminated mermaid rendering bottlenecks and failures
- **Stability**: Removed source of diagram rendering conflicts and eval warnings
- **Bundle Size**: Reduced JavaScript bundle size by removing large mermaid and gray-matter dependencies
- **Re-enablement Ready**: All mermaid styles preserved as comments for easy restoration
- **Security**: Custom frontmatter parser eliminates eval usage while maintaining full functionality
- **Static Data**: Preprocessed JSON data improves performance and reduces runtime content processing overhead
- **Type Safety**: Generated static data includes proper TypeScript interfaces for better development experience

## Technical Details
- All route references updated from singular to plural forms
- Import statements and component references updated throughout codebase
- Content loader utility updated to generate correct navigation links
- Navigation components updated to use new route paths
- TypeScript compilation and build process verified successful
- Mermaid dependencies and related code removed to address rendering issues
- **Content Preprocessing Implementation**:
  - Integrated preprocessing step into build pipeline: `npm run preprocess` runs before TypeScript compilation
  - Static JSON generation scans all content directories and extracts metadata from frontmatter
  - Asset path resolution and mapping during preprocessing for improved runtime performance
  - Generated `public/data/blogs.json` and `public/data/projects.json` with complete content metadata
  - `staticDataLoader.ts` utility provides fast access to preprocessed data instead of runtime content scanning
- **GitHub Pages Issue Resolution**:
  - Diagnosed that Jekyll was processing markdown files but not exposing raw .md files
  - Jekyll automatically renders index.md in directories (accessible via `/path/`) but blocks direct .md access (404 for `/path/index.md`)
  - React app expected to fetch raw markdown content via HTTP requests to .md files
  - Solution: Added `.nojekyll` file to disable Jekyll processing entirely
  - Verified deployment structure: files now correctly placed in subdirectories like `/content/projects/project-name/index.md`
  - Confirmed both local `dist/` and GitHub Pages `gh-pages` branch have identical structure

## Next Steps
1. **Immediate**: Test the updated routes in development environment to ensure all navigation works correctly
2. **Short-term**: Update any documentation or README files that reference the old route paths
3. **Long-term**: Consider implementing redirect rules for old routes to maintain backward compatibility if needed
4. **Future Consideration**: Monitor and test Mermaid diagram support for potential re-integration once rendering issues are resolved
