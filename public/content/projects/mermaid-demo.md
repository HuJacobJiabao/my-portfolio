---
title: "Mermaid Diagrams Demo"
date: "2024-01-15"
description: "Demonstrating Mermaid diagram support in the portfolio"
tags: ["demo", "mermaid", "diagrams"]
category: "Feature Demo"
---

# Mermaid Diagrams Demo

This page demonstrates the Mermaid diagram rendering capabilities.

## Flow Chart

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug it]
    D --> B
    C --> E[End]
```

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server
    
    User->>Browser: Visit page
    Browser->>Server: Request markdown
    Server-->>Browser: Return content
    Browser->>Browser: Process mermaid
    Browser-->>User: Display diagram
```

## Gantt Chart

```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Development
    Initial Setup    :done, setup, 2024-01-01, 2024-01-05
    Feature Development :active, features, 2024-01-06, 2024-01-20
    Testing :testing, after features, 5d
    section Deployment
    Production Deploy :deploy, after testing, 3d
```

## Class Diagram

```mermaid
classDiagram
    class MarkdownProcessor {
        +processContent(content: string)
        +renderMath(text: string)
        +processFootnotes(content: string)
        +renderMermaid(code: string)
    }
    
    class MermaidRenderer {
        +initialize()
        +renderDiagrams()
        +downloadSvg(svg: string)
    }
    
    MarkdownProcessor --> MermaidRenderer : uses
```

## Git Flow

```mermaid
gitgraph
    commit id: "Initial"
    branch feature
    checkout feature
    commit id: "Add mermaid"
    commit id: "Add styling"
    checkout main
    merge feature
    commit id: "Release v1.0"
```

All diagrams should render properly with download buttons and proper styling!
