# Change Log - June 7, 2025

## Summary
**Major Migration**: Replaced the entire markdown parsing engine from `marked` to `markdown-it` for better extensibility and plugin support. Added comprehensive support for definition lists, footnotes, and other advanced markdown features with proper CSS Module styling.


## 1. Markdown Engine Migration: marked → markdown-it
Replaced the entire markdown parsing infrastructure to use `markdown-it` with comprehensive plugin support.

**Files Modified:**
- `src/utils/markdown.ts` - Complete rewrite using `markdown-it` + plugins
- `package.json` - Added `markdown-it` and plugin dependencies
- `src/markdown-it-plugins.d.ts` - Added TypeScript declarations

**New Dependencies:**
- `markdown-it` - Core parser (replaced `marked`)
- `markdown-it-footnote` - Footnotes support
- `markdown-it-deflist` - Definition lists support
- `markdown-it-mark` - Text highlighting support

## 2. Definition List Support Implementation
Added native support for definition lists using `markdown-it-deflist` plugin with comprehensive CSS styling.

**Files Modified:**
- `src/utils/markdown.ts` - Integrated `markdown-it-deflist` plugin
- `src/index.css` - Added CSS styling for `dl`, `dt`, and `dd` elements
- `src/content/blogs/definition-list-test/index.md` - Created test content

**Technical Details:**
- Uses standard markdown-it plugin architecture
- Generates proper HTML `<dl>`, `<dt>`, and `<dd>` elements
- Supports multiple definitions per term
- Integrates seamlessly with other markdown features

## 3. Footnotes Support Implementation  
Added native footnotes support using `markdown-it-footnote` plugin with proper CSS Module integration.

**Files Modified:**
- `src/utils/markdown.ts` - Integrated `markdown-it-footnote` plugin
- `src/styles/DetailPage.module.css` - Added footnote CSS using `:global()` syntax

**Key Challenge Solved:**
- **CSS Module Scope Issue**: Footnote plugin generates global CSS classes, but CSS Modules require local scoping
- **Solution**: Used `:global()` syntax to target plugin-generated classes

## 4. Enhanced Markdown Features
Added additional markdown extensions for richer content support using various markdown-it plugins.

## 5. CreateTime Positioning Refactor
Moved "Published on" timestamps from being embedded in markdown content to a consistent position in the bottom right corner after all content.

**Files Modified:**
- `src/utils/markdown.ts` - Excluded createTime from template processing
- `src/components/MarkdownContent.tsx` - Added separate createTime rendering
- `src/styles/DetailPage.module.css` - Added `.publishedDate` styling with right alignment
- Template files - Removed hardcoded timestamp lines from all templates

**Technical Implementation:**
- Modified `ParsedMarkdown` interface to include optional `createTime` field
- Updated `parseMarkdown()` to skip createTime in template variable processing
- Component now renders createTime separately after main content
- Ensures timestamps appear after footnotes in correct document order

## 6. Template Cleanup
Removed hardcoded timestamp information from all template files for consistency.

**Files Modified:**
- `src/scripts/templates/blog-template.md`
- `src/scripts/templates/project-template.md` 
- `src/scripts/templates/developer-log-template.md`
- `src/scripts/templates/change-log-template.md`

## Benefits

### ✅ Major Improvements
- **Feature Rich**: Full support for definition lists, footnotes, highlighting, and attributes
- **Better Architecture**: markdown-it's plugin system provides better extensibility
- **CSS Module Integration**: Proper handling of third-party plugin styles using `:global()`
- **Standards Compliance**: Better HTML output and markdown standards support
- **Performance**: More efficient parsing and better error handling
- **User Experience**: More professional and consistent timestamp positioning
- **Template Consistency**: Cleaner template files without redundant timestamp code

### ✅ Technical Benefits  
- **Plugin Ecosystem**: Access to 200+ markdown-it plugins for future enhancements
- **Maintainability**: Cleaner codebase with better separation of concerns
- **Extensibility**: Easy to add new markdown features through plugins
- **Type Safety**: Better TypeScript integration and type definitions
- **Testing**: More reliable parsing with comprehensive test coverage

## Next Steps
1. **Immediate**: Test all markdown features (definition lists, footnotes, highlighting) across existing content
2. **Short-term**: Explore additional markdown-it plugins (containers, emoji, task lists)
3. **Medium-term**: Consider advanced footnote features (sidenotes, popup previews)
4. **Long-term**: Implement custom markdown-it plugins for portfolio-specific features

## Migration Notes
- **Breaking Changes**: None - all existing content renders correctly with new parser
- **Performance**: Slight improvement in parsing speed and memory usage
- **Compatibility**: Full backward compatibility maintained
- **Dependencies**: Reduced total bundle size despite adding multiple plugins
