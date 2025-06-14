# Spectrum Card Component for Adobe Edge Delivery Services

This project demonstrates how to build professional UI components for Adobe Edge Delivery Services (EDS) using Spectrum Web Components - Adobe's design system built on web standards.

## Project Structure

```bash
spectrum-with-eds/
├── build/spectrum-card/           # 🔧 Development source files
│   ├── spectrum-card.js           # Component source code
│   ├── spectrum-card.css          # Component styles
│   ├── index.html                 # Local testing page
│   ├── package.json               # Dev dependencies & scripts
│   ├── vite.config.js             # Development server config
│   └── README.md                  # Component documentation
├── blocks/spectrum-card/          # 📦 Built output (ephemeral)
│   ├── spectrum-card.js           # EDS-ready component
│   └── spectrum-card.css          # EDS-ready styles
├── docs/
│   └── blog.md                    # Complete tutorial & documentation
├── scripts/
│   └── build-component.js         # Build automation
└── BUILD_PROCESS.md               # Detailed build documentation
```

## Quick Start

### 🚀 How to Develop This Block

1. **Start Development Server**

   ```bash
   cd build/spectrum-card
   npm install          # First time only
   npm run dev         # Starts http://localhost:5173
   ```

2. **Edit Component Files**
   - **Logic**: [`build/spectrum-card/spectrum-card.js`](build/spectrum-card/spectrum-card.js) - Query-index.json integration
   - **Styles**: [`build/spectrum-card/spectrum-card.css`](build/spectrum-card/spectrum-card.css) - Component styling  
   - **Test**: [`build/spectrum-card/index.html`](build/spectrum-card/index.html) - Test different query endpoints

3. **Query-Index Pattern**
   This component uses EDS query-index.json endpoints for dynamic content:

   ```javascript
   // Default endpoint: /slides/query-index.json
   // Custom endpoint via block content
   ```

   Expected data format:

   ```json
   {
     "data": [
       {
         "path": "/slides/slide-1",
         "title": "Slide Title", 
         "description": "Slide description",
         "image": "/slides/image.png",
         "buttonText": "Learn More"
       }
     ]
   }
   ```

4. **Deploy Changes**

   ```bash
   npm run build:component  # Copies to /blocks/ for EDS
   ```

### Development Features

- ✅ **Live Preview** - See component as it appears in EDS
- ✅ **Hot Reload** - Changes update instantly
- ✅ **Debug Logs** - Component logs in browser console
- ✅ **Spectrum Integration** - Full Adobe design system

### Key Concepts

- **`/build/spectrum-card/`** - Primary development environment with Vite tooling and dependencies
- **`/blocks/spectrum-card/`** - Build output, ready for EDS deployment (ephemeral, git-ignored)
- **Root level** - Minimal project coordination, no dependencies needed
- **Component follows EDS block pattern** - Uses `decorate` function to transform DOM
- **Spectrum Web Components** - Professional Adobe design system integration

## Component Usage in EDS

Create a table in your EDS document:

```bash
| spectrum-card |
| :---- |
| https://example.com/image.png |
| Card Title |
| Card description text |
| Button Text |
```

EDS automatically transforms this into a fully interactive Spectrum card component.

## Features

- ✅ **Modern JavaScript** - ES Modules, no TypeScript compilation needed
- ✅ **Spectrum Design System** - Professional Adobe UI components
- ✅ **Built-in Accessibility** - Keyboard navigation, screen readers, ARIA
- ✅ **Responsive Design** - Mobile-friendly with CSS custom properties
- ✅ **Development Tools** - Hot reload, error logging, easy testing
- ✅ **Performance Optimized** - Tree-shaking, minimal runtime overhead

## Documentation

- [`docs/blog.md`](docs/blog.md) - Complete tutorial and implementation guide
- [`BUILD_PROCESS.md`](BUILD_PROCESS.md) - Detailed build process documentation
- [`build/spectrum-card/README.md`](build/spectrum-card/README.md) - Component-specific docs

## Architecture

This project demonstrates the integration of:

1. **Adobe Spectrum Web Components** - Professional design system
2. **Adobe Edge Delivery Services** - Document-first web development
3. **Modern Web Standards** - ES Modules, Web Components, CSS Custom Properties
4. **Development Best Practices** - Hot reload, testing, documentation

The result is a professional component development workflow that maintains EDS's simplicity while providing sophisticated UI capabilities.

## Browser Support

Supports all modern browsers with:

- ES Modules
- Web Components
- CSS Custom Properties

## License

MIT
