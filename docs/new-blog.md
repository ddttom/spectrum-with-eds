# Complete Tutorial: Building Professional Spectrum Components for Adobe Edge Delivery Services

A comprehensive guide to creating dynamic, accessible UI components using Adobe Spectrum Web Components and the EDS query-index.json pattern, with practical examples, troubleshooting, and advanced techniques.

## Table of Contents

1. [Prerequisites and Setup](#prerequisites-and-setup)
2. [Project Structure and Architecture](#project-structure-and-architecture)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Enhanced Features: Numbered Badges and Modals](#enhanced-features)
5. [Unusual Patterns and Technical Decisions](#unusual-patterns-and-technical-decisions)
6. [Testing and Debugging](#testing-and-debugging)
7. [Common Pitfalls and Troubleshooting](#troubleshooting)
8. [Customization Examples](#customization-examples)
9. [Performance Optimization](#performance-optimization)
10. [Accessibility Deep Dive](#accessibility-deep-dive)
11. [Integration Examples](#integration-examples)
12. [Advanced Features](#advanced-features)
13. [Deployment and Production](#deployment-and-production)
14. [Extension Patterns](#extension-patterns)

## Prerequisites and Setup

### Environment Requirements

Before starting, ensure you have:

- **Node.js 18+** for development tooling
- **Modern browser** with ES modules support
- **Basic knowledge** of JavaScript ES6+ and CSS
- **Understanding** of web components concepts
- **Familiarity** with Adobe Edge Delivery Services

### Development Tools Setup

```bash
# Clone or create your EDS project
mkdir spectrum-with-eds
cd spectrum-with-eds

# Initialize package.json
npm init -y

# Install development dependencies
npm install --save-dev vite eslint

# Create project structure
mkdir -p build/spectrum-card
mkdir -p blocks/spectrum-card
mkdir -p scripts
mkdir -p docs
```

### Essential Files Structure

```
spectrum-with-eds/
├── build/spectrum-card/           # 🔧 Development source
│   ├── spectrum-card.js           # Component source code
│   ├── spectrum-card.css          # Component styles
│   ├── index.html                 # Local testing page
│   ├── package.json               # Dev dependencies & scripts
│   └── vite.config.js             # Development server config
├── blocks/spectrum-card/          # 📦 Built output (ephemeral)
│   ├── spectrum-card.js           # EDS-ready component
│   └── spectrum-card.css          # EDS-ready styles
├── scripts/
│   ├── aem.js                     # Centralized utilities
│   ├── scripts.js                 # Main application script
│   └── build-component.js         # Build automation
└── docs/
    └── blog.md                    # Documentation
```

## Project Structure and Architecture

### Design Principles

This project follows several key architectural principles:

1. **Simplicity First**: No TypeScript, minimal build steps
2. **Performance Focus**: Lazy loading, efficient DOM operations
3. **Accessibility**: ARIA compliance, keyboard navigation
4. **Maintainability**: Clear separation of concerns
5. **Extensibility**: Modular design for easy customization

### Component Architecture

```javascript
// Component layers from bottom to top:
// 1. Adobe Spectrum Web Components (foundation)
// 2. EDS query-index.json integration (data layer)
// 3. Enhanced features (numbered badges, modals)
// 4. Application-specific customizations
```

## Step-by-Step Implementation

### Step 1: Basic Component Setup

Create the foundation component structure:

```javascript
// build/spectrum-card/spectrum-card.js
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/theme-light.js';
import '@spectrum-web-components/theme/scale-medium.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';

// Configuration object for easy customization
const SPECTRUM_CARD_CONFIG = {
  CARD_VARIANT: '',
  BUTTON_TREATMENT: 'accent',
  BUTTON_SIZE: 'm',
  MAX_WIDTH: '400px',
  DEFAULT_TITLE: 'Card Title',
  DEFAULT_DESCRIPTION: 'Card description',
  DEFAULT_BUTTON_TEXT: 'Learn More',
  QUERY_INDEX_PATH: '/slides/query-index.json',
};

// Environment-specific configuration
const getConfig = () => ({
  baseUrl: '', // Uses proxy in development, relative paths in production
});
```

### Step 2: Data Fetching Implementation

Implement robust data fetching with error handling:

```javascript
async function fetchCardData(queryPath) {
  try {
    const { baseUrl } = getConfig();
    const url = `${baseUrl}${queryPath}`;
    
    console.debug('[spectrum-card] fetching data from:', url);
    
    const response = await fetch(url, {
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch card data: ${response.status}`);
    }
    
    const json = await response.json();
    console.debug('[spectrum-card] fetched data:', json);
    
    return json.data || [];
  } catch (error) {
    console.error('[spectrum-card] fetch error:', error);
    return [];
  }
}
```

### Step 3: Basic Card Creation

Create the fundamental card structure:

```javascript
function createCard(cardData, index) {
  const card = document.createElement('sp-card');
  card.setAttribute('heading', cardData.title || SPECTRUM_CARD_CONFIG.DEFAULT_TITLE);
  card.style.width = '100%';

  // Add image using proper preview slot
  if (cardData.image) {
    const img = document.createElement('img');
    img.setAttribute('slot', 'preview');
    img.src = cardData.image;
    img.alt = cardData.title || '';
    img.style.width = '100%';
    img.style.height = '200px';
    img.style.objectFit = 'cover';
    img.loading = 'lazy';
    card.appendChild(img);
  }

  // Add description using proper description slot
  const descriptionDiv = document.createElement('div');
  descriptionDiv.setAttribute('slot', 'description');
  const mainDesc = document.createElement('p');
  mainDesc.style.fontWeight = 'bold';
  mainDesc.textContent = cardData.description || SPECTRUM_CARD_CONFIG.DEFAULT_DESCRIPTION;
  descriptionDiv.appendChild(mainDesc);
  card.appendChild(descriptionDiv);

  return card;
}
```

## Enhanced Features

### Numbered Badge Implementation

The numbered badges (roundels) require a special wrapper pattern due to Spectrum Web Components' encapsulation:

```javascript
function createCard(cardData, index) {
  // Create wrapper container for positioning context
  const cardWrapper = document.createElement('div');
  cardWrapper.style.position = 'relative';
  cardWrapper.style.maxWidth = SPECTRUM_CARD_CONFIG.MAX_WIDTH;
  cardWrapper.style.margin = '0 auto 20px auto';

  // Create numbered badge
  const slideNumber = document.createElement('div');
  slideNumber.className = 'slide-number';
  slideNumber.textContent = (index + 1).toString();
  slideNumber.style.position = 'absolute';
  slideNumber.style.top = '10px';
  slideNumber.style.left = '10px';
  slideNumber.style.backgroundColor = '#0265DC'; // Spectrum blue
  slideNumber.style.color = 'white';
  slideNumber.style.borderRadius = '50%';
  slideNumber.style.width = '32px';
  slideNumber.style.height = '32px';
  slideNumber.style.display = 'flex';
  slideNumber.style.alignItems = 'center';
  slideNumber.style.justifyContent = 'center';
  slideNumber.style.fontSize = '14px';
  slideNumber.style.fontWeight = 'bold';
  slideNumber.style.zIndex = '10';
  slideNumber.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  
  cardWrapper.appendChild(slideNumber);
  // ... create card and append to wrapper
  cardWrapper.appendChild(card);
  
  return cardWrapper;
}
```

### Modal Overlay System

Implement a professional modal system for content display:

```javascript
async function showContentModal(cardData, index) {
  // Create modal overlay with semi-transparent background
  const overlay = document.createElement('div');
  overlay.className = 'spectrum-card-modal-overlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.5); z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  `;

  // Create modal content container
  const modal = document.createElement('div');
  modal.className = 'spectrum-card-modal';
  modal.style.cssText = `
    background-color: white; border-radius: 8px;
    max-width: 800px; max-height: 80vh; width: 100%;
    position: relative; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    overflow: hidden; display: flex; flex-direction: column;
  `;

  // Add header with slide number and title
  const header = document.createElement('div');
  header.style.cssText = `
    padding: 20px 24px; border-bottom: 1px solid #e0e0e0;
    display: flex; justify-content: space-between; align-items: center;
    background-color: #f5f5f5;
  `;

  const titleContainer = document.createElement('div');
  titleContainer.style.cssText = `
    display: flex; align-items: center; gap: 12px;
  `;

  const slideNumberBadge = document.createElement('div');
  slideNumberBadge.textContent = (index + 1).toString();
  slideNumberBadge.style.cssText = `
    background-color: #0265DC; color: white; border-radius: 50%;
    width: 24px; height: 24px; display: flex; align-items: center;
    justify-content: center; font-size: 12px; font-weight: bold;
  `;

  const title = document.createElement('h2');
  title.textContent = cardData.title || 'Untitled';
  title.style.cssText = `
    margin: 0; font-size: 1.5rem; font-weight: 600;
  `;

  titleContainer.appendChild(slideNumberBadge);
  titleContainer.appendChild(title);

  // Create close button with Spectrum icon
  const closeButton = document.createElement('sp-button');
  closeButton.setAttribute('treatment', 'outline');
  closeButton.setAttribute('size', 's');
  closeButton.setAttribute('quiet', '');

  const closeIcon = document.createElement('sp-icon-close');
  closeIcon.setAttribute('size', 's');
  closeButton.appendChild(closeIcon);

  header.appendChild(titleContainer);
  header.appendChild(closeButton);

  // Create scrollable content area
  const content = document.createElement('div');
  content.className = 'spectrum-card-modal-content';
  content.style.cssText = `
    padding: 24px; max-height: calc(80vh - 120px);
    overflow-y: auto; line-height: 1.6;
  `;

  // Add loading state
  content.innerHTML = '<p style="text-align: center; color: #666;">Loading content...</p>';

  modal.appendChild(header);
  modal.appendChild(content);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden'; // Prevent background scrolling

  // Close modal function with cleanup
  const closeModal = () => {
    document.body.removeChild(overlay);
    document.body.style.overflow = ''; // Restore scrolling
  };

  // Multiple close methods for better UX
  closeButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // ESC key support
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Fetch and display full content
  if (cardData.path) {
    try {
      const html = await fetchPlainHtml(cardData.path);
      if (html) {
        content.innerHTML = html;
      } else {
        content.innerHTML = '<p style="color: #666;">Content not available.</p>';
      }
    } catch (error) {
      content.innerHTML = '<p style="color: #d73502;">Error loading content.</p>';
    }
  }
}
```

## Unusual Patterns and Technical Decisions

### Wrapper Container Pattern

The numbered badge implementation uses an unusual wrapper pattern that's worth understanding:

#### Why This Pattern is Necessary

1. **Spectrum Card Encapsulation**: The `<sp-card>` component uses Shadow DOM, preventing direct styling of internal elements
2. **Positioning Context**: Absolute positioning requires a positioned parent (`position: relative`)
3. **Z-Index Layering**: The badge needs proper stacking context to appear above card content
4. **Layout Preservation**: The wrapper maintains the card's intended behavior while adding overlay capability

#### Alternative Approaches Considered

- **CSS-only solution**: Not feasible due to Shadow DOM encapsulation
- **Modifying Spectrum Card**: Would break component integrity and upgrade compatibility
- **CSS custom properties**: Limited by the component's internal structure
- **Pseudo-elements**: Cannot reliably position over web component content

#### Benefits of the Wrapper Pattern

- **Non-invasive**: Doesn't modify the Spectrum Card component
- **Maintainable**: Clear separation of concerns
- **Flexible**: Easy to adapt for different overlay needs
- **Compatible**: Works with all Spectrum Card variants
- **Future-proof**: Survives component library updates

## Testing and Debugging

### Development Environment Setup

```javascript
// build/spectrum-card/vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    host: true,
    proxy: {
      '/slides': {
        target: 'https://allabout.network',
        changeOrigin: true,
        secure: true
      }
    }
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

### Testing Strategies

#### Unit Testing Approach

```javascript
// Test individual functions
function testFetchCardData() {
  console.group('Testing fetchCardData');
  
  // Test with valid endpoint
  fetchCardData('/slides/query-index.json')
    .then(data => {
      console.log('✅ Valid endpoint test passed:', data.length, 'items');
    })
    .catch(error => {
      console.error('❌ Valid endpoint test failed:', error);
    });
  
  // Test with invalid endpoint
  fetchCardData('/invalid/endpoint.json')
    .then(data => {
      console.log('✅ Invalid endpoint test passed (empty array):', data);
    })
    .catch(error => {
      console.error('❌ Invalid endpoint test failed:', error);
    });
  
  console.groupEnd();
}
```

#### Integration Testing

```javascript
// Test complete component lifecycle
function testComponentIntegration() {
  console.group('Testing Component Integration');
  
  const testBlock = document.createElement('div');
  testBlock.className = 'spectrum-card block';
  document.body.appendChild(testBlock);
  
  // Test decoration
  decorate(testBlock)
    .then(() => {
      console.log('✅ Component decoration completed');
      
      // Test card creation
      const cards = testBlock.querySelectorAll('sp-card');
      console.log('✅ Cards created:', cards.length);
      
      // Test badge presence
      const badges = testBlock.querySelectorAll('.slide-number');
      console.log('✅ Badges created:', badges.length);
      
      // Cleanup
      document.body.removeChild(testBlock);
    })
    .catch(error => {
      console.error('❌ Integration test failed:', error);
    });
  
  console.groupEnd();
}
```

### Debugging Tools and Techniques

#### Console Logging Strategy

```javascript
// Structured logging for debugging
const logger = {
  debug: (message, data) => {
    if (window.location.hostname === 'localhost') {
      console.debug(`[spectrum-card] ${message}`, data);
    }
  },
  error: (message, error) => {
    console.error(`[spectrum-card] ${message}`, error);
  },
  performance: (label, fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`[spectrum-card] ${label}: ${end - start}ms`);
    return result;
  }
};
```

#### Network Debugging

```javascript
// Monitor fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🌐 Fetch request:', args[0]);
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('✅ Fetch response:', response.status, args[0]);
      return response;
    })
    .catch(error => {
      console.error('❌ Fetch error:', error, args[0]);
      throw error;
    });
};
```

## Troubleshooting

### Common Issues and Solutions

#### 1. CORS Issues

**Problem**: Fetch requests blocked by CORS policy

**Solution**:

```javascript
// Development: Use proxy in vite.config.js
proxy: {
  '/slides': {
    target: 'https://allabout.network',
    changeOrigin: true,
    secure: true
  }
}

// Production: Ensure proper CORS headers or same-origin deployment
```

#### 2. Spectrum Components Not Loading

**Problem**: Components appear as undefined elements

**Solution**:

```javascript
// Ensure proper import order
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/theme-light.js';
import '@spectrum-web-components/theme/scale-medium.js';
// Import specific components after theme

// Check for theme wrapper in HTML
<sp-theme color="light" scale="medium" system="spectrum">
  <!-- Your content here -->
</sp-theme>
```

#### 3. Modal Not Displaying

**Problem**: Modal overlay doesn't appear or appears behind content

**Solution**:

```javascript
// Ensure proper z-index
overlay.style.zIndex = '1000';

// Check for competing positioned elements
// Verify modal is appended to document.body
document.body.appendChild(overlay);
```

#### 4. Badge Positioning Issues

**Problem**: Numbered badges appear in wrong position

**Solution**:

```javascript
// Ensure wrapper has position: relative
cardWrapper.style.position = 'relative';

// Verify badge has position: absolute
slideNumber.style.position = 'absolute';

// Check for CSS conflicts
slideNumber.style.zIndex = '10';
```

#### 5. Query-Index Format Errors

**Problem**: Data not loading or displaying incorrectly

**Solution**:

```javascript
// Validate JSON structure
{
  "total": 3,
  "offset": 0,
  "limit": 3,
  "data": [
    {
      "path": "/slides/slide-1",
      "title": "Required field",
      "description": "Required field",
      "image": "/slides/image.png",
      "buttonText": "Optional field"
    }
  ]
}

// Add validation function
function validateCardData(data) {
  return data.filter(item => 
    item.title && 
    item.description && 
    typeof item.path === 'string'
  );
}
```

## Customization Examples

### Theme Customization

```javascript
// Custom color scheme
const CUSTOM_THEME = {
  primaryColor: '#FF6B35',
  secondaryColor: '#004E89',
  backgroundColor: '#F7F9FB',
  textColor: '#2C3E50'
};

// Apply custom badge styling
function createCustomBadge(index) {
  const badge = document.createElement('div');
  badge.style.cssText = `
    position: absolute; top: 10px; right: 10px;
    background: linear-gradient(45deg, ${CUSTOM_THEME.primaryColor}, ${CUSTOM_THEME.secondaryColor});
    color: white; border-radius: 50%;
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: bold; z-index: 10;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    border: 2px solid white;
  `;
  badge.textContent = (index + 1).toString();
  return badge;
}
```

### Animation Examples

```javascript
// Fade-in animation for cards
function animateCardEntry(card, delay = 0) {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  
  setTimeout(() => {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, delay);
}

// Modal entrance animation
function animateModalEntry(modal) {
  modal.style.transform = 'scale(0.9)';
  modal.style.opacity = '0';
  modal.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
  
  requestAnimationFrame(() => {
    modal.style.transform = 'scale(1)';
    modal.style.opacity = '1';
  });
}
```

### Layout Variations

```javascript
// Masonry layout for cards
function createMasonryLayout(container) {
  container.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-auto-rows: 10px;
    gap: 20px;
  `;
  
  // Auto-size cards based on content
  container.querySelectorAll('.card-wrapper').forEach(card => {
    const height = card.scrollHeight;
    const spans = Math.ceil(height / 10);
    card.style.gridRowEnd = `span ${spans}`;
  });
}

// Horizontal scrolling layout
function createHorizontalLayout(container) {
  container.style.cssText = `
    display: flex;
    overflow-x: auto;
    gap: 20px;
    padding: 20px 0;
    scroll-snap-type: x mandatory;
  `;
  
  container.querySelectorAll('.card-wrapper').forEach(card => {
    card.style.cssText = `
      flex: 0 0 300px;
      scroll-snap-align: start;
    `;
  });
}
```

## Performance Optimization

### Image Optimization

```javascript
// Responsive image loading
function createOptimizedImage(src, alt, sizes = '(max-width: 768px) 100vw, 50vw') {
  const img = document.createElement('img');
  
  // Generate responsive srcset
  const baseSrc = src.split('?')[0];
  const srcset = [
    `${baseSrc}?width=400&format=webp&optimize=medium 400w`,
    `${baseSrc}?width=800&format=webp&optimize=medium 800w`,
    `${baseSrc}?width=1200&format=webp&optimize=medium 1200w`
  ].join(', ');
  
  img.srcset = srcset;
  img.sizes = sizes;
  img.src = `${baseSrc}?width=800&format=webp&optimize=medium`;
  img.alt = alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  
  return img;
}
```

### Lazy Loading Implementation

```javascript
// Intersection Observer for lazy loading
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      loadCardContent(card);
      cardObserver.unobserve(card);
    }
  });
}, {
  rootMargin: '50px'
});

function loadCardContent(cardElement) {
  // Load heavy content only when card is visible
  const img = cardElement.querySelector('img[data-src]');
  if (img) {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  }
}
```

### Memory Management

```javascript
// Cleanup function for modal
function cleanupModal(overlay) {
  // Remove event listeners
  const closeButton = overlay.querySelector('sp-button');
  if (closeButton) {
    closeButton.removeEventListener('click', closeModal);
  }
  
  // Clear content
  const content = overlay.querySelector('.spectrum-card-modal-content');
  if (content) {
    content.innerHTML = '';
  }
  
  // Remove from DOM
  if (overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
  
  // Restore body scroll
  document.body.style.overflow = '';
}

// Debounced resize handler
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const handleResize = debounce(() => {
  // Recalculate layouts
  updateCardLayouts();
}, 250);

window.addEventListener('resize', handleResize);
```

## Accessibility Deep Dive

### ARIA Implementation

```javascript
// Enhanced accessibility for cards
function createAccessibleCard(cardData, index) {
  const cardWrapper = createCard(cardData, index);
  const card = cardWrapper.querySelector('sp-card');
  
  // Add ARIA attributes
  card.setAttribute('role', 'article');
  card.setAttribute('aria-labelledby', `card-title-${index}`);
  card.setAttribute('aria-describedby', `card-desc-${index}`);
  card.setAttribute('tabindex', '0');
  
  // Add unique IDs for screen readers
  const title = card.querySelector('[slot="heading"]');
  if (title) {
    title.id = `card-title-${index}`;
  }
  
  const description = card.querySelector('[slot="description"]');
  if (description) {
    description.id = `card-desc-${index}`;
  }
  
  // Add slide number announcement
  const badge = cardWrapper.querySelector('.slide-number');
  if (badge) {
    badge.setAttribute('aria-label', `Slide ${index + 1}`);
    badge.setAttribute('role', 'img');
  }
  
  return cardWrapper;
}
```

### Keyboard Navigation

```javascript
// Enhanced keyboard support
function addKeyboardNavigation(container) {
  const cards = container.querySelectorAll('sp-card');
  
  cards.forEach((card, index) => {
    card.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          // Trigger card action
          const button = card.querySelector('sp-button');
          if (button) button.click();
          break;
          
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          focusNextCard(cards, index);
          break;
          
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          focusPreviousCard(cards, index);
          break;
          
        case 'Home':
          e.preventDefault();
          cards[0].focus();
          break;
          
        case 'End':
          e.preventDefault();
          cards[cards.length - 1].focus();
          break;
      }
    });
  });
}

