#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function colorize(text, color) {
  return `${color}${text}${colors.reset}`;
}

/**
 * Validates proper heading structure in markdown content
 * @param {string} content Markdown content to validate
 * @param {string} logType Type of log ('developer' or 'change')
 * @returns {string[]} Array of validation warnings, empty if no issues
 */
function validateHeadingStructure(content, logType) {
  const warnings = [];
  const lines = content.split('\n');
  const headingPattern = /^(#{1,4})\s+(.+)$/;
  let lastLevel = 0;
  let inImplementationSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(headingPattern);
    
    if (match) {
      const level = match[1].length;
      const heading = match[2];
      
      // Check for level 1 heading (should only be the title)
      if (level === 1 && i > 10) {
        warnings.push(`Line ${i+1}: Multiple level 1 headings found. Only the title should use a level 1 heading.`);
      }
      
      // For developer logs, check specific sections
      if (logType === 'developer') {
        // Track when we're in the Technical Implementations section
        if (level === 2 && heading.includes('Technical Implementations')) {
          inImplementationSection = true;
        } else if (level === 2) {
          inImplementationSection = false;
        }
        
        // Check for Problem Analysis, Solution Design, etc. using wrong heading level
        if (inImplementationSection && level === 3 && 
            (heading.includes('Problem Analysis') || 
             heading.includes('Solution Design') || 
             heading.includes('Implementation Details') || 
             heading.includes('Files Modified') || 
             heading.includes('Testing Results'))) {
          warnings.push(`Line ${i+1}: "${heading}" should use level 4 heading (####) when under a feature section.`);
        }
      }
      
      // Check for proper heading hierarchy (shouldn't skip levels)
      if (level > lastLevel + 1) {
        warnings.push(`Line ${i+1}: Heading level skipped. Level ${lastLevel} to ${level}.`);
      }
      
      lastLevel = level;
    }
  }
  
  return warnings;
}

/**
 * Validates all markdown files in a directory
 * @param {string} dirPath Directory path to check
 */
function validateDirectory(dirPath) {
  console.log(colorize(`\nChecking files in: ${dirPath}`, colors.blue + colors.bright));
  
  try {
    const files = fs.readdirSync(dirPath);
    let hasIssues = false;
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(dirPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const logType = file.includes('developer') ? 'developer' : 'change';
        
        const warnings = validateHeadingStructure(content, logType);
        
        if (warnings.length > 0) {
          hasIssues = true;
          console.log(colorize(`\n⚠️ Format warnings in ${file}:`, colors.yellow));
          warnings.forEach(warning => {
            console.log(colorize(`   - ${warning}`, colors.yellow));
          });
        } else {
          console.log(colorize(`✅ ${file}: No format issues found`, colors.green));
        }
      }
    }
    
    if (!hasIssues) {
      console.log(colorize(`\n✅ All markdown files in this directory have proper formatting!`, colors.green));
    }
    
    return !hasIssues;
  } catch (error) {
    console.error(colorize(`❌ Error checking directory: ${error.message}`, colors.red));
    return false;
  }
}

// Main execution
function main() {
  const targetDir = process.argv[2] || process.cwd();
  
  console.log(colorize('📄 Markdown Format Validator', colors.cyan + colors.bright));
  console.log(colorize(`Checking directory: ${targetDir}`, colors.blue));
  
  const success = validateDirectory(targetDir);
  
  if (!success) {
    console.log(colorize('\n⚠️ Some markdown files have formatting issues. Please fix them according to the template requirements.', colors.yellow + colors.bright));
    process.exit(1);
  }
}

main();
