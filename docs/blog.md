# Building Spectrum Components for Adobe Edge Delivery Services

Adobe's Edge Delivery Services takes a document-first approach to web development. But that doesn't mean you're limited to basic HTML. You can build professional interfaces using Spectrum Web Components - Adobe's own design system built on web standards.

## Why Spectrum Components Fit EDS Perfectly

Spectrum Web Components give you professional UI elements that work straight away. You get theming, responsive design, keyboard navigation, and screen reader support without extra work. They slot naturally into EDS's block-based architecture.

The components follow Adobe's design language, so your blocks look and feel like native Adobe experiences. Better yet, they're web standards-based, meaning no framework lock-in or complex build processes.

## Creating a Dynamic Card Block with Query-Index Integration

Let's build a real example - a card component that fetches dynamic content from EDS query-index.json endpoints. This follows the modern EDS pattern for content-driven applications described in our [Query-Index PRD](json-prd.md).

Here's what the development structure looks like:

`/build/spectrum-card/`  
`├── spectrum-card.js`  
`├── spectrum-card.css`  
`├── index.html`  
`├── package.json`  
`├── vite.config.js`  
`└── README.md`

This is your development environment. The `/blocks/` directory is created automatically when you build.

## Development Workflow

### 1. Start Development

```bash
cd build/spectrum-card
npm install          # First time only
npm run dev         # Starts http://localhost:5173
```

### 2. Edit Component Files

- **Logic**: `spectrum-card.js` - Query-index.json integration
- **Styles**: `spectrum-card.css` - Component styling  
- **Test**: `index.html` - Test different query endpoints

### 3. Deploy Changes

```bash
npm run build:component  # Copies to /blocks/ for EDS
```

## The Query-Index Pattern

Instead of reading static content from the DOM, this component fetches dynamic data from EDS query-index.json endpoints. This enables content-driven applications with excellent performance.

### Data Source Configuration

```javascript
// Default endpoint
const QUERY_INDEX_PATH = '/slides/query-index.json';

// Custom endpoint via block content
| spectrum-card |
| :---- |
| /products/query-index.json |
```

### Expected Data Format

The component expects query-index.json to return data in this format:

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

### The Main Component File

```javascript
// spectrum-card.js

// Import Spectrum Web Components
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/theme-light.js';
import '@spectrum-web-components/theme/scale-medium.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-arrow-right.js';

// Configuration
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

// Fetch content from EDS query-index.json
async function fetchCardData(queryPath) {
  try {
    const response = await fetch(queryPath, {
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch card data: ${response.status}`);
    }
    
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error('[spectrum-card] fetch error:', error);
    return [];
  }
}

// Create a single card element from data
function createCard(cardData) {
  const card = document.createElement('sp-card');
  card.setAttribute('heading', cardData.title || SPECTRUM_CARD_CONFIG.DEFAULT_TITLE);
  card.setAttribute('variant', SPECTRUM_CARD_CONFIG.CARD_VARIANT);
  card.style.maxWidth = SPECTRUM_CARD_CONFIG.MAX_WIDTH;

  // Add image if available
  if (cardData.image) {
    const img = document.createElement('img');
    img.setAttribute('slot', 'preview');
    img.src = cardData.image;
    img.alt = cardData.title || '';
    img.loading = 'lazy'; // Performance optimization
    card.appendChild(img);
  }

  // Add description and footer with button
  const descriptionDiv = document.createElement('div');
  descriptionDiv.setAttribute('slot', 'description');
  descriptionDiv.textContent = cardData.description || SPECTRUM_CARD_CONFIG.DEFAULT_DESCRIPTION;
  card.appendChild(descriptionDiv);

  const footerDiv = document.createElement('div');
  footerDiv.setAttribute('slot', 'footer');
  const button = document.createElement('sp-button');
  button.setAttribute('treatment', SPECTRUM_CARD_CONFIG.BUTTON_TREATMENT);
  button.textContent = cardData.buttonText || SPECTRUM_CARD_CONFIG.DEFAULT_BUTTON_TEXT;
  
  // Navigate to card's page on click
  button.addEventListener('click', () => {
    if (cardData.path) {
      window.location.href = cardData.path;
    }
  });
  
  footerDiv.appendChild(button);
  card.appendChild(footerDiv);
  return card;
}

// The decorate function is called by Franklin/EDS for this block
export default async function decorate(block) {
  try {
    const queryPath = block.dataset.queryPath || SPECTRUM_CARD_CONFIG.QUERY_INDEX_PATH;
    block.textContent = '';
    
    // Add loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.textContent = 'Loading cards...';
    block.appendChild(loadingDiv);
    
    // Fetch and render cards
    const cardData = await fetchCardData(queryPath);
    block.removeChild(loadingDiv);
    
    if (cardData.length === 0) {
      block.textContent = 'No cards available';
      return;
    }
    
    // Create responsive grid container
    const cardsContainer = document.createElement('div');
    cardsContainer.style.display = 'grid';
    cardsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    cardsContainer.style.gap = '20px';
    
    // Create cards from data
    for (const item of cardData) {
      const card = createCard(item);
      cardsContainer.appendChild(card);
    }
    
    block.appendChild(cardsContainer);
    
  } catch (err) {
    console.error('[spectrum-card] decorate error', err);
    block.textContent = 'Error loading cards';
  }
}
```

### Testing Your Component Locally

The development environment includes hot reload and live preview. The `index.html` file demonstrates the query-index pattern:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Spectrum Card Test - Query Index Pattern</title>
  <script type="module">
    import '@spectrum-web-components/theme/theme-light.js';
    import '@spectrum-web-components/theme/scale-medium.js';
    import '@spectrum-web-components/theme/sp-theme.js';
  </script>
</head>
<body>
  <sp-theme color="light" scale="medium" system="spectrum">
    <div class="test-container">
      
      <!-- Default endpoint test -->
      <div class="spectrum-card block"></div>
      
      <!-- Custom endpoint test -->
      <div class="spectrum-card block">
        <div>/products/query-index.json</div>
      </div>
      
    </div>
  </sp-theme>
  
  <script type="module">
    import decorate from './spectrum-card.js';
    document.querySelectorAll('.spectrum-card.block').forEach(decorate);
  </script>
</body>
</html>
```