function focusNextCard(cards, currentIndex) {
  const nextIndex = (currentIndex + 1) % cards.length;
  cards[nextIndex].focus();
}

function focusPreviousCard(cards, currentIndex) {
  const prevIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
  cards[prevIndex].focus();
}
```

### Screen Reader Support

```javascript
// Live region for dynamic updates
function createLiveRegion() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.style.cssText = `
    position: absolute; left: -10000px; width: 1px; height: 1px;
    overflow: hidden;
  `;
  document.body.appendChild(liveRegion);
  return liveRegion;
}

// Announce loading states
function announceLoadingState(message) {
  const liveRegion = document.querySelector('[aria-live]') || createLiveRegion();
  liveRegion.textContent = message;
}

// Usage in component
async function decorate(block) {
  announceLoadingState('Loading cards...');
  
  try {
    const cardData = await fetchCardData(queryPath);
    announceLoadingState(`Loaded ${cardData.length} cards`);
    
    // Render cards...
    
  } catch (error) {
    announceLoadingState('Error loading cards');
  }
}
```

## Integration Examples

### Custom Event System

```javascript
// Custom events for component communication
class SpectrumCardEvents {
  static CARD_LOADED = 'spectrum-card:loaded';
  static CARD_CLICKED = 'spectrum-card:clicked';
  static MODAL_OPENED = 'spectrum-card:modal-opened';
  static MODAL_CLOSED = 'spectrum-card:modal-closed';
  
