// Import Spectrum Web Components
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/theme-light.js';
import '@spectrum-web-components/theme/scale-medium.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-arrow-right.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-close.js';

// Configuration
const SPECTRUM_CARD_CONFIG = {
  CARD_VARIANT: '', // Use standard variant for better footer support
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

// Fetch plain HTML content for modal display
async function fetchPlainHtml(path) {
  try {
    const { baseUrl } = getConfig();
    const url = `${baseUrl}${path}.plain.html`;
    
    // eslint-disable-next-line no-console
    console.debug('[spectrum-card] fetching plain HTML from:', url);
    
    const response = await fetch(url, {
      mode: 'cors',
      headers: {
        'Accept': 'text/html',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch plain HTML: ${response.status}`);
    }
    
    const html = await response.text();
    return html;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[spectrum-card] plain HTML fetch error:', error);
    return null;
  }
}

// Create and show modal overlay with content
function showContentModal(cardData, index) {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'spectrum-card-modal-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '1000';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.padding = '20px';

  // Create modal content container
  const modal = document.createElement('div');
  modal.className = 'spectrum-card-modal';
  modal.style.backgroundColor = 'white';
  modal.style.borderRadius = '8px';
  modal.style.maxWidth = '800px';
  modal.style.maxHeight = '80vh';
  modal.style.width = '100%';
  modal.style.position = 'relative';
  modal.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
  modal.style.overflow = 'hidden';

  // Create modal header with close button
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.padding = '20px 24px';
  header.style.borderBottom = '1px solid var(--spectrum-global-color-gray-300)';
  header.style.backgroundColor = 'var(--spectrum-global-color-gray-50)';

  // Add slide number and title
  const titleContainer = document.createElement('div');
  titleContainer.style.display = 'flex';
  titleContainer.style.alignItems = 'center';
  titleContainer.style.gap = '12px';

  const slideNumberBadge = document.createElement('div');
  slideNumberBadge.textContent = (index + 1).toString();
  slideNumberBadge.style.backgroundColor = '#0265DC';
  slideNumberBadge.style.color = 'white';
  slideNumberBadge.style.borderRadius = '50%';
  slideNumberBadge.style.width = '24px';
  slideNumberBadge.style.height = '24px';
  slideNumberBadge.style.display = 'flex';
  slideNumberBadge.style.alignItems = 'center';
  slideNumberBadge.style.justifyContent = 'center';
  slideNumberBadge.style.fontSize = '12px';
  slideNumberBadge.style.fontWeight = 'bold';

  const title = document.createElement('h2');
  title.textContent = cardData.title || SPECTRUM_CARD_CONFIG.DEFAULT_TITLE;
  title.style.margin = '0';
  title.style.fontSize = '1.5rem';
  title.style.fontWeight = '600';

  titleContainer.appendChild(slideNumberBadge);
  titleContainer.appendChild(title);

  // Create close button
  const closeButton = document.createElement('sp-button');
  closeButton.setAttribute('treatment', 'outline');
  closeButton.setAttribute('size', 's');
  closeButton.setAttribute('quiet', '');
  closeButton.style.minWidth = 'auto';
  closeButton.style.padding = '8px';

  const closeIcon = document.createElement('sp-icon-close');
  closeIcon.setAttribute('size', 's');
  closeButton.appendChild(closeIcon);

  header.appendChild(titleContainer);
  header.appendChild(closeButton);

  // Create content area
  const content = document.createElement('div');
  content.className = 'spectrum-card-modal-content';
  content.style.padding = '24px';
  content.style.maxHeight = 'calc(80vh - 120px)';
  content.style.overflowY = 'auto';
  content.style.lineHeight = '1.6';

  // Add loading state
  content.innerHTML = '<p style="text-align: center; color: var(--spectrum-global-color-gray-600);">Loading content...</p>';

  modal.appendChild(header);
  modal.appendChild(content);
  overlay.appendChild(modal);

  // Add to document
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden'; // Prevent background scrolling

  // Close modal function
  const closeModal = () => {
    document.body.removeChild(overlay);
    document.body.style.overflow = ''; // Restore scrolling
  };

  // Event listeners
  closeButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // ESC key to close
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Fetch and display content
  if (cardData.path) {
    fetchPlainHtml(cardData.path).then(html => {
      if (html) {
        content.innerHTML = html;
      } else {
        content.innerHTML = `
          <div style="text-align: center; color: var(--spectrum-global-color-gray-600);">
            <p>Content not available</p>
            <p style="font-size: 0.9rem;">Unable to load the full content for this slide.</p>
          </div>
        `;
      }
    });
  } else {
    content.innerHTML = `
      <div style="text-align: center; color: var(--spectrum-global-color-gray-600);">
        <p>No content path available</p>
      </div>
    `;
  }
}

// Create a single card element with proper Spectrum structure
function createCard(cardData, index) {
  // Create wrapper container for the card and number badge
  const cardWrapper = document.createElement('div');
  cardWrapper.style.position = 'relative';
  cardWrapper.style.maxWidth = SPECTRUM_CARD_CONFIG.MAX_WIDTH;
  cardWrapper.style.margin = '0 auto 20px auto';

  // Add slide number badge positioned over the card
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

  // Create the actual Spectrum Card
  const card = document.createElement('sp-card');
  // Only set variant if it's not empty (standard variant has no variant attribute)
  if (SPECTRUM_CARD_CONFIG.CARD_VARIANT) {
    card.setAttribute('variant', SPECTRUM_CARD_CONFIG.CARD_VARIANT);
  }
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
  
  // Main description (bold)
  const mainDesc = document.createElement('p');
  mainDesc.style.fontWeight = 'bold';
  mainDesc.style.margin = '0 0 8px 0';
  mainDesc.style.lineHeight = '1.4';
  mainDesc.textContent = cardData.description || SPECTRUM_CARD_CONFIG.DEFAULT_DESCRIPTION;
  descriptionDiv.appendChild(mainDesc);
  
  // Supporting text if available
  if (cardData.supportingText || cardData.longDescription) {
    const supportingText = document.createElement('p');
    supportingText.style.margin = '0';
    supportingText.style.fontSize = '0.9rem';
    supportingText.style.lineHeight = '1.4';
    supportingText.style.color = 'var(--spectrum-global-color-gray-700)';
    // Truncate long text for card display
    const text = cardData.supportingText || cardData.longDescription || '';
    const truncatedText = text.length > 120 ? text.substring(0, 120) + '...' : text;
    supportingText.textContent = truncatedText;
    descriptionDiv.appendChild(supportingText);
  }
  
  card.appendChild(descriptionDiv);

  // Add footer with button using proper footer slot
  const footerDiv = document.createElement('div');
  footerDiv.setAttribute('slot', 'footer');
  footerDiv.style.display = 'flex';
  footerDiv.style.justifyContent = 'flex-end';
  footerDiv.style.alignItems = 'center';
  footerDiv.style.padding = '8px 0';

  // Create Read More button
  const button = document.createElement('sp-button');
  button.setAttribute('treatment', SPECTRUM_CARD_CONFIG.BUTTON_TREATMENT);
  button.setAttribute('size', SPECTRUM_CARD_CONFIG.BUTTON_SIZE);
  button.textContent = cardData.buttonText || 'Read More';
  
  // Add arrow icon to button
  const icon = document.createElement('sp-icon-arrow-right');
  icon.setAttribute('slot', 'icon');
  button.appendChild(icon);
  
  // Add click handler for modal display
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // eslint-disable-next-line no-console
    console.log('[spectrum-card] showing modal for slide:', {
      slideNumber: index + 1,
      title: cardData.title,
      path: cardData.path,
      description: cardData.description,
    });
    
    // Show modal with content
    showContentModal(cardData, index);
  });
  
  footerDiv.appendChild(button);
  card.appendChild(footerDiv);

  // Add the card to the wrapper
  cardWrapper.appendChild(card);
  
  return cardWrapper;
}

// The decorate function is called by Franklin/EDS for this block
export default async function decorate(block) {
  // eslint-disable-next-line no-console
  console.debug('[spectrum-card] decorate called', block);

  try {
    // Check if block has content specifying a custom query path
    const rows = Array.from(block.children);
    let queryPath = SPECTRUM_CARD_CONFIG.QUERY_INDEX_PATH;
    
    if (rows.length > 0) {
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
    
    // Create cards from data with index for numbering
    cardData.forEach((item, index) => {
      const cardWrapper = createCard(item, index);
      cardsContainer.appendChild(cardWrapper);
    });
    
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
