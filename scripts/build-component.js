#!/usr/bin/env node

import { mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

/**
 * Build script for Spectrum Card component
 * Builds the component in /build/ directory and copies output to /blocks/ directory
 * The /build/ directory is the source for development
 * The /blocks/ directory is ephemeral output for EDS deployment
 */

function ensureDirectoryExists(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

function buildAndCopyToBlocks() {
  const buildDir = join(projectRoot, 'build', 'spectrum-card');
  const blocksDir = join(projectRoot, 'blocks', 'spectrum-card');
  
  // Ensure blocks directory exists
  ensureDirectoryExists(blocksDir);
  
  // Copy built JavaScript file from build to blocks
  const jsSource = join(buildDir, 'spectrum-card.js');
  const jsTarget = join(blocksDir, 'spectrum-card.js');
  
  if (existsSync(jsSource)) {
    copyFileSync(jsSource, jsTarget);
    console.log('Copied spectrum-card.js from build to blocks directory');
  } else {
    console.warn('Warning: spectrum-card.js not found in build directory. Run vite build first.');
  }
  
  // Copy CSS file from build to blocks
  const cssSource = join(buildDir, 'spectrum-card.css');
  const cssTarget = join(blocksDir, 'spectrum-card.css');
  
  if (existsSync(cssSource)) {
    copyFileSync(cssSource, cssTarget);
    console.log('Copied spectrum-card.css from build to blocks directory');
  } else {
    console.warn('Warning: spectrum-card.css not found in build directory');
  }
}

function main() {
  console.log('Building Spectrum Card component...');
  
  try {
    buildAndCopyToBlocks();
    
    console.log('\n✅ Build complete!');
    console.log('\nDevelopment workflow:');
    console.log('1. cd build/spectrum-card');
    console.log('2. npm install');
    console.log('3. npm run dev (for development)');
    console.log('4. npm run build (to create optimized version)');
    console.log('5. npm run build:component (to copy to blocks folder)');
    console.log('\nThe blocks/ folder contains the EDS-ready component files.');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

main();
