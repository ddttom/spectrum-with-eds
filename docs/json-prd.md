# Product Requirements Document: Building Applications with EDS query-index.json

## Overview

This document outlines the requirements and implementation guidelines for building applications that leverage Edge Delivery Services (EDS) query-index.json feature. While this document uses a slideshow as an example implementation, the pattern can be adapted for any content type including:

- Product catalogs
- Blog posts
- News articles
- Portfolio items
- Team members
- Events
- Locations
- Any other content-driven application

This approach enables developers to create dynamic, content-driven applications while maintaining excellent performance metrics.

## Example Implementation

Throughout this document, we'll reference a slideshow implementation as an example, but the same principles apply to any content type. For instance:

- Slides → Products
- Slide pages → Product pages
- Slide metadata → Product metadata
- Slide content → Product details

## Core Features

### 1. Content Structure

- Content must be organized in Google Drive folders (e.g., `/products/`, `/blog/`, `/team/`)
- Each content item must be a published page in EDS
- Required metadata fields for each page (customize based on content type):
  - Title
  - Description
  - Image (if applicable)
  - Last Modified Date
  - Path
  - Additional fields specific to your content type (e.g., price, date, category)

### 2. Query Index Requirements

- Must be implemented as a Google Sheets document
- Must be placed in the same folder as content pages
- Required columns must match page metadata fields
- Sheet must be published to generate query-index.json
- JSON endpoint will be available at: `/{folder-path}/query-index.json`
- Example folder structures:

  ```bash
  /products/
    ├── query-index.xlsx
    ├── product-1/
    ├── product-2/
    └── product-3/

  /blog/
    ├── query-index.xlsx
    ├── post-1/
    ├── post-2/
    └── post-3/

  /team/
    ├── query-index.xlsx
    ├── member-1/
    ├── member-2/
    └── member-3/
  ```

### 3. Technical Requirements

#### 3.1 Development Configuration

##### Local Development Setup

For local development, you'll need to configure a proxy to avoid CORS issues. This is especially important when working with Edge Delivery Services endpoints.

```json
// package.json
{
  "proxy": "https://allabout.network"
}
```

This configuration:

- Forwards API requests to your EDS instance during development
- Prevents CORS issues by making requests appear same-origin
- Only affects development environment
- Production deployments use direct relative paths

##### CORS Implementation

###### Development Environment

During development, CORS is handled through the proxy configuration in package.json:

```json
{
  "proxy": "https://allabout.network"
}
```

This setup:

- Automatically handles CORS headers
- Makes requests appear same-origin
- Requires no additional CORS configuration
- Works with all modern development servers (Create React App, Vite, etc.)

###### Production Environment

In production, you need to handle CORS explicitly. There are two main approaches:

####### **Same-Origin Deployment**

```javascript
// If your app is deployed to the same domain as EDS
const response = await fetch('/slides/query-index.json');
```

####### **Cross-Origin Deployment**

```javascript
// If your app is deployed to a different domain
const response = await fetch('https://allabout.network/slides/query-index.json', {
  credentials: 'include', // If using cookies
  headers: {
    'Accept': 'application/json',
    // Add any required custom headers
  }
});
```

###### CORS Headers

The EDS server will respond with appropriate CORS headers:

```http
Access-Control-Allow-Origin: https://your-domain.com
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

###### Error Handling

Implement proper CORS error handling:

```javascript
async function fetchWithCorsHandling(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      mode: 'cors', // Explicitly request CORS mode
    });

    if (!response.ok) {
      if (response.status === 0) {
        // CORS error - no response received
        throw new Error('CORS error: Request blocked by browser');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('CORS')) {
      console.error('CORS error:', error);
      // Handle CORS error appropriately
      throw new Error('Unable to access resource due to CORS policy');
    }
    throw error;
  }
}

// Usage
try {
  const response = await fetchWithCorsHandling('https://allabout.network/slides/query-index.json');
  const data = await response.json();
} catch (error) {
  // Handle CORS or other errors
  console.error('Failed to fetch data:', error);
}
```

###### Preflight Requests

For complex requests, handle OPTIONS preflight:

```javascript
// Server-side CORS configuration (if you control the server)
app.options('/slides/query-index.json', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://your-domain.com');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(204);
});
```

###### Security Considerations

1. **Origin Validation**
   - Validate allowed origins
   - Use environment variables for origin configuration
   - Implement strict origin checking

2. **Headers**
   - Only allow necessary headers
   - Validate custom headers
   - Use secure headers

3. **Credentials**
   - Use `credentials: 'include'` only when necessary
   - Implement proper cookie handling
   - Consider security implications

4. **Cache Control**
   - Implement proper caching headers
   - Consider CORS preflight caching
   - Handle cache invalidation

###### Testing CORS

```javascript
// Test CORS configuration
async function testCorsConfiguration() {
  const testUrls = [
    'https://allabout.network/slides/query-index.json',
    // Add other endpoints to test
  ];

  for (const url of testUrls) {
    try {
      const response = await fetch(url, {
        method: 'OPTIONS',
        mode: 'cors',
      });
      
      console.log(`CORS test for ${url}:`, {
        status: response.status,
        headers: {
          'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
          'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
          'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
        }
      });
    } catch (error) {
      console.error(`CORS test failed for ${url}:`, error);
    }
  }
}
```

##### Proxy Example Implementation

Using the sample query-index.json from allabout.network:

```javascript
// Development (with proxy)
const response = await fetch('/slides/query-index.json');