  static dispatch(eventType, detail = {}) {
    const event = new CustomEvent(eventType, {
      detail,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }
}

// Usage in component
function createCard(cardData, index) {
  const card = createBasicCard(cardData, index);
  
  card.addEventListener('click', () => {
    SpectrumCardEvents.dispatch(SpectrumCardEvents.CARD_CLICKED, {
      cardData,
      index,
      timestamp: Date.now()
    });
  });
  
  return card;
}

// Listen for events in application
document.addEventListener(SpectrumCardEvents.CARD_CLICKED, (e) => {
  console.log('Card clicked:', e.detail);
  // Analytics tracking, state updates, etc.
});
```

### Data Transformation Examples

```javascript
// Transform different data sources to card format
class DataTransformer {
  static fromBlogPosts(posts) {
    return posts.map(post => ({
      path: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      image: post.featuredImage,
      buttonText: 'Read Article',
      author: post.author,
      publishDate: post.publishDate,
      category: post.category
    }));
  }
  
  static fromProducts(products) {
    return products.map(product => ({
      path: `/products/${product.id}`,
      title: product.name,
      description: product.shortDescription,
      image: product.thumbnail,
      buttonText: 'View Product',
      price: product.price,
      rating: product.rating,
      inStock: product.inventory > 0
    }));
  }
  
  static fromEvents(events) {
    return events.map(event => ({
      path: `/events/${event.id}`,
      title: event.name,
      description: event.summary,
      image: event.banner,
      buttonText: 'Register',
      date: event.startDate,
      location: event.venue,
      capacity: event.maxAttendees
    }));
  }
}
```

## Advanced Features

### Search and Filtering

```javascript
// Advanced search functionality
class CardFilter {
  constructor(cards) {
    this.originalCards = cards;
    this.filteredCards = cards;
    this.filters = new Map();
  }
  
  addFilter(name, predicate) {
    this.filters.set(name, predicate);
    this.applyFilters();
  }
  
  removeFilter(name) {
    this.filters.delete(name);
    this.applyFilters();
  }
  
  applyFilters() {
    this.filteredCards = this.originalCards.filter(card => {
      return Array.from(this.filters.values()).every(predicate => predicate(card));
    });
    this.render();
  }
  
  search(query) {
    const searchPredicate = (card) => {
      const searchText = `${card.title} ${card.description}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    };
    
    if (query.trim()) {
      this.addFilter('search', searchPredicate);
    } else {
      this.removeFilter('search');
    }
  }
  
  filterByCategory(category) {
    if (category) {
      this.addFilter('category', card => card.category === category);
    } else {
      this.removeFilter('category');
    }
  }
  
  render() {
    // Re-render filtered cards
    this.onRender?.(this.filteredCards);
  }
}

// Usage
const cardFilter = new CardFilter(cardData);
cardFilter.onRender = (filteredCards) => {
  renderCards(filteredCards);
};

// Add search input
const searchInput = document.createElement('input');
searchInput.placeholder = 'Search cards...';
searchInput.addEventListener('input', (e) => {
  cardFilter.search(e.target.value);
});
```

### Pagination Implementation

```javascript
// Pagination for large datasets
class CardPagination {
  constructor(cards, itemsPerPage = 12) {
    this.allCards = cards;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.totalPages = Math.ceil(cards.length / itemsPerPage);
  }
  
  getCurrentPageCards() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.allCards.slice(startIndex, endIndex);
  }
  
  goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.render();
    }
  }
  
  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
  
  previousPage() {
    this.goToPage(this.currentPage - 1);
  }
  
  createPaginationControls() {
    const controls = document.createElement('div');
    controls.className = 'pagination-controls';
    controls.style.cssText = `
      display: flex; justify-content: center; align-items: center;
      gap: 10px; margin: 20px 0;
    `;
    
    // Previous button
    const prevBtn = document.createElement('sp-button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = this.currentPage === 1;
    prevBtn.addEventListener('click', () => this.previousPage());
    
    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
    
    // Next button
    const nextBtn = document.createElement('sp-button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = this.currentPage === this.totalPages;
    nextBtn.addEventListener('click', () => this.nextPage());
    
    controls.appendChild(prevBtn);
    controls.appendChild(pageInfo);
    controls.appendChild(nextBtn);
    
    return controls;
  }
  
  render() {
    this.onRender?.(this.getCurrentPageCards());
  }
}
```

### Animation System

```javascript
// Advanced animation system
class CardAnimations {
  static fadeInSequence(cards, delay = 100) {
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * delay);
    });
  }
  
  static slideInFromLeft(cards, delay = 150) {
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateX(-50px)';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';
      }, index * delay);
    });
  }
  
  static scaleIn(cards, delay = 80) {
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.8)';
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      }, index * delay);
    });
  }
  
  static hoverEffects(card) {
    card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '';
    });
  }
}
```

## Deployment and Production

### Build Optimization

```javascript
// Production build configuration
// vite.config.prod.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'spectrum-card.js',
      name: 'SpectrumCard',
      fileName: () => 'spectrum-card.js',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        // Externalize Spectrum components for CDN loading
        '@spectrum-web-components/theme/sp-theme.js',
        '@spectrum-web-components/card/sp-card.js',
        '@spectrum-web-components/button/sp-button.js'
      ],
      output: {
        globals: {
          // Define globals for externalized dependencies
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### Environment Configuration

```javascript
// Environment-specific configurations
const ENV_CONFIG = {
  development: {
    baseUrl: '',
    debug: true,
    analytics: false,
    cacheTimeout: 0
  },
  staging: {
    baseUrl: 'https://staging.example.com',
    debug: true,
    analytics: true,
    cacheTimeout: 300000 // 5 minutes
  },
  production: {
    baseUrl: 'https://example.com',
    debug: false,
    analytics: true,
    cacheTimeout: 3600000 // 1 hour
  }
};

function getEnvironmentConfig() {
  const env = process.env.NODE_ENV || 'development';
  return ENV_CONFIG[env] || ENV_CONFIG.development;
}
```

### Performance Monitoring

```javascript
// Performance monitoring utilities
class PerformanceMonitor {
  static measureComponentLoad(componentName, loadFunction) {
    const startTime = performance.now();
    
    return loadFunction().then(result => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Send to analytics
      this.reportMetric('component_load_time', {
        component: componentName,
        duration: loadTime,
        timestamp: Date.now()
      });
      
      return result;
    });
  }
  
  static measureDataFetch(endpoint, fetchFunction) {
    const startTime = performance.now();
    
    return fetchFunction().then(result => {
      const endTime = performance.now();
      const fetchTime = endTime - startTime;
      
      this.reportMetric('data_fetch_time', {
        endpoint,
        duration: fetchTime,
        success: true,
        timestamp: Date.now()
      });
      
      return result;
    }).catch(error => {
      const endTime = performance.now();
      const fetchTime = endTime - startTime;
      
      this.reportMetric('data_fetch_time', {
        endpoint,
        duration: fetchTime,
        success: false,
        error: error.message,
        timestamp: Date.now()
      });
      
      throw error;
    });
  }
  
  static reportMetric(metricName, data) {
    // Send to your analytics service
    if (window.gtag) {
      window.gtag('event', metricName, data);
    }
    
    // Or send to custom analytics endpoint
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/analytics', JSON.stringify({
        metric: metricName,
        data,
        userAgent: navigator.userAgent,
        url: window.location.href
      }));
    }
  }
}
```

## Extension Patterns

### Plugin Architecture

```javascript
// Plugin system for extensibility
class SpectrumCardPlugin {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.hooks = new Map();
  }
  
  addHook(hookName, callback) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName).push(callback);
  }
  
  executeHook(hookName, data) {
    const callbacks = this.hooks.get(hookName) || [];
    return callbacks.reduce((result, callback) => {
      return callback(result) || result;
    }, data);
  }
}

