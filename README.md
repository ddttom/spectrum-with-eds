# Spectrum Card Component for Adobe Edge Delivery Services

This repository contains a Spectrum Card component built for Adobe Edge Delivery Services (EDS/Franklin), demonstrating how to integrate Adobe Spectrum Web Components with EDS's document-driven approach.

## Overview

The Spectrum Card component transforms simple document content into professional, accessible UI cards using Adobe's design system. Authors can create cards using familiar document editing tools while delivering polished components that match Adobe's design standards.

## Features

- ✅ Professional UI using Adobe Spectrum Web Components
- ✅ Full accessibility support (keyboard navigation, screen readers)
- ✅ Responsive design out of the box
- ✅ Document-driven content management
- ✅ No framework dependencies
- ✅ Optimized build with Vite

## Project Structure

```bash
spectrum-with-eds/
├── blocks/
│   └── spectrum-card/
│       ├── spectrum-card.js    # Main component
│       └── spectrum-card.css    # Component styles
├── test.html                    # Local testing file
├── package.json                 # Dependencies
├── vite.config.js              # Build configuration
└── README.md                   # This file
```

## Installation

Clone this repository:

```bash
git clone https://github.com/ddttom/spectrum-with-eds
cd spectrum-with-eds
```

Install dependencies:

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

This will open the test page where you can see the Spectrum Card components in action.

## Building

Build the component for production:

```bash
npm run build
```

The optimized output will be in the `dist` directory.

## Usage in EDS

### Document Structure

Create a table in your document with the name "spectrum-card":

| spectrum-card |
|---------------|
| <https://example.com/image.png> |
| Card Title |
| Card description text |
| Button Text |

The block expects:

1. Image URL (optional)
2. Title
3. Description
4. Button text

### Deployment

Deploy the `blocks/spectrum-card` directory to your EDS project's `/blocks/spectrum-card/` path.

## Configuration

You can modify the component configuration in `spectrum-card.js`:

```javascript
const SPECTRUM_CARD_CONFIG = {
  CARD_VARIANT: 'quiet',        // Card style variant
  BUTTON_TREATMENT: 'accent',   // Button style
  BUTTON_SIZE: 'm',            // Button size
  MAX_WIDTH: '400px',          // Maximum card width
  DEFAULT_TITLE: 'Card Title',
  DEFAULT_DESCRIPTION: 'Card description',
  DEFAULT_BUTTON_TEXT: 'Action',
};
```

## Troubleshooting

**Grey box instead of card?**

- Check that the image URL is valid and accessible
- Ensure the block structure follows the expected format

**No styles in local testing?**

- Make sure you're importing the theme components
- Verify the `decorate` function is called on your test blocks

**Console warnings about theme?**

- Always set `system="spectrum"` on your `<sp-theme>` element

## License

This project is licensed under the Apache License 2.0.

## Resources

- [Adobe Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/)
- [Adobe Edge Delivery Services](https://www.aem.live/docs/)
- [EDS Block Development](https://www.aem.live/developer/block-collection)
