# Spectrum Card Component Development

This directory contains the source files for developing the Spectrum Card component for Adobe Edge Delivery Services (EDS). This component uses the EDS query-index.json pattern to fetch and display dynamic content.

## Quick Start

1. **Start Development**

   ```bash
   npm install
   npm run dev
   ```

   Opens <http://localhost:5173> with hot reload for development.

2. **Build for Production**

   ```bash
   npm run build  # Optional: create optimized version
   npm run build:component  # Copy to blocks directory
   ```

   Copies files to `/blocks/spectrum-card/` for EDS deployment.

## Files

- **spectrum-card.js** - Main component with query-index.json integration
- **spectrum-card.css** - Component styles
- **index.html** - Local testing page demonstrating the query-index pattern
- **package.json** - Dependencies, scripts, and proxy configuration
- **vite.config.js** - Development server configuration

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

This will fetch data from the default `/cards/query-index.json` endpoint.

### Custom Query Path

Specify a custom query-index.json endpoint:

```bash
| spectrum-card |
| :---- |
| /products/query-index.json |
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

The `package.json` includes proxy configuration for development:

```json
{
  "proxy": "https://allabout.network"
}
```

This handles CORS issues during development by proxying requests to the EDS instance.

### Environment Handling

- **Development**: Uses proxy to avoid CORS issues
- **Production**: Uses relative paths for same-origin deployment

## Testing Different Content

Edit the `index.html` file to test different scenarios:

1. **Default endpoint**: Uses `/cards/query-index.json`
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
  QUERY_INDEX_PATH: '/cards/query-index.json',
};
```

Modify these values to customize the component's appearance and behavior.

## Features

### Performance Optimizations

- Lazy loading for images
- Efficient DOM manipulation
- Responsive grid layout
- Error handling and loading states

### Accessibility

- Proper semantic structure
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- ARIA attributes

### Responsive Design

- Mobile-friendly grid layout
- Flexible card sizing
- Touch-friendly interactions

## Troubleshooting

### Component not loading data

- Check browser console for fetch errors
- Verify query-index.json endpoint is accessible
- Ensure proxy configuration is correct for development
- Check CORS headers for production deployment

### Cards not rendering

- Verify Spectrum dependencies are loaded
- Check that `decorate` function is being called
- Ensure `sp-theme` wrapper is present with `system="spectrum"`

### Image not displaying

- Check image URL is valid and accessible
- Verify image path in query-index data
- Check browser network tab for failed image requests

### CORS Issues

- Development: Ensure proxy is configured in package.json
- Production: Verify CORS headers or use same-origin deployment
- Check browser console for CORS-related errors

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
