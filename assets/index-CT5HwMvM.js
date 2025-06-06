const n=`---
type: "blog"
title: "All Markdown style"
createTime: "2025-06-06T11:44:14.713Z"
description: "Markdown style guide covering all common syntax features."
tags: ["Markdown", "Guide", "Syntax"]
category: "Markdown"
coverImage: "./markdown-svgrepo-com.svg"
---

# {{title}}

## 1. Headings


\`\`\`mermaid
graph TD
  A[Start] --> B{Is Markdown working?}
  B -- Yes --> C[Great!]
  B -- No --> D[Fix it!]
\`\`\`

![wallhaven-d85ewm.png](./wallhaven-d85ewm.png "Optional title")

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

## 2. Text Styles

This is **bold text**  
This is *italic text*  
This is ***bold and italic text***  
This is ~~strikethrough text~~  
This is ==highlighted text== (if supported)

---

## 3. Paragraph & Line Breaks

This is a paragraph.  
This line breaks with two spaces.  
And this one follows.

---

## 4. Blockquotes

> This is a blockquote.
> It supports multiple lines.
>
> > Nested blockquote.

---

## 5. Lists

### Unordered List

- Item A
- Item B
  - Sub-item B1
  - Sub-item B2

* Asterisk item
+ Plus item

### Ordered List

1. First
2. Second
   1. Sub-second-1
   2. Sub-second-2

---

## 6. Task Lists

- [x] Task complete
- [ ] Task pending
- [ ] Another task

---

## 7. Code

### Inline Code

Here is \`inline code\` in a sentence.

### Code Block (JavaScript)

\`\`\`js
function greet(name) {
  console.log(\`Hello, \${name}\`);
}
\`\`\`

### Code Block (Python)

\`\`\`python
def greet(name):
    print(f"Hello, {name}")
\`\`\`

---

## 8. Tables

| Syntax | Description | Example |
|--------|-------------|---------|
| Header | Title       | Text    |
| Paragraph | Body    | Data    |
| \`inline\` | \`code\`   | \`here\`  |

---

## 9. Links

[Inline Link](https://example.com)

[Reference Link][ref]

[ref]: https://example.com

Email: <hello@example.com>

---

## 10. Images

Inline image:  
![Placeholder Image](./wallhaven-d85ewm.png "Optional title")

Reference-style image:  
![Alt][img-ref]

[img-ref]: ./wallhaven-d85ewm.png

---

## 11. Horizontal Rules

---

---

## 12. HTML Elements

<b>Bold</b>, <i>Italic</i>, <u>Underline</u>  
<span style="color:red;">Red Text (if supported)</span>

<!-- Comment: this won't be rendered -->

---

## 13. Emojis

😀 😎 👍 🎉 💡 🚀

---

## 14. Footnotes (if supported)

Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.

---

## 15. Math (if supported, e.g., with KaTeX or MathJax)

Inline math: $E = mc^2$  
Block math:

$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$

---

## 16. Mermaid Diagram (if supported)

\`\`\`mermaid
graph TD
  A[Start] --> B{Is Markdown working?}
  B -- Yes --> C[Great!]
  B -- No --> D[Fix it!]
\`\`\`

---

## 17. Definition List (if supported)

Term 1  
: Definition 1

Term 2  
: Definition 2 with *markdown*



---

*Published on {{createTime}}*
`;export{n as default};
