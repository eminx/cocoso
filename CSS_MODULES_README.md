# CSS Modules in Meteor

This project has been configured to use CSS Modules with Meteor using a custom, modern implementation.

## File Extension

CSS Modules files should use the `.module.css` extension (e.g., `styles.module.css`).

## Usage

### 1. Create a CSS Module file

Create a file with `.module.css` extension:

```css
/* styles.module.css */
.button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

.button:hover {
  background-color: darkblue;
}
```

### 2. Import and use in React components

```jsx
import React from 'react';
import styles from './styles.module.css';

const MyComponent = () => {
  return <button className={styles.button}>Click me</button>;
};

export default MyComponent;
```

## How it works

1. The custom CSS modules compiler processes `.module.css` files
2. It extracts class names and creates a mapping
3. It injects the CSS into the DOM automatically
4. It exports an object with the mapped class names

## Configuration

- CSS Modules files (`.module.css`) are processed by the custom `cocoso:css-modules` package
- Regular CSS files are processed by PostCSS (autoprefixer, etc.)
- The packages work together without conflicts

## Troubleshooting

If you encounter issues:

1. Make sure you're using `.module.css` extension
2. Restart your Meteor server
3. Check the browser console for any compilation errors

## Example

See `imports/ui/entry/Sample.jsx` and `imports/ui/entry/Sample.module.css` for a working example.

## Package Information

This setup uses a custom CSS modules implementation built specifically for modern Meteor versions, avoiding the deprecated `addStyles` API that causes issues with older packages.
