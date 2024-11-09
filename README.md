# White Label Configuration Guide

This guide explains how to customize the application for different NFT projects using the brand configuration system.

## Quick Start

1. Navigate to `src/config/brand.ts`
2. Modify the values in `brandConfig` to match your project's branding
3. Replace assets in the `public/assets` directory with your own

## Configuration Sections

### Basic Branding
```typescript
name: 'YOUR_PROJECT',        // Project name displayed in header
domain: '.com',             // Domain suffix
title: 'Your Title',        // Browser tab title
description: 'Description', // Project description
```

### Social Links
```typescript
social: {
  twitter: 'https://twitter.com/your-handle',
  discord: 'https://discord.gg/your-server',
  github: 'https://github.com/your-repo',
}
```

### Colors
```typescript
colors: {
  primary: {
    // Main brand colors used throughout the UI
    pink: '#FF9ECD',    // Primary accent color
    coral: '#FF7E67',   // Secondary accent color
    brown: '#8B4513',   // Tertiary color
    blue: '#6FB1FC',    // Quaternary color
    gold: '#FFD700',    // Highlight color
  },
  
  accent: {
    // Additional colors for various UI elements
    yellow: '#FFE66D',  // Success/warning states
    orange: '#FF9F1C',  // Warning/attention states
    teal: '#4ECDC4',    // Info/success states
    purple: '#A06CD5',  // Special/premium features
  },

  theme: {
    light: {
      background: '#FFF0F7',  // Light theme main background
      card: 'rgba(255, 255, 255, 0.6)', // Light theme card background
      // Text colors for light theme
    },
    dark: {
      background: '#1A1B23',  // Dark theme main background
      card: 'rgba(255, 158, 205, 0.02)', // Dark theme card background
      // Text colors for dark theme
    }
  }
}
```

### Typography
```typescript
fonts: {
  primary: 'Outfit',         // Main font for body text
  display: 'Press Start 2P', // Accent font for headings
}
```

### NFT Collection
```typescript
collection: {
  address: 'YOUR_COLLECTION_ADDRESS', // Solana collection address
  name: 'Your Collection',           // Collection name
}
```

### Admin Settings
```typescript
admin: {
  wallet: 'ADMIN_WALLET_ADDRESS', // Admin wallet for protected routes
}
```

### Assets
```typescript
assets: {
  logo: '/assets/logo.png',         // Project logo
  favicon: '/vite.svg',             // Browser favicon
  defaultPfp: '/assets/defaultpfp.jpg', // Default profile picture
  loadingScreen: '/assets/loading.png', // Loading screen background
  music: '/assets/music/music.mp3',    // Background music
}
```

### UI Effects
```typescript
effects: {
  glassBlur: 'xl',           // Blur intensity for glass effects
  animationDuration: 500,    // Animation duration in milliseconds
  hoverScale: 1.02,         // Scale factor for hover effects
}
```

### RPC Settings
```typescript
rpc: {
  defaultEndpoint: 'https://your-rpc.com', // Default RPC endpoint
  defaultApiKey: 'your-api-key',           // Default API key
}
```

## Asset Replacement

1. Place your assets in the `public/assets` directory
2. Update the paths in `brandConfig.assets`
3. Ensure asset names match the paths or update the paths accordingly

## Important Notes

- All colors should be valid CSS color values (hex, rgb, or hsl)
- Font names should match exactly with the imported font files
- Asset paths should be relative to the `public` directory
- The collection address must be a valid Solana address
- RPC endpoints should include the full URL with protocol