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
  QUERY_INDEX_PATH: '/slides/query-index.json', // Default path, can be overridden
};

// Environment-specific configuration
const getConfig = () => {
  // In browser, we'll use relative paths which work for both dev (with proxy) and production
  return {
    baseUrl: '', // Uses proxy in development, relative paths in production
  };
};

// Fetch content from EDS query-index.json
async function fetchCardData(queryPath) {
  try {
    const { baseUrl } = getConfig();
    const url = `${baseUrl}${queryPath}`;
    
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.debug('[spectrum-card] fetched data:', json);
    
    return json.data || [];
  } catch (error) {
    // eslint-disable-next-line no-console
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
  card.style.margin = '0 auto 20px auto';

  // Add image if available
  if (cardData.image) {
    const img = document.createElement('img');
    img.setAttribute('slot', 'preview');
    img.src = cardData.image;
    img.alt = cardData.title || '';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.loading = 'lazy'; // Performance optimization
    card.appendChild(img);
  }

  // Add description
  const descriptionDiv = document.createElement('div');
  descriptionDiv.setAttribute('slot', 'description');
  descriptionDiv.textContent = cardData.description || SPECTRUM_CARD_CONFIG.DEFAULT_DESCRIPTION;
  card.appendChild(descriptionDiv);

  // Add footer with button
  const footerDiv = document.createElement('div');
  footerDiv.setAttribute('slot', 'footer');
  footerDiv.style.display = 'flex';
  footerDiv.style.justifyContent = 'flex-end';

  const button = document.createElement('sp-button');
  button.setAttribute('treatment', SPECTRUM_CARD_CONFIG.BUTTON_TREATMENT);
  button.setAttribute('size', SPECTRUM_CARD_CONFIG.BUTTON_SIZE);
  button.textContent = cardData.buttonText || SPECTRUM_CARD_CONFIG.DEFAULT_BUTTON_TEXT;
  
  const icon = document.createElement('sp-icon-arrow-right');
  icon.setAttribute('slot', 'icon');
  button.appendChild(icon);
  
  // Add click handler
  button.addEventListener('click', () => {
    // eslint-disable-next-line no-console
    console.log('[spectrum-card] card clicked:', {
      title: cardData.title,
      path: cardData.path,
      description: cardData.description,
    });
    
    // Navigate to the card's page if path is available
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
  // eslint-disable-next-line no-console
  console.debug('[spectrum-card] decorate called', block);

  try {
    // Check if block has content specifying a custom query path
    const rows = Array.from(block.children);
    let queryPath = SPECTRUM_CARD_CONFIG.QUERY_INDEX_PATH;
    
    // If there's content in the block, use it as the query path
    if (rows.length > 0 && rows[0].textContent.trim()) {
      const firstRowContent = rows[0].textContent.trim();
      // Check if it looks like a query path (contains query-index.json)
      if (firstRowContent.includes('query-index.json')) {
        queryPath = firstRowContent;
      }
    }
    
    // eslint-disable-next-line no-console
    console.debug('[spectrum-card] using query path:', queryPath);
    
    // Clear the block content
    block.textContent = '';
    
    // Add loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.textContent = 'Loading cards...';
    loadingDiv.style.textAlign = 'center';
    loadingDiv.style.padding = '20px';
    block.appendChild(loadingDiv);
    
    // Fetch card data from query-index.json
    const cardData = await fetchCardData(queryPath);
    
    // Remove loading state
    block.removeChild(loadingDiv);
    
    if (cardData.length === 0) {
      const noDataDiv = document.createElement('div');
      noDataDiv.textContent = 'No cards available';
      noDataDiv.style.textAlign = 'center';
      noDataDiv.style.padding = '20px';
      block.appendChild(noDataDiv);
      return;
    }
    
    // Create container for cards
    const cardsContainer = document.createElement('div');
    cardsContainer.style.display = 'grid';
    cardsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    cardsContainer.style.gap = '20px';
    cardsContainer.style.padding = '20px 0';
    
    // Create cards from data
    for (const item of cardData) {
      const card = createCard(item);
      cardsContainer.appendChild(card);
    }
    
    block.appendChild(cardsContainer);
    
    // eslint-disable-next-line no-console
    console.debug('[spectrum-card] rendered', cardData.length, 'cards');
    
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[spectrum-card] decorate error', err);
    
    // Show error state
    block.textContent = '';
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Error loading cards';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.padding = '20px';
    errorDiv.style.color = 'red';
    block.appendChild(errorDiv);
  }
}