### Development Configuration

The component includes proxy configuration for development to handle CORS:

```json
{
  "proxy": "https://allabout.network"
}
```

This configuration:

- Forwards API requests to your EDS instance during development
- Prevents CORS issues by making requests appear same-origin
- Only affects development environment
- Production deployments use direct relative paths

### Vite Configuration

```javascript
import { defineConfig } from 'vite';
export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    host: true
  },
  build: {
    lib: {
      entry: 'spectrum-card.js',
      name: 'SpectrumCard',
      fileName: () => 'spectrum-card.js',
      formats: ['es']
    },
    outDir: 'dist',
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    emptyOutDir: true
  }
});
```

## Building a Component in a Page

Create a block in your EDS document:

### Basic Usage

```bash
| spectrum-card |
| :---- |
```

### Custom Query Path

```bash
| spectrum-card |
| :---- |
| /products/query-index.json |
```

## Setting Up Content

1. **Create Content Folder**: Create a folder in your EDS project (e.g., `/slides/`, `/products/`)
2. **Add Content Pages**: Create individual pages for each slide
3. **Create Query Index**: Add a `query-index.xlsx` file to the folder with required columns
4. **Configure Metadata**: Ensure each page has the required metadata fields
5. **Publish**: Publish the query-index to generate the JSON endpoint

## How EDS Integration Works

When you deploy your block to `/blocks/spectrum-card/`, EDS automatically calls your `decorate` function for each block instance on the page. The block fetches content from the specified query-index.json endpoint and transforms it into fully interactive Spectrum cards.

The beauty of this approach lies in its flexibility. Authors manage content through familiar document editing tools and spreadsheets, while visitors see polished, accessible components that match Adobe's design standards.

## Build Process

The project uses a streamlined build process:

1. **Development**: Work in `/build/spectrum-card/` with full Vite tooling
2. **Testing**: Hot reload at <http://localhost:5173> with instant feedback
3. **Building**: `npm run build:component` copies files to `/blocks/` directory
4. **Deployment**: Copy files from `/blocks/spectrum-card/` to your EDS project

The `/build/` directory contains your source code and development environment. The `/blocks/` directory is ephemeral build output, ready for EDS deployment.

## Performance Considerations

Vite handles the heavy lifting of optimization. It tree-shakes unused code from Spectrum components, ensuring you only ship what you actually use. The components themselves are built for performance, with efficient rendering and minimal runtime overhead.

The query-index pattern provides excellent performance:

- **Cached responses**: Browser caches JSON responses
- **Lazy loading**: Images load only when needed
- **Progressive enhancement**: Works without JavaScript for basic content
- **Efficient rendering**: Minimal DOM operations

Every interactive element works with keyboards by default. Screen readers announce content properly. Focus indicators appear where expected. These aren't features you add - they come built in.

## Common Issues and Solutions

### Component not loading data

- Check browser console for fetch errors
- Verify query-index.json endpoint is accessible
- Ensure proxy configuration is correct for development
- Check CORS headers for production deployment

### Cards not rendering

- Verify Spectrum dependencies are loaded
- Check that `decorate` function is being called
- Ensure `sp-theme` wrapper is present with `system="spectrum"`

### CORS Issues

- Development: Ensure proxy is configured in package.json
- Production: Verify CORS headers or use same-origin deployment
- Check browser console for CORS-related errors

## Development Features

- **Live Preview**: See component as it appears in EDS
- **Hot Reload**: Changes update instantly without refresh
- **Debug Logs**: Component logs fetch and rendering steps
- **Spectrum Integration**: Full Adobe design system with theming
- **Responsive Testing**: Test mobile and desktop layouts
- **Error Handling**: Graceful handling of network failures and empty data

## Moving Beyond Basic Cards

This card example shows the pattern, but you can build far more complex interfaces. The query-index pattern works for any content type:

- **Product Catalogs**: Fetch product data with prices, categories, and images
- **Blog Posts**: Display articles with authors, dates, and categories
- **Team Members**: Show staff with roles, departments, and contact info
- **Events**: List upcoming events with dates, locations, and registration

Each follows the same integration pattern: create content, configure query-index, fetch and render. The real power comes from combining EDS's document-driven approach with Spectrum's component library and the flexibility of query-index.json for dynamic content.

Authors work in familiar tools while developers build sophisticated experiences. Everyone wins - especially your users who get fast, accessible, professional interfaces that work everywhere, with Adobe's design language and tested components.

---

| metadata |  |
| :---- | :---- |
| title | Building Spectrum Components for Adobe Edge Delivery Services |
| description | Learn how to create dynamic UI components for EDS using Adobe Spectrum Web Components and the query-index.json pattern, with practical examples and testing strategies. |
| image |  |
| author | Tom Cranstoun |
| longdescription | Adobe Edge Delivery Services and Spectrum Web Components work brilliantly together with the query-index.json pattern. This guide walks through building a dynamic card component that fetches content from EDS endpoints, setting up local testing with proxy configuration, and deploying to production. You'll learn the complete workflow from project setup to troubleshooting common issues, with code examples you can use immediately. Perfect for developers who want to build sophisticated, content-driven interfaces while keeping EDS's document-first simplicity. |
