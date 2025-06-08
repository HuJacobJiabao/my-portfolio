# Log Templates Formatting Guidelines

This document outlines the formatting requirements for the developer and change logs used in this project.

## General Formatting Rules

1. All log files should follow proper Markdown formatting
2. Always include the filepath comment at the top: `<!-- filepath: /path/to/file.md -->`
3. Use consistent heading levels throughout the document:
   - Level 1 (`#`): Document title only
   - Level 2 (`##`): Major sections
   - Level 3 (`###`): Subsections 
   - Level 4 (`####`): Detailed analysis within subsections
4. Bold (`**text**`) important terms, file names, and key points
5. Use code blocks with appropriate language syntax highlighting
6. Include checkmarks (✅) for completed items
7. Warning symbols (⚠️) for items requiring attention

## Developer Log Format Requirements

The `developer-log-template.md` must follow this heading hierarchy:

```
# Developer Log - Date (Level 1)
## Implementation Summary (Level 2)
### Problem Statement (Level 3)
### Solution Overview (Level 3)
## Technical Implementations (Level 2)
### 1. Feature/Fix Name (Level 3)
#### Problem Analysis (Level 4)
#### Solution Design (Level 4)
#### Implementation Details (Level 4)
#### Files Modified (Level 4)
#### Testing Results (Level 4)
```

**Important**: Maintain consistent heading levels - never use a Level 3 heading (`###`) where a Level 4 heading (`####`) should be used. This is particularly important in the Technical Implementations section.

## Change Log Format Requirements

The `change-log-template.md` must follow this heading hierarchy:

```
# Change Log - Date (Level 1)
## Summary (Level 2)
## Changes Made (Level 2)
### 1. Feature/Fix Title (Level 3)
### 2. Another Change (Level 3)
## Files Modified (Level 2)
## Files Deleted (Level 2)
## Benefits (Level 2)
### ✅ Improvements (Level 3)
### ✅ Technical Benefits (Level 3)
## Technical Details (Level 2)
## Next Steps (Level 2)
```

## Code Examples

When including code examples:

1. Always specify the language for syntax highlighting:
   ```typescript
   // TypeScript code here
   ```

   ```css
   /* CSS code here */
   ```

2. Use comments to explain key parts of the code
3. Keep examples concise and focused on the changes made

## Technical Impact Documentation

When documenting technical impacts:

1. Include before/after metrics when available
2. Use bullet points for clarity
3. Group related impacts together
4. Bold the most significant improvements

## Background Implementation Documentation Example

```markdown
### 10. Background Implementation Optimization

#### Problem Analysis
- **Issue**: Inconsistent background implementation across different components
- **Root Cause**: Background images assigned incorrectly in multiple components
- **Impact**: Inconsistent visual experience and broken design language

#### Solution Design
- **Approach**: Implement unified background system with consistent image assignments
- **Architecture**: Standardized background rules for all components
- **Benefits**: Consistent visual identity and improved maintainability

#### Implementation Details
```css
/* Content area backgrounds */
.backgroundFixed {
  background-image: url('/background/about.jpg');
  background-attachment: fixed;
}

/* Footer backgrounds */
.footer .backgroundFixed {
  background-image: url('/background/hero.jpg');
  background-attachment: fixed;
}

/* Mobile optimization */
@media (max-width: 768px) {
  .backgroundFixed {
    background-attachment: scroll;
  }
}
```

#### Standardized Background Rules
1. **Page Headers**: Use page-specific backgrounds
2. **Content Areas**: All use unified `about.jpg` background
3. **Footers**: All use unified `hero.jpg` background
4. **Desktop Devices**: Use `background-attachment: fixed` for parallax effect
5. **Mobile Devices**: Use `background-attachment: scroll` for performance
```

## Date Format

Always use the format `Month Day, Year` (e.g., "June 8, 2025") for dates in log titles.

## Automated Generation

These templates are used by the `create-daily-log.ts` script to generate new log files. The script will:

1. Create the appropriate directory structure if it doesn't exist
2. Generate log files with the correct template
3. Insert the current date in the format specified above
4. Place the files in the `frame-logs/YYYY-MM-DD/` directory

Remember to run `npm run log:create` to generate new log files for the current day.
