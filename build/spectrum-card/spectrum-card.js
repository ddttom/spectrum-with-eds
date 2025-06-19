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
    
    // Fix relative image paths in the HTML content
    let fixedHtml = html;
    
    // Fix various relative path patterns
    fixedHtml = fixedHtml.replace(/src="\.\/media\//g, `src="${baseUrl}/media/`);
    fixedHtml = fixedHtml.replace(/src="media\//g, `src="${baseUrl}/media/`);
    fixedHtml = fixedHtml.replace(/src="\.\.\/media\//g, `src="${baseUrl}/media/`);
    
    return fixedHtml;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[spectrum-card] plain HTML fetch error:', error);
    return null;
  }
}

// Create and show modal overlay with content
function showContentModal(cardData, index) {
  try {
    // Create modal overlay with enhanced glassmorphism
    const overlay = document.createElement('div');
    overlay.className = 'spectrum-card-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'modal-title');
    // Create modal container with background image
    const modal = document.createElement('div');
    modal.className = 'spectrum-card-modal';
    
    // Set background image with fallback
    const backgroundImage = cardData.image || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80';
    modal.style.backgroundImage = `url(${backgroundImage})`;
    modal.style.backgroundSize = 'cover';
    modal.style.backgroundPosition = 'center';
    modal.style.backgroundRepeat = 'no-repeat';

    // Create modal content container
    const content = document.createElement('div');
    content.className = 'spectrum-card-modal-content';
    
    // Add dark overlay for better text readability
    content.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)';
    content.style.backdropFilter = 'blur(8px)';
    content.style.webkitBackdropFilter = 'blur(8px)';

    // Create slide number badge with enhanced glassmorphism
    const slideNumberBadge = document.createElement('div');
    slideNumberBadge.className = 'spectrum-card-slide-badge';
    slideNumberBadge.textContent = (index + 1).toString();
    slideNumberBadge.style.position = 'absolute';
    slideNumberBadge.style.top = '1.5rem';
    slideNumberBadge.style.left = '1.5rem';
    slideNumberBadge.style.background = 'rgba(255, 255, 255, 0.25)';
    slideNumberBadge.style.backdropFilter = 'blur(15px)';
    slideNumberBadge.style.webkitBackdropFilter = 'blur(15px)';
    slideNumberBadge.style.color = 'white';
    slideNumberBadge.style.borderRadius = '50%';
    slideNumberBadge.style.width = '3rem';
    slideNumberBadge.style.height = '3rem';
    slideNumberBadge.style.display = 'flex';
    slideNumberBadge.style.alignItems = 'center';
    slideNumberBadge.style.justifyContent = 'center';
    slideNumberBadge.style.fontSize = '1.125rem';
    slideNumberBadge.style.fontWeight = 'bold';
    slideNumberBadge.style.border = '1px solid rgba(255, 255, 255, 0.3)';
    slideNumberBadge.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
    slideNumberBadge.style.zIndex = '1001';

    // Create enhanced close button with glassmorphism
    const closeButton = document.createElement('button');
    closeButton.className = 'spectrum-card-close-button';
    closeButton.innerHTML = '×';
    closeButton.setAttribute('aria-label', 'Close modal');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '1.5rem';
    closeButton.style.right = '1.5rem';
    closeButton.style.background = 'rgba(255, 255, 255, 0.25)';
    closeButton.style.backdropFilter = 'blur(15px)';
    closeButton.style.webkitBackdropFilter = 'blur(15px)';
    closeButton.style.border = '1px solid rgba(255, 255, 255, 0.3)';
    closeButton.style.borderRadius = '50%';
    closeButton.style.width = '3rem';
    closeButton.style.height = '3rem';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '1.5rem';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';
    closeButton.style.display = 'flex';
    closeButton.style.alignItems = 'center';
    closeButton.style.justifyContent = 'center';
    closeButton.style.transition = 'all 0.2s ease';
    closeButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
    closeButton.style.zIndex = '1001';

    // Enhanced hover effects for close button
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.background = 'rgba(255, 255, 255, 0.35)';
      closeButton.style.transform = 'scale(1.05)';
    });
    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.background = 'rgba(255, 255, 255, 0.25)';
      closeButton.style.transform = 'scale(1)';
    });

    // Create title with enhanced styling
    const title = document.createElement('h1');
    title.id = 'modal-title';
    title.textContent = cardData.title || SPECTRUM_CARD_CONFIG.DEFAULT_TITLE;
    title.style.margin = '0 0 1.5rem 0';
    title.style.fontSize = '3rem';
    title.style.fontWeight = '700';
    title.style.color = 'white';
    title.style.textShadow = '0 4px 8px rgba(0, 0, 0, 0.6)';
    title.style.lineHeight = '1.1';
    title.style.background = 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)';
    title.style.webkitBackgroundClip = 'text';
    title.style.webkitTextFillColor = 'transparent';
    title.style.backgroundClip = 'text';

    // Create subtitle with enhanced styling
    const subtitle = document.createElement('p');
    subtitle.textContent = cardData.description || SPECTRUM_CARD_CONFIG.DEFAULT_DESCRIPTION;
    subtitle.style.margin = '0 0 2rem 0';
    subtitle.style.fontSize = '1.25rem';
    subtitle.style.fontWeight = '500';
    subtitle.style.color = 'rgba(255, 255, 255, 0.95)';
    subtitle.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.6)';
    subtitle.style.lineHeight = '1.5';
    subtitle.style.maxWidth = '600px';

    // Create content area for fetched HTML
    const contentArea = document.createElement('div');
    contentArea.className = 'spectrum-card-modal-text-content';
    contentArea.style.fontSize = '1.1rem';
    contentArea.style.lineHeight = '1.6';
    contentArea.style.color = 'rgba(255, 255, 255, 0.9)';
    contentArea.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.6)';
    contentArea.style.maxWidth = '700px';
    contentArea.style.maxHeight = '300px';
    contentArea.style.overflowY = 'auto';

    // Add loading state
    contentArea.innerHTML = '<p style="color: rgba(255, 255, 255, 0.7); font-style: italic;">Loading content...</p>';

    // Add all content to the main content container
    content.appendChild(title);
    content.appendChild(subtitle);
    content.appendChild(contentArea);

    // Assemble the modal structure
    modal.appendChild(content);
    modal.appendChild(slideNumberBadge);
    modal.appendChild(closeButton);
    overlay.appendChild(modal);

    // Add to document
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Ensure modal visibility with essential inline styles
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.backdropFilter = 'blur(20px)';
    overlay.style.webkitBackdropFilter = 'blur(20px)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

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

    // Focus management for accessibility
    closeButton.focus();

    // Fetch and display content
    if (cardData.path) {
      fetchPlainHtml(cardData.path).then(html => {
        if (html) {
          // Extract text content from HTML and style it for the modal
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          
          // Look for specific content patterns or just use the text content
          const textContent = tempDiv.textContent || tempDiv.innerText || '';
          
          // Create a styled paragraph for the content
          const styledContent = document.createElement('p');
          styledContent.textContent = textContent;
          styledContent.style.fontSize = '1.1rem';
          styledContent.style.lineHeight = '1.6';
          styledContent.style.color = 'rgba(255, 255, 255, 0.9)';
          styledContent.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.6)';
          styledContent.style.margin = '0';
          
          contentArea.innerHTML = '';
          contentArea.appendChild(styledContent);
        } else {
          contentArea.innerHTML = `
            <p style="color: rgba(255, 255, 255, 0.7); font-style: italic;">
              Content not available - Unable to load the full content for this slide.
            </p>
          `;
        }
      });
    } else {
      contentArea.innerHTML = `
        <p style="color: rgba(255, 255, 255, 0.7); font-style: italic;">
          No content path available
        </p>
      `;
    }

    } catch (error) {
    console.error('[spectrum-card] Modal creation failed:', error);
    // Fallback: show a simple alert
    alert(`Failed to open modal for "${cardData.title}". Error: ${error.message}`);
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
  
  // Main description (bold) - clean any unwanted formatting
  const mainDesc = document.createElement('p');
  mainDesc.style.fontWeight = 'bold';
  mainDesc.style.margin = '0 0 8px 0';
  mainDesc.style.lineHeight = '1.4';
  
  // Clean description text by removing bullet points and extra whitespace
  let cleanDescription = cardData.description || SPECTRUM_CARD_CONFIG.DEFAULT_DESCRIPTION;
  
  // Clean description text by removing bullet points and extra whitespace
  cleanDescription = cleanDescription.replace(/^[\u2022\u2023\u25E6\u2043\u2219\u204C\u204D\u2047\u2048\u2049\u204A\u204B\u25CF\u25CB\u25AA\u25AB\u25A0\u25A1•*\-\s]+/, '').trim();
  cleanDescription = cleanDescription.replace(/\n[\u2022\u2023\u25E6\u2043\u2219\u204C\u204D\u2047\u2048\u2049\u204A\u204B\u25CF\u25CB\u25AA\u25AB\u25A0\u25A1•*\-\s]+/g, '\n').trim();
  cleanDescription = cleanDescription.replace(/&bull;|&#8226;|&#x2022;|&#8227;|&#9679;|&#9675;/g, '').trim();
  cleanDescription = cleanDescription.replace(/^\s*[-*•]\s*/, '').trim();
  
  mainDesc.textContent = cleanDescription;
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
