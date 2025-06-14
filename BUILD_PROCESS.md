# Spectrum Card Component Build Process

This document describes the complete build process for creating Spectrum Web Components for Adobe Edge Delivery Services (EDS), as outlined in the blog post.

## Project Structure

```bash
spectrum-with-eds/
├── build/spectrum-card/           # Source component files for development
│   ├── spectrum-card.js           # Main component source
│   ├── spectrum-card.css          # Component styles source
│   ├── index.html                 # Local testing page
│   ├── package.json               # Dependencies and scripts
│   ├── vite.config.js             # Development server config
│   └── README.md                  # Component documentation
├── blocks/spectrum-card/          # Built output for EDS deployment (ephemeral)
│   ├── spectrum-card.js           # Built component file
│   └── spectrum-card.css          # Built styles file
├── scripts/
│   └── build-component.js         # Build automation script
├── docs/
│   └── blog.md                    # Source of truth documentation
└── package.json                   # Root project configuration
```

## Build Process Overview

The build process works with the component developed in `/build/spectrum-card/` and outputs production-ready files to `/blocks/spectrum-card/` for EDS deployment:

1. **Development Source** - `/build/spectrum-card/` contains the source files, testing environment, and development tools
2. **Testing Environment** - HTML file that mimics EDS behavior for local development
3. **Development Tools** - Vite configuration for hot reload and optimization
4. **Build Output** - Optimized files are copied to `/blocks/spectrum-card/` for EDS deployment
5. **Ephemeral Blocks** - The `/blocks/` directory is the deployment target, not the source

## Running the Build

### Automated Build

```bash
npm run build:component
```

This script:

- Copies component files from `blocks/spectrum-card/` to `build/spectrum-card/`
- Updates dependencies in the build package.json
- Ensures proper directory structure
- Provides next steps for testing

### Manual Build Steps

If you need to understand or customize the build process:

1. **Develop in Build Directory**

   ```bash
   cd build/spectrum-card
   npm install
   npm run dev  # For development
   ```

2. **Build for Production**

   ```bash
   npm run build  # Creates optimized version
   ```

3. **Copy to Blocks Directory**

   ```bash
   npm run build:component  # Copies built files to blocks/
   ```

The build directory contains:

- `index.html` - Local testing page (named for Vite compatibility)
- `package.json` - Dependencies and scripts
- `vite.config.js` - Development server configuration
- Source component files for development

## Testing the Built Component

After building:

```bash
cd build/spectrum-card
npm install
npm run dev
```

This opens a local development server showing the component in action.

## Component Development Workflow

1. **Develop** - Work on component files in `build/spectrum-card/`
2. **Test** - Use `npm run dev` in build directory for local testing with hot reload
3. **Build** - Run `npm run build` to create optimized version
4. **Deploy** - Run `npm run build:component` to copy files to `blocks/` directory
5. **EDS Integration** - Copy files from `blocks/spectrum-card/` to your EDS project

## EDS Integration

The built component integrates with EDS by:

1. **Block Structure** - Following EDS block naming conventions
2. **Decorate Function** - Exporting a default function that transforms DOM
3. **Content Parsing** - Reading structured content from document tables
4. **Progressive Enhancement** - Starting with semantic HTML, enhancing with Spectrum components

### Content Structure

In your EDS document, create a table:

```bash
| spectrum-card |
| :---- |
| https://example.com/image.png |
| Card Title |
| Card description text |
| Button Text |
```

EDS automatically calls the `decorate` function for each block, transforming the table into a Spectrum card component.

## Key Features

### Modern JavaScript

- ES Modules throughout
- No TypeScript compilation needed
- Clean, readable code structure

### Spectrum Web Components

- Professional Adobe design system
- Built-in accessibility features
- Responsive and themeable

### Development Experience

- Hot reload during development
- Comprehensive error logging
- Easy local testing setup

### Performance

- Tree-shaking removes unused code
- Minimal runtime overhead
- Optimized for production

## Configuration

The component includes configurable options:

```javascript
const SPECTRUM_CARD_CONFIG = {
  CARD_VARIANT: 'quiet',
  BUTTON_TREATMENT: 'accent',
  BUTTON_SIZE: 'm',
  MAX_WIDTH: '400px',
  DEFAULT_TITLE: 'Card Title',
  DEFAULT_DESCRIPTION: 'Card description',
  DEFAULT_BUTTON_TEXT: 'Action',
};
```

Modify these values to customize appearance and behavior.

## Troubleshooting

### Build Issues

- Ensure source files exist in `blocks/spectrum-card/`
- Check file permissions for copying
- Verify Node.js version supports ES modules

### Component Issues

- Check browser console for errors
- Ensure Spectrum dependencies are loaded
- Verify theme setup in test.html

### EDS Integration Issues

- Confirm block naming matches directory structure
- Check that decorate function is exported as default
- Ensure content structure matches expected format

## Extending the Process

This build process can be extended for other Spectrum components:

1. Create new component in `blocks/[component-name]/`
2. Modify `scripts/build-component.js` to handle multiple components
3. Add component-specific configuration and testing
4. Update documentation and examples

The pattern established here works for any Spectrum Web Component integration with EDS.