// Production (direct path)
const response = await fetch('https://allabout.network/slides/query-index.json');
```

The sample endpoint returns:

```javascript
{
  "total": 5,
  "offset": 0,
  "limit": 5,
  "data": [
    {
      "path": "/slides/york-minster",
      "title": "York Minster",
      "image": "/slides/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png?width=1200&format=pjpg&optimize=medium",
      "description": "A magnificent Gothic cathedral with centuries of history and breathtaking architecture",
      "lastModified": "1719573871"
    },
    // ... additional items
  ],
  "columns": ["path", "title", "image", "description", "lastModified"],
  ":type": "sheet"
}
```

## Slides Endpoint Implementation

The `/slides/query-index.json` endpoint serves as the primary example implementation for this project. This endpoint demonstrates how to structure content for slideshow or card-based presentations.

### Slides Content Structure

The slides implementation follows this structure:

```bash
/slides/
├── query-index.xlsx          # Metadata spreadsheet
├── york-minster/            # Individual slide pages
├── durham-cathedral/
├── lincoln-cathedral/
├── canterbury-cathedral/
└── winchester-cathedral/
```

### Slides Metadata Schema

Each slide in the query-index includes these fields:

- **path**: `/slides/{slide-name}` - Link to the full slide page
- **title**: Display title for the slide
- **image**: Hero image URL with optimization parameters
- **description**: Brief description or summary
- **lastModified**: Unix timestamp of last update
- **buttonText** (optional): Custom action button text

### Slides Query-Index Configuration

The slides query-index.xlsx spreadsheet contains:

| path | title | image | description | lastModified | buttonText |
|------|-------|-------|-------------|--------------|------------|
| /slides/york-minster | York Minster | /slides/media_123.png | A magnificent Gothic cathedral... | 1719573871 | Learn More |

### Usage with Spectrum Card Component

The Spectrum Card component uses the slides endpoint as its default:

```javascript
// Default configuration
const QUERY_INDEX_PATH = '/slides/query-index.json';
```

**Basic usage (uses slides endpoint):**

```bash
| spectrum-card |
| :---- |
```

**Custom endpoint:**

```bash
| spectrum-card |
| :---- |
| /products/query-index.json |
```

### Slides Content Benefits

The slides implementation provides:

1. **Rich Visual Content**: High-quality images with automatic optimization
2. **Structured Metadata**: Consistent schema across all slides
3. **Performance Optimized**: Lazy loading and responsive images
4. **Accessible**: Screen reader friendly with proper alt text
5. **Interactive**: Click-through to detailed slide pages

#### Environment-Specific Configuration

```javascript
// config.js
const config = {
  development: {
    baseUrl: '', // Uses proxy
    queryIndexPath: '/slides/query-index.json'
  },
  production: {
    baseUrl: 'https://allabout.network',
    queryIndexPath: '/slides/query-index.json'
  }
};

export const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return config[env];
};

