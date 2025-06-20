# Spectrum Card Component Development

This directory contains the source files for developing the Spectrum Card component for Adobe Edge Delivery Services (EDS). This component uses the EDS query-index.json pattern to fetch and display dynamic content with enhanced features including numbered slide badges and modal overlay functionality.

## Quick Start

1. **Start Development**

   ```bash
   npm install
   npm run dev
   ```

   Opens <http://localhost:5173> with hot reload for development.

2. **Build for Production**

   ```bash
   npm run build  # Creates bundled version in dist/
   npm run build:component  # Bundles dependencies and copies to blocks directory
   ```

   This process:
   - Bundles all Spectrum Web Components into a single file
   - Creates browser-compatible files in `dist/` directory
   - Copies bundled files to `/blocks/spectrum-card/` for EDS deployment
   - Ensures compatibility with direct browser usage (file:// protocol)

## Files

- **spectrum-card.js** - Main component with query-index.json integration and enhanced features
- **spectrum-card.css** - Component styles
- **index.html** - Local testing page demonstrating the query-index pattern
- **package.json** - Dependencies, scripts, and proxy configuration
- **vite.config.js** - Development server configuration

## Enhanced Features

### Numbered Slide Badges

Each card displays a numbered badge in the top-left corner using Spectrum blue (#0265DC) styling:

- **Visual Hierarchy**: Clear slide ordering and navigation
- **Professional Styling**: Circular badges with proper contrast
- **Responsive Design**: Adapts to different card sizes
- **Accessibility**: Screen reader compatible numbering

### Immersive Modal Overlay System

Clicking "Read More" opens a full-screen immersive modal with background imagery:

- **Immersive Design**: Full-screen modal with background image from card content
- **Glassmorphism Effects**: Translucent elements with backdrop blur for modern aesthetics
- **Hero Layout**: Large typography with gradient overlay for optimal readability
- **Dynamic Content**: Fetches complete `.plain.html` content and displays as styled text
- **Multiple Close Methods**: Glassmorphism close button, click outside, ESC key support
- **Responsive Layout**: Adapts to mobile screens with adjusted typography and spacing
- **Loading States**: Elegant loading feedback during content fetching
- **Error Handling**: Graceful fallbacks when content is unavailable</search>
</search_and_replace>

### Content Loading Architecture

The component uses a dual-loading approach:

- **Card Data**: From `query-index.json` for card previews and metadata
- **Full Content**: From `.plain.html` endpoints for modal display
- **Async Operations**: Non-blocking content loading with proper error handling
- **Caching**: Browser-level caching for improved performance

## Query-Index Pattern

This component follows the EDS query-index.json pattern described in `/docs/json-prd.md`. Instead of reading static content from the DOM, it fetches dynamic data from EDS query-index endpoints.

### Data Source

The component fetches data from query-index.json endpoints:

- **Default**: `/slides/query-index.json`
- **Custom**: Configurable via block content

### Expected Data Format

```json
{
  "total": 3,
  "offset": 0,
  "limit": 3,
  "data": [
    {
      "path": "/slides/slide-1",
      "title": "Slide Title",
      "description": "Slide description text",
      "image": "/slides/media_123.png",
      "buttonText": "Learn More",
      "lastModified": "1719573871"
    }
  ],
  "columns": ["path", "title", "description", "image", "buttonText", "lastModified"],
  ":type": "sheet"
}
```

## Usage in EDS

### Basic Usage

Create a block in your EDS document:

```bash
| spectrum-card |
| :---- |
```

This will fetch data from the default `/slides/query-index.json` endpoint.

### Custom Query Path

Specify a custom query-index.json endpoint:

```bash
| spectrum-card |
| :---- |
| /custom/query-index.json |
```

### Setting Up Content

1. **Create Content Folder**: Create a folder in your EDS project (e.g., `/slides/`, `/products/`)
2. **Add Content Pages**: Create individual pages for each slide
3. **Create Query Index**: Add a `query-index.xlsx` file to the folder
4. **Configure Metadata**: Ensure each page has the required metadata fields
5. **Publish**: Publish the query-index to generate the JSON endpoint

## Component Structure

The component expects content in this order from the query-index data:

1. **path** - Link destination when card is clicked
2. **title** - Card heading
3. **description** - Card body text
4. **image** (optional) - Card preview image
5. **buttonText** (optional) - Action button label

## Development Configuration

### Proxy Setup

The `vite.config.js` includes proxy configuration for development:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/slides': {
        target: 'https://allabout.network',
        changeOrigin: true,
        secure: true
      }
    }
  }
});
```

This handles CORS issues during development by proxying `/slides` requests to the EDS instance at `https://allabout.network`.

### Environment Handling

- **Development**: Uses proxy to avoid CORS issues
- **Production**: Uses relative paths for same-origin deployment

