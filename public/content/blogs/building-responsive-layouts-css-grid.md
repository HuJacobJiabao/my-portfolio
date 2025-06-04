# Building Responsive Layouts with CSS Grid

## Why CSS Grid?

CSS Grid Layout is a two-dimensional layout method that offers a grid-based layout system with rows and columns. It makes it easier to design web pages without having to use floats and positioning.

## Basic Grid Concepts

### Grid Container and Grid Items
When you apply `display: grid` to an element, it becomes a grid container, and its direct children become grid items.

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
}
```

### Grid Lines and Tracks
Grid lines are the horizontal and vertical lines that divide the grid. Grid tracks are the spaces between grid lines.

## Practical Examples

### Simple Card Layout

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}
```

This creates a responsive grid where cards automatically wrap to new rows as needed.

### Complex Layout

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

## Advanced Techniques

### Subgrid
Subgrid allows grid items to inherit the grid lines of their parent grid:

```css
.subgrid-item {
  display: grid;
  grid-template-columns: subgrid;
}
```

### Grid and Flexbox Together
Grid is great for two-dimensional layouts, while Flexbox excels at one-dimensional layouts. Use them together for maximum flexibility.

## Browser Support and Fallbacks

CSS Grid has excellent browser support in modern browsers. For older browsers, consider:
- Progressive enhancement
- CSS feature queries (`@supports`)
- Flexbox fallbacks

## Conclusion

CSS Grid is a powerful tool for creating responsive layouts. Combined with Flexbox, it gives you complete control over your page layouts with clean, maintainable code.