// Example plugins
class AnalyticsPlugin extends SpectrumCardPlugin {
  constructor() {
    super('analytics', '1.0.0');
    
    this.addHook('card:clicked', (data) => {
      this.trackCardClick(data);
      return data;
    });
    
    this.addHook('modal:opened', (data) => {
      this.trackModalOpen(data);
      return data;
    });
  }
  
  trackCardClick(data) {
    // Analytics implementation
    console.log('Analytics: Card clicked', data);
  }
  
  trackModalOpen(data) {
    // Analytics implementation
    console.log('Analytics: Modal opened', data);
  }
}

class ThemePlugin extends SpectrumCardPlugin {
  constructor(theme) {
    super('theme', '1.0.0');
    this.theme = theme;
    
    this.addHook('card:created', (card) => {
      this.applyTheme(card);
      return card;
    });
  }
  
  applyTheme(card) {
    // Apply custom theme
    card.style.setProperty('--custom-primary', this.theme.primary);
    card.style.setProperty('--custom-secondary', this.theme.secondary);
  }
}
```

### Component Library Pattern

```javascript
// Reusable component library structure
class SpectrumCardLibrary {
  constructor() {
    this.variants = new Map();
    this.plugins = [];
  }
  
  registerVariant(name, config) {
    this.variants.set(name, config);
  }
  