## Testing Different Content

Edit the `index.html` file to test different scenarios:

1. **Default endpoint**: Uses `/slides/query-index.json`
2. **Custom endpoint**: Uses `data-query-path` attribute
3. **Error handling**: Tests network failures and empty data

## Configuration

The component includes a configuration object:

```javascript
const SPECTRUM_CARD_CONFIG = {
  CARD_VARIANT: 'quiet',
  BUTTON_TREATMENT: 'accent',
  BUTTON_SIZE: 'm',
  MAX_WIDTH: '400px',
  DEFAULT_TITLE: 'Card Title',
  DEFAULT_DESCRIPTION: 'Card description',
  DEFAULT_BUTTON_TEXT: 'Learn More',
  QUERY_INDEX_PATH: '/slides/query-index.json',
};
```

Modify these values to customize the component's appearance and behavior.

## Features

### Enhanced User Experience

- **Numbered Slide Badges**: Visual hierarchy with Spectrum blue styling
- **Immersive Modal System**: Full-screen content display with background imagery
- **Glassmorphism Design**: Modern translucent elements with backdrop blur effects
- **Hero Typography**: Large-scale text with gradient overlays for impact
- **Dynamic Content Loading**: Complete `.plain.html` content rendered as styled text
- **Multiple Close Methods**: Glassmorphism close button, click outside, ESC key support
- **Cross-browser Compatibility**: Webkit prefixes for Safari support

### Performance Optimizations

- Lazy loading for images
- Efficient DOM manipulation with minimal reflows
- Responsive grid layout
- Error handling and loading states
- Async content loading with proper cleanup
- Browser-level caching for query-index and content

### Accessibility

- Proper semantic structure with ARIA labels
- Keyboard navigation support (ESC key, tab order)
- Screen reader compatibility with numbered slides
- Focus management in modal overlays
- ARIA attributes for interactive elements
- High contrast numbered badges

### Responsive Design

- Mobile-friendly grid layout
- Flexible card sizing with max-width constraints
- Touch-friendly interactions
- Immersive modal adapts to screen size (full-screen with responsive typography)
- Mobile-optimized modal layout with adjusted padding and font sizes
- Responsive badge positioning

## Troubleshooting

### Component not loading data

- Check browser console for fetch errors
- Verify query-index.json endpoint is accessible
- Ensure proxy configuration is correct for development
- Check CORS headers for production deployment

### Cards not rendering

- Verify bundled Spectrum dependencies are loaded (check blocks/spectrum-card.js contains bundled code)
- Check that `decorate` function is being called
- Ensure `sp-theme` wrapper is present with `system="spectrum"`
- Verify numbered badges are positioned correctly
- Test by opening `server.html` directly in browser to check EDS compatibility

### Modal not opening

- Check browser console for JavaScript errors
- Verify `.plain.html` endpoints are accessible
- Check that modal event listeners are properly attached
- Ensure background images are loading correctly

### Modal content not loading

- Verify the `path` field in query-index data is correct
- Check that `.plain.html` endpoints return valid HTML
- Ensure proxy configuration handles content requests
- Check browser network tab for failed content requests
- Verify glassmorphism effects are rendering (backdrop-filter support)

### Modal styling issues

- Check browser support for backdrop-filter (webkit prefixes included)
- Verify background images are accessible and loading
- Ensure gradient overlays are rendering correctly
- Check responsive breakpoints for mobile devices

### Image not displaying

- Check image URL is valid and accessible
- Verify image path in query-index data
- Check browser network tab for failed image requests

### CORS Issues

- Development: Ensure proxy is configured in vite.config.js
- Production: Verify CORS headers or use same-origin deployment
- Check browser console for CORS-related errors
- Verify both query-index and .plain.html endpoints are accessible

### Numbered badges not showing

- Check CSS positioning and z-index values
- Verify Spectrum blue color (#0265DC) is applied
- Ensure badge container has proper relative positioning

## Performance

The component is optimized for performance:

- **Tree-shaking**: Removes unused Spectrum components
- **Lazy loading**: Images load only when needed
- **Efficient rendering**: Minimal DOM operations
- **Caching**: Browser caches query-index responses
- **Progressive enhancement**: Works without JavaScript for basic content

## Browser Support

Supports all modern browsers that support:

- ES Modules
- Web Components
- CSS Custom Properties
- Fetch API
- Intersection Observer (for lazy loading)

## Related Documentation

- [`/docs/json-prd.md`](../../docs/json-prd.md) - Complete query-index.json pattern documentation
- [`/docs/blog.md`](../../docs/blog.md) - Implementation tutorial and examples
- [`/BUILD_PROCESS.md`](../../BUILD_PROCESS.md) - Build process documentation
