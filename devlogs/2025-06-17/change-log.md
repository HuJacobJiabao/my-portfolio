<!-- 
FORMATTING REQUIREMENTS:
1. Maintain proper heading hierarchy:
   - Level 1 (#): Document title only (# Change Log - June 17, 2025)
   - Level 2 (##): Major sections and numbered changes
     * Top-level sections: ## Summary, ## Benefits, ## Next Steps
     * Numbered changes: ## 1. Feature/Fix Title, ## 2. Another Change, etc.
   - Level 3 (###): Subsections within major sections
     * Under Benefits: ### Improvements, ### Technical Benefits
     * Can be used for detailed breakdowns within numbered changes if needed
   - Level 4 (####): Minor details if needed for deeper analysis

2. Required structure:
   - ## Summary: Brief overview of the day's development work
   - Numbered changes: ## 1., ## 2., etc. with concise but comprehensive descriptions
   - ## Benefits: Organized into ### Improvements and ### Technical Benefits
   - ## Next Steps: Numbered list with Immediate, Short-term, and Long-term priorities

3. Content guidelines:
   - Use bold (**text**) for important terms, file names, and key concepts
   - Include checkmarks (✅) for completed items and measurable results
   - Keep descriptions concise but comprehensive for stakeholder communication
   - Focus on user-facing changes and business impact
   - Maintain consistency with corresponding developer log entries
-->
# Change Log - June 17, 2025

## Summary
Major improvements to the **onigiri-press** framework package system, deployment workflow, and file naming conventions. Completed several iterations of fixes for GitHub Pages deployment issues and enhanced the CLI initialization process.

<!-- Changes Made -->

## 1. Fixed Markdown File Naming System
Reverted all markdown content files from custom naming (`<folder-name>.md`) back to **index.md** to resolve GitHub Pages compatibility issues. Updated preprocessing scripts and generation logic accordingly.

## 2. Enhanced Vite Configuration for .nojekyll Files
Added custom Vite plugin to automatically generate **`.nojekyll`** files during build process, ensuring proper GitHub Pages deployment without Jekyll interference.

## 3. Improved CLI Deployment Commands
Modified deployment commands to use `--nojekyll` flag instead of `--dotfiles` to prevent unwanted files (like `.gitignore`) from being included in deployments while ensuring `.nojekyll` is properly added.

## 4. Added README Template for New Projects
Enhanced the **`ongr init`** command to automatically copy a comprehensive **README.md** template that includes proper installation instructions, command usage, and project setup guidance.

## 5. Fixed GitHub Pages Path Resolution
Resolved 404 errors in GitHub Pages deployment by ensuring proper file path resolution and content loading mechanisms work correctly in production environment.

## Benefits

### Improvements
- **Deployment Reliability**: ✅ GitHub Pages deployments now work consistently without file resolution errors
- **Developer Experience**: ✅ New projects automatically include comprehensive documentation via README template
- **File Organization**: ✅ Standardized on `index.md` naming convention for better compatibility
- **CLI Usability**: ✅ Cleaner deployment process with proper `.nojekyll` handling

### Technical Benefits
- **Code Quality**: ✅ Consistent file naming conventions across the entire framework
- **Architecture**: ✅ Improved separation between development and production file handling
- **Deployment**: ✅ Automated `.nojekyll` generation eliminates manual deployment steps
- **Documentation**: ✅ Auto-generated README templates ensure consistent project documentation
