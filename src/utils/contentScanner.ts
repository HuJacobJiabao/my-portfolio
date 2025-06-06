import { formatDateForDisplay } from './dateFormatter';

export interface ContentMetadata {
  type: 'blog' | 'project';
  title: string;
  createTime: string;
  description?: string;
  tags?: string[];
  category: string;
  coverImage?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string;
  link: string;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}

/**
 * Parse frontmatter manually without YAML dependency
 */
function parseFrontmatter(content: string): { metadata: any; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { metadata: {}, content };
  }

  const [, frontmatterStr, bodyContent] = match;
  const metadata: any = {};

  // Parse YAML-like frontmatter manually
  const lines = frontmatterStr.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.substring(0, colonIndex).trim();
    let value = trimmed.substring(colonIndex + 1).trim();

    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Handle arrays (tags)
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1);
      if (arrayContent.trim()) {
        metadata[key] = arrayContent.split(',').map(item => 
          item.trim().replace(/^["']|["']$/g, '')
        );
      } else {
        metadata[key] = [];
      }
    } else if (value) {
      metadata[key] = value;
    }
  }

  return { metadata, content: bodyContent };
}

/**
 * Enhanced content scanner that handles both old and new folder structures
 */
export class ContentScanner {
  private static generatedBlogs: BlogPost[] = [];
  private static generatedProjects: Project[] = [];
  private static isInitialized = false;

  /**
   * Initialize the content scanner
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    console.log('🔍 Scanning for generated content...');
    
    try {
      // Load generated content
      this.generatedBlogs = await this.scanContentType('blogs') as BlogPost[];
      this.generatedProjects = await this.scanContentType('projects') as Project[];
      
      this.isInitialized = true;
      console.log(`✅ Found ${this.generatedBlogs.length} generated blogs and ${this.generatedProjects.length} generated projects`);
    } catch (error) {
      console.warn('⚠️ Failed to scan generated content:', error);
      this.isInitialized = true; // Don't keep retrying
    }
  }

  /**
   * Scan content type directory for both flat files and folder structure
   */
  private static async scanContentType(contentType: 'blogs' | 'projects'): Promise<Array<BlogPost | Project>> {
    const items: Array<BlogPost | Project> = [];

    // Try to discover content using known patterns and directory listing
    const knownIds = contentType === 'blogs' 
      ? ['building-advanced-toc-navigation', 'my-journey-into-web-development', 'understanding-react-hooks', 'building-responsive-layouts-css-grid']
      : ['portfolio-website', 'react-dashboard'];

    // First try to load known static content
    for (const id of knownIds) {
      const content = await this.loadContentItem(contentType, id);
      if (content) {
        items.push(content);
      }
    }

    // Then try to find generated content by checking common folder names
    const commonFolderNames = [
      'test-blog', 'sample-project', 'new-article', 'demo-blog', 'example-project'
    ];

    for (const folderName of commonFolderNames) {
      const content = await this.loadContentItem(contentType, folderName);
      if (content && !items.find(item => item.id === content.id)) {
        items.push(content);
      }
    }

    return items;
  }

  /**
   * Load a single content item from either folder structure or flat structure
   */
  private static async loadContentItem(
    contentType: 'blogs' | 'projects', 
    itemId: string
  ): Promise<BlogPost | Project | null> {
    // Try folder structure first: content/blogs/item-id/item-id.md
    let markdownPath = `${import.meta.env.BASE_URL}content/${contentType}/${itemId}/${itemId}.md`;
    
    try {
      let response = await fetch(markdownPath);
      
      // If folder structure fails, try flat structure: content/blogs/item-id.md
      if (!response.ok) {
        markdownPath = `${import.meta.env.BASE_URL}content/${contentType}/${itemId}.md`;
        response = await fetch(markdownPath);
      }

      if (!response.ok) {
        return null;
      }

      const markdownContent = await response.text();
      const { metadata } = parseFrontmatter(markdownContent);
      
      // Convert createTime to standard date format using local time
      let date = formatDateForDisplay(new Date());
      if (metadata.createTime) {
        try {
          date = formatDateForDisplay(metadata.createTime);
        } catch (e) {
          // Keep default date if parsing fails
        }
      }

      // Build the link
      const link = `${import.meta.env.BASE_URL}${contentType === 'blogs' ? 'blog' : 'project'}/${itemId}`;
      
      // Convert to appropriate format
      const baseItem = {
        id: itemId,
        title: metadata.title || itemId.replace(/-/g, ' '),
        date,
        category: metadata.category || 'General',
        description: metadata.description || '',
        tags: Array.isArray(metadata.tags) ? metadata.tags : [],
        link
      };

      if (contentType === 'blogs') {
        return {
          ...baseItem,
          image: metadata.coverImage || undefined
        } as BlogPost;
      } else {
        return {
          ...baseItem,
          image: metadata.coverImage || `${import.meta.env.BASE_URL}default_cover.jpg`
        } as Project;
      }
      
    } catch (error) {
      console.warn(`⚠️ Error loading content item ${itemId}:`, error);
      return null;
    }
  }

  /**
   * Get all blog posts (static + generated)
   */
  static async getAllBlogs(staticBlogs: BlogPost[]): Promise<BlogPost[]> {
    await this.initialize();
    
    // Merge static and generated blogs, avoiding duplicates
    const allBlogs = [...staticBlogs];
    
    for (const generatedBlog of this.generatedBlogs) {
      if (!allBlogs.find(blog => blog.id === generatedBlog.id)) {
        allBlogs.push(generatedBlog);
      }
    }
    
    return allBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Get all projects (static + generated)
   */
  static async getAllProjects(staticProjects: Project[]): Promise<Project[]> {
    await this.initialize();
    
    // Merge static and generated projects, avoiding duplicates
    const allProjects = [...staticProjects];
    
    for (const generatedProject of this.generatedProjects) {
      if (!allProjects.find(project => project.id === generatedProject.id)) {
        allProjects.push(generatedProject);
      }
    }
    
    return allProjects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Refresh the content cache (useful after generating new content)
   */
  static async refresh(): Promise<void> {
    this.generatedBlogs = [];
    this.generatedProjects = [];
    this.isInitialized = false;
    await this.initialize();
  }

  /**
   * Get content statistics
   */
  static getStats(): { blogCount: number; projectCount: number; generatedBlogCount: number; generatedProjectCount: number } {
    return {
      blogCount: this.generatedBlogs.length,
      projectCount: this.generatedProjects.length,
      generatedBlogCount: this.generatedBlogs.length,
      generatedProjectCount: this.generatedProjects.length
    };
  }
}