  addPlugin(plugin) {
    this.plugins.push(plugin);
  }
  
  createCard(data, variantName = 'default') {
    const variant = this.variants.get(variantName);
    if (!variant) {
      throw new Error(`Unknown variant: ${variantName}`);
    }
    
    let card = variant.create(data);
    
    // Apply plugins
    this.plugins.forEach(plugin => {
      card = plugin.executeHook('card:created', card);
    });
    
    return card;
  }
}

// Register variants
const cardLibrary = new SpectrumCardLibrary();

cardLibrary.registerVariant('default', {
  create: (data) => createStandardCard(data)
});

cardLibrary.registerVariant('compact', {
  create: (data) => createCompactCard(data)
});

cardLibrary.registerVariant('featured', {
  create: (data) => createFeaturedCard(data)
});

// Add plugins
cardLibrary.addPlugin(new AnalyticsPlugin());
cardLibrary.addPlugin(new ThemePlugin({ primary: '#0265DC', secondary: '#378EF0' }));
```

### Multi-language Support

```javascript
// Internationalization system
class I18nManager {
  constructor(defaultLocale = 'en') {
    this.currentLocale = defaultLocale;
    this.translations = new Map();
  }
  
  addTranslations(locale, translations) {
    this.translations.set(locale, translations);
  }
  
