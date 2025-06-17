<!-- 
FORMATTING REQUIREMENTS:
1. Maintain proper heading hierarchy:
   - Level 1 (#): Document title only (# Change Log - June 15, 2025)
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
# Change Log - June 15, 2025

## Summary
Major milestone achieved with the creation and publication of **🍙 OnigiriPress**, a modern portfolio framework extracted from the personal portfolio codebase. Additionally completed critical infrastructure improvements for markdown asset resolution and deployment automation.

<!-- Changes Made -->

## 1. 🍙 OnigiriPress Framework Launch
Successfully extracted the personal portfolio into a reusable **🍙 OnigiriPress** framework and published it as an npm package. The framework includes CLI tools, comprehensive documentation, and all the features needed to create modern portfolio websites.

## 2. Markdown Static Asset Resolution Refactor
Completely refactored the markdown asset path resolution system to use **public-based paths** for all static content. This eliminates broken images and links in blog posts and project documentation that were occurring in production builds.

## 3. GitHub Actions Deployment Fix
Fixed failing GitHub Actions deployment workflow by updating **artifact extraction** processes and modernizing action versions. The CI/CD pipeline now runs reliably with proper error handling and automated deployment to GitHub Pages.

## Benefits

### Improvements
- **Community Impact**: ✅ 🍙 OnigiriPress framework now available for developers worldwide via npm
- **User Experience**: ✅ All images and assets now display correctly in published content
- **Developer Experience**: ✅ Automated deployments eliminate manual publishing steps
- **Framework Distribution**: ✅ Easy installation with `npm install -g onigiri-press`

### Technical Benefits
- **Open Source Contribution**: ✅ Published comprehensive 🍙 OnigiriPress portfolio framework to benefit developer community
- **Code Quality**: ✅ Centralized asset path resolution with consistent handling
- **Architecture**: ✅ Streamlined CI/CD pipeline with modern GitHub Actions
- **Package Management**: ✅ Professional npm package with CLI tools and TypeScript definitions

