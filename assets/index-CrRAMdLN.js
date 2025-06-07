const n=`---
type: "blog"
title: "Mermaid Error Containment Test"
createTime: "2025-06-07T22:00:00.000Z"
description: "Focused test cases for Mermaid error handling and DOM containment"
tags: ["Mermaid", "Error Handling", "DOM Safety"]
category: "Testing"
coverImage: "default"
---

# {{title}}

## Introduction

This page focuses specifically on testing Mermaid error scenarios to ensure that syntax errors are properly contained and don't break page layout.

## Critical Error Test Cases

### 1. Classic "Syntax error in text" Trigger

<div class="mermaid-container">
  <div id="syntax-error-1" class="mermaid-diagram"></div>
  <div class="mermaid-loading">Loading diagram...</div>
  <pre class="mermaid">
flowchart TD
    A[Start] --> B{Broken syntax
    This should trigger the classic "Syntax error in text" message
    B -->|Missing bracket| C[End]
  </pre>
</div>

### 2. Multiple Syntax Errors

<div class="mermaid-container">
  <div id="syntax-error-2" class="mermaid-diagram"></div>
  <div class="mermaid-loading">Loading diagram...</div>
  <pre class="mermaid">
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello
    Invalid syntax here ->->->
    B-->>A: This should break
    Another error line
    Missing semicolon;
  </pre>
</div>

### 3. Malformed Class Diagram

<div class="mermaid-container">
  <div id="syntax-error-3" class="mermaid-diagram"></div>
  <div class="mermaid-loading">Loading diagram...</div>
  <pre class="mermaid">
classDiagram
    class Animal {
        +String name
        +int age
        Missing closing brace
    class Dog {
        +String breed
        Another missing brace
  </pre>
</div>

## Layout Boundary Test

This text should remain stable and not be affected by the errors above. If you see any visual layout breaks or displaced content, the containment is not working properly.

### 4. Extreme Syntax Error

<div class="mermaid-container">
  <div id="extreme-error" class="mermaid-diagram"></div>
  <div class="mermaid-loading">Loading diagram...</div>
  <pre class="mermaid">
This is not even close to valid Mermaid syntax!
@#$%^&*(){}[]|\\\\:";'<>?,./-=+
Random characters that should definitely break parsing
flowchart TD but not really
  </pre>
</div>

This paragraph should also remain unaffected by the error above.

## Standard Markdown Error Test Cases

These test cases use standard Markdown syntax to see how the Markdown processor handles Mermaid errors compared to our custom HTML containers.

### 5. Standard Markdown Syntax Error

\`\`\`mermaid
flowchart TD
    A[Start] --> B{Missing bracket
    This should also fail in standard markdown
    B -->|Error| C[End]
\`\`\`

### 6. Standard Markdown Unknown Diagram

\`\`\`mermaid
unknownDiagramType
    Invalid diagram type
    Should fail gracefully
\`\`\`

### 7. Standard Markdown Empty

\`\`\`mermaid
\`\`\`

### 8. Standard Markdown Complex Error

\`\`\`mermaid
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello
    Invalid syntax ->->->
    B-->>A: Error
\`\`\`

## Expected Results

- ✅ Error messages should appear in red within each container
- ✅ No "Syntax error in text" SVGs should escape containers
- ✅ Page layout should remain intact
- ✅ No leftover \`d\${id}\` elements in DOM
- ✅ Surrounding text should not be displaced or broken

## Comparison Results

The test cases above allow you to compare how errors are handled between:

1. **Custom HTML Containers**: Our enhanced error handling with contained error messages
2. **Standard Markdown**: Default Markdown processor behavior

## DOM Verification

Open browser developer tools and verify:
1. No \`<div id="d\${id}">\` elements exist in the DOM
2. All error content is contained within \`.mermaid-container\` elements
3. No SVG elements exist outside their designated containers
4. CSS containment properties are applied correctly

## Testing Notes

These test cases specifically target the scenarios that historically caused:
- SVG content escaping containers
- "Syntax error in text" artifacts appearing in unexpected DOM locations
- Page layout breaking due to malformed SVG content
- Persistent DOM pollution from failed renders
`;export{n as default};