// Usage
const { baseUrl, queryIndexPath } = getConfig();
const response = await fetch(`${baseUrl}${queryIndexPath}`);
```

#### 3.2 Data Fetching

```javascript
async function fetchContent() {
  const response = await fetch('/{folder-path}/query-index.json');
  if (!response.ok) {
    throw new Error('Failed to fetch content index');
  }
  const json = await response.json();
  return json.data;
}
```

#### 3.3 Content Enrichment

- Use `.plain.html` endpoint for full content retrieval
- Implement responsive content loading:
  - Mobile: Load basic metadata only
  - Desktop: Optionally load full HTML content
- Cache responses where appropriate

#### 3.4 Performance Requirements

- Initial page load must maintain Lighthouse scores:
  - Performance: 90+
  - Accessibility: 95+
  - Best Practices: 95+
  - SEO: 95+
- Implement lazy loading for images and heavy content
- Use intersection observer for viewport-based loading
- Support WebP images with fallbacks

### 4. Implementation Guidelines

#### 4.1 Basic Implementation

```javascript
async function initializeApp() {
  try {
    // Replace 'slides' with your content type (e.g., 'products', 'blog', 'team')
    const content = await fetchContent();
    const container = document.querySelector('#content-container');
    
    // Customize rendering based on content type
    for (const item of content) {
      const element = await createContentElement(item);
      container.appendChild(element);
    }
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}

// Example of content-type specific rendering
async function createContentElement(item) {
  const element = document.createElement('div');
  element.classList.add('content-item');
  
  // Basic content for all devices - customize based on content type
  element.innerHTML = `
    <h2>${item.title}</h2>
    <p>${item.description}</p>
    ${item.price ? `<p class="price">${item.price}</p>` : ''}
    ${item.date ? `<p class="date">${item.date}</p>` : ''}
    ${item.category ? `<p class="category">${item.category}</p>` : ''}
  `;
  
  // Enhanced content for desktop
  if (window.innerWidth > 799 && item.path) {
    const fullContent = await fetchPlainHtml(item.path);
    if (fullContent) {
      element.dataset.fullContent = fullContent;
    }
  }
  
  return element;
}
```

#### 4.3 Plain HTML Fetching

```javascript
async function fetchPlainHtml(path) {
  try {
    const response = await fetch(`${path}.plain.html`);
    if (!response.ok) {
      throw new Error(`Failed to fetch HTML for: ${path}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching plain HTML:', error);
    return null;
  }
}
```

### 5. Best Practices

#### 5.1 Content Management

- Keep content structure flat and organized
- Use consistent naming conventions
- Maintain metadata consistency
- Regular validation of query-index structure

#### 5.2 Performance Optimization

- Implement proper caching strategies
- Use responsive images
- Minimize DOM operations
- Implement proper error handling
- Use progressive enhancement

#### 5.3 Security Considerations

- Validate all fetched content
- Sanitize HTML content
- Implement proper CORS policies
- Handle authentication if required

#### 5.4 Development Environment

- Use proxy configuration for local development
- Implement environment-specific configurations
- Test both development and production paths
- Validate CORS settings in production
- Use relative paths in production code
- Implement proper error handling for network requests
- Cache responses appropriately for development
- Implement proper CORS error handling and testing
- Validate CORS headers in both development and production
- Monitor CORS-related errors in production
- Use appropriate CORS mode for different environments
- Consider security implications of CORS configuration
- Implement proper preflight request handling
- Test CORS configuration across different browsers

### 6. Testing Requirements

- Unit tests for data fetching
- Integration tests for content rendering
- Performance testing
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility testing

### 7. Monitoring and Maintenance

- Implement error tracking
- Monitor performance metrics
- Track content update frequency
- Monitor API response times
- Implement logging for debugging

## Content Type Examples

### Product Catalog

```javascript
// Example product metadata
{
  path: "/products/blue-widget",
  title: "Blue Widget",
  description: "A fantastic blue widget",
  price: "$99.99",
  category: "Widgets",
  image: "/products/media_123.png",
  lastModified: "1719573871"
}
```

### Blog Posts

```javascript
// Example blog post metadata
{
  path: "/blog/my-article",
  title: "My Article",
  description: "An interesting article",
  author: "John Doe",
  publishDate: "2024-03-20",
  category: "Technology",
  image: "/blog/media_456.png",
  lastModified: "1719573871"
}
```

### Team Members

```javascript
// Example team member metadata
{
  path: "/team/john-doe",
  title: "John Doe",
  description: "Senior Developer",
  role: "Engineering",
  department: "Product",
  image: "/team/media_789.png",
  lastModified: "1719573871"
}
```

## Adapting the Pattern

### 1. Content Type Analysis

Before implementation, analyze your content type to determine:

- Required metadata fields
- Content structure
- Display requirements
- User interaction needs
- Performance considerations

### 2. Implementation Steps

1. Create your content folder structure
2. Define your metadata requirements
3. Create and publish your query-index
4. Implement the basic fetching pattern
5. Customize the rendering logic
6. Add content-type specific features
7. Implement performance optimizations

### 3. Common Adaptations

- Add filtering and sorting
- Implement search functionality
- Add pagination or infinite scroll
- Include category navigation
- Add related content features
- Implement content previews

## Success Metrics

- Lighthouse scores maintained above thresholds
- Content load time under 2 seconds
- Zero critical security vulnerabilities
- 100% uptime for content delivery
- Successful content updates within 5 minutes of publishing

## Limitations

- Content must be published to be available in query-index.json
- Updates to query-index require republishing
- Maximum of 1000 items per query-index
- Content structure must follow EDS requirements

## Future Considerations

- Support for real-time updates
- Enhanced caching strategies
- Additional metadata fields
- Improved mobile optimization
- Advanced content filtering
- Content type specific features
- Multi-language support
- Advanced search capabilities
- Content relationships and hierarchies
- Custom metadata schemas
