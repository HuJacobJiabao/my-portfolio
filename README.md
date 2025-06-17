# Personal Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Vite. Features a clean design, interactive code blocks, blog system, and project showcase.

## 🚀 Features

- **📱 Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **📝 Markdown Blog System**: Write blog posts in Markdown with full syntax highlighting
- **💼 Project Portfolio**: Showcase development projects with detailed descriptions
- **🎨 Interactive Code Blocks**: Expandable code blocks with copy-to-clipboard functionality
- **📋 Table of Contents**: Auto-generated TOC for navigation
- **⚡ Fast Performance**: Optimized with Vite for lightning-fast development and builds
- **🎯 TypeScript**: Full type safety throughout the application
- **🎨 Modern UI**: Clean, professional design with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules + Modern CSS
- **Markdown**: markdown-it with custom renderer
- **Syntax Highlighting**: Prism.js with Night Owl theme
- **Icons**: Font Awesome
- **Routing**: React Router
- **Linting**: ESLint with TypeScript support

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd my-portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Content Generation
- `npm run generate <type> <name>` - Generate new blog posts or projects
- `npm run g <type> <name>` - Shortcut for generate command

#### Development Logging
- `npm run log` - Create daily logs for today
- `npm run log YYYY-MM-DD` - Create daily logs for specific date

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── styles/             # CSS modules and global styles
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── config/             # Configuration files
├── scripts/            # Development and automation scripts
└── frame-logs/         # Daily development logs
    └── YYYY-MM-DD/     # Date-based log directories
        ├── change-log.md      # High-level daily changes
        └── developer-log.md   # Detailed technical notes

public/
├── content/            # Markdown content files
│   ├── blogs/         # Blog post markdown files
│   └── projects/      # Project markdown files
└── background/        # Background images
```

### Adding Content

#### Blog Posts
1. Create a new `.md` file in `public/content/blogs/`
2. Add the blog post entry to `src/pages/Blog.tsx`
3. Follow the existing markdown structure

#### Projects
1. Create a new `.md` file in `public/content/projects/`
2. Add the project entry to `src/pages/Projects.tsx`
3. Include project metadata (title, description, tags, etc.)

#### Automated Content Generation
Use the content generation script for faster setup:

```bash
# Generate a new blog post
npm run g blog "My New Blog Post"

# Generate a new project
npm run g project "Awesome React App"
```

## 📊 Development Workflow

### Daily Logging System
The project uses a structured daily logging system under `src/frame-logs/`:

```bash
# Create today's log files
npm run log

# Create logs for a specific date
npm run log 2025-06-07
```

This creates two files per day:
- `change-log.md` - High-level summary of changes and accomplishments
- `developer-log.md` - Detailed technical implementation notes

### Log Structure Benefits
- **Daily Focus**: Easy to see what was accomplished each day
- **Separated Concerns**: Change summaries vs technical deep-dives
- **Scalable**: Unlimited daily entries without file size issues
- **Searchable**: Isolated content per day for targeted searches
- **Team Friendly**: Clear progress tracking and review-friendly format

## 📋 Documentation

- **[CHANGELOG.md](./CHANGELOG.md)** - Track all changes and feature additions
- **[Daily Logs](./src/frame-logs/)** - Structured daily development logs
  - `src/frame-logs/YYYY-MM-DD/change-log.md` - High-level daily changes
  - `src/frame-logs/YYYY-MM-DD/developer-log.md` - Detailed technical implementation notes
- **[DEVELOPER_LOG.md](./DEVELOPER_LOG.md)** - Legacy developer log (see daily logs for current development)

## 🎯 Key Features Implementation

### Interactive Code Blocks
- Expand/collapse functionality with visual feedback
- Copy-to-clipboard with modern and legacy browser support
- Syntax highlighting for 15+ programming languages
- Robust event handling with WeakSet tracking

### Responsive Navigation
- Mobile-friendly hamburger menu
- Smooth scrolling with active section tracking
- Dynamic table of contents generation

### Performance Optimizations
- Code splitting and lazy loading
- Optimized asset bundling
- Efficient DOM manipulation
- Memory leak prevention

## 🔧 Configuration

### Environment Variables
No environment variables are required for basic functionality.

### Customization
- **Theme**: Modify CSS custom properties in `src/index.css`
- **Colors**: Update color scheme in CSS modules
- **Fonts**: Configure in CSS and update Font Awesome imports
- **Content**: Update markdown files and metadata arrays

## 🌐 Deployment

The project is configured for deployment to GitHub Pages with base URL support.

```bash
# Build for GitHub Pages
npm run build

# The dist/ folder contains the production build
```

## 🐛 Troubleshooting

### Code Block Issues
If code blocks aren't interactive:
1. Check browser console for JavaScript errors
2. Verify `initializeCodeBlocks()` is being called
3. Ensure markdown content has loaded before initialization

### Build Issues
If TypeScript compilation fails:
1. Run `npm run build` to see detailed errors
2. Check imports and type definitions
3. Verify all dependencies are installed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update documentation:
   - Add entry to `CHANGELOG.md` for user-facing changes
   - Create or update daily logs in `src/frame-logs/YYYY-MM-DD/`
   - Use `change-log.md` for high-level summaries
   - Use `developer-log.md` for detailed technical notes
5. Test thoroughly
6. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.
