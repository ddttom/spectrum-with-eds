# Spectrum Card Component for Adobe Edge Delivery Services

This project demonstrates how to build professional UI components for Adobe Edge Delivery Services (EDS) using Spectrum Web Components - Adobe's design system built on web standards. The component features numbered slide badges and immersive full-screen modal overlays with glassmorphism effects for a modern, visually striking user experience.

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

- ✅ **Live Preview** - See component as it appears in EDS with numbered slides
- ✅ **Hot Reload** - Changes update instantly without refresh
- ✅ **Debug Logs** - Component logs fetch and rendering steps, including modal interactions
- ✅ **Spectrum Integration** - Full Adobe design system with theming and icons
- ✅ **Modal Testing** - Interactive modal system with real content loading
- ✅ **Proxy Support** - CORS handling for development with `https://allabout.network`

### Key Concepts

- **`/build/spectrum-card/`** - Primary development environment with Vite tooling and dependencies
- **`/blocks/spectrum-card/`** - Build output, ready for EDS deployment (ephemeral, git-ignored)
- **Root level** - Minimal project coordination, no dependencies needed
- **Component follows EDS block pattern** - Uses `decorate` function to transform DOM
- **Spectrum Web Components** - Professional Adobe design system integration

## Component Usage in EDS

Create a block in your EDS document:

### Basic Usage (uses default /slides/query-index.json)

```bash
| spectrum-card |
| :---- |
```

### Custom Query Path

```bash
| spectrum-card |
| :---- |
| /custom/query-index.json |
```

EDS automatically calls the component's `decorate` function, which fetches data from the specified query-index.json endpoint and renders interactive Spectrum cards.

## Enhanced Functionality

### Numbered Slide Badges

Each card displays a numbered badge in the top-left corner, providing visual hierarchy and slide ordering. The badges use Spectrum blue (#0265DC) with white text for optimal contrast and brand consistency.

### Immersive Modal Overlay System

Clicking "Read More" opens a full-screen immersive modal that:

- Displays full content from the corresponding `.plain.html` endpoint with stunning visual design
- Features background imagery from the card for visual impact
- Uses glassmorphism design with translucent elements and backdrop blur effects
- Includes hero-style typography with large-scale text and gradient overlays
- Provides slide number badge and close button with glassmorphism styling
- Supports multiple close methods (glassmorphism close button, click outside, ESC key)
- Adapts responsively to mobile devices with optimized typography and spacing
- Includes cross-browser compatibility with webkit prefixes for Safari support

### Content Loading

The component intelligently fetches content from EDS:

- **Card Data**: From `query-index.json` endpoints for card previews
- **Full Content**: From `.plain.html` endpoints for modal display
- **Error Handling**: Graceful fallbacks when content is unavailable
- **Loading States**: User feedback during content fetching

## Features

### Enhanced User Experience

- ✅ **Numbered Slide Badges** - Visual hierarchy indicators with Spectrum blue styling
- ✅ **Immersive Modal System** - Full-screen content display with background imagery
- ✅ **Glassmorphism Design** - Modern translucent elements with backdrop blur effects
- ✅ **Hero Typography** - Large-scale text with gradient overlays for visual impact
- ✅ **Dynamic Content Loading** - Fetches complete `.plain.html` content rendered as styled text
- ✅ **Multiple Close Methods** - Glassmorphism close button, click outside, and ESC key support
- ✅ **Cross-browser Compatibility** - Webkit prefixes for Safari support

### Technical Excellence

- ✅ **Modern JavaScript** - ES Modules, no TypeScript compilation needed
- ✅ **Spectrum Design System** - Professional Adobe UI components with icons
- ✅ **Built-in Accessibility** - Keyboard navigation, screen readers, ARIA support
- ✅ **Responsive Design** - Mobile-friendly with CSS custom properties
- ✅ **Development Tools** - Hot reload, error logging, proxy configuration
- ✅ **Performance Optimized** - Tree-shaking, minimal runtime overhead
- ✅ **Error Handling** - Graceful fallbacks for network failures and missing content

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