  setLocale(locale) {
    this.currentLocale = locale;
  }
  
  t(key, params = {}) {
    const translations = this.translations.get(this.currentLocale) || {};
    let translation = translations[key] || key;
    
    // Replace parameters
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{{${param}}}`, params[param]);
    });
    
    return translation;
  }
}

// Usage in component
const i18n = new I18nManager();

i18n.addTranslations('en', {
  'card.loading': 'Loading cards...',
  'card.error': 'Error loading cards',
  'card.readMore': 'Read More',
  'modal.close': 'Close',
  'modal.loading': 'Loading content...'
});

i18n.addTranslations('es', {
  'card.loading': 'Cargando tarjetas...',
  'card.error': 'Error al cargar tarjetas',
  'card.readMore': 'Leer Más',
  'modal.close': 'Cerrar',
  'modal.loading': 'Cargando contenido...'
});

// Use in component
function createCard(data) {
  const button = document.createElement('sp-button');
  button.textContent = i18n.t('card.readMore');
  // ...
}
```

## Conclusion

This comprehensive tutorial provides a complete foundation for building professional Spectrum components for Adobe Edge Delivery Services. The patterns and techniques demonstrated here can be adapted for various content types and use cases, from simple card displays to complex interactive applications.

### Key Takeaways

1. **Architecture Matters**: Proper separation of concerns and modular design enable maintainability and extensibility
2. **Performance is Critical**: Lazy loading, efficient DOM operations, and proper memory management ensure smooth user experiences
3. **Accessibility is Essential**: ARIA compliance, keyboard navigation, and screen reader support make components inclusive
4. **Testing Prevents Issues**: Comprehensive testing strategies catch problems early and ensure reliability
5. **Documentation Enables Adoption**: Clear documentation and examples help teams implement and customize components effectively

### Next Steps

- Experiment with different Spectrum components and layouts
- Implement custom themes and animations
- Add advanced features like search, filtering, and pagination
- Create reusable component libraries for your organization
- Contribute improvements back to the community

The combination of Adobe Spectrum Web Components and Edge Delivery Services provides a powerful foundation for building modern, performant web applications that maintain design consistency and accessibility standards.

---

| metadata |  |
| :---- | :---- |
| title | Complete Tutorial: Building Professional Spectrum Components for Adobe Edge Delivery Services |
| description | A comprehensive guide to creating dynamic, accessible UI components using Adobe Spectrum Web Components and the EDS query-index.json pattern, with practical examples, troubleshooting, and advanced techniques. |
| image |  |
| author | Tom Cranstoun |
| longdescription | This comprehensive tutorial covers everything needed to build professional Spectrum components for Adobe Edge Delivery Services, from basic setup through advanced features like numbered badges, modal overlays, accessibility implementation, performance optimization, and extension patterns. Includes practical examples, troubleshooting guides, and production deployment strategies. |
