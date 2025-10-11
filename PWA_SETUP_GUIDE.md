# PWA Setup Guide - My Voice

## Overview
This guide explains how to set up and use the Progressive Web App (PWA) features of My Voice.

## Features Implemented

### 1. Service Worker
- Automatic caching of static assets
- Offline functionality
- Background sync capabilities
- Push notification support (ready for implementation)

### 2. Web App Manifest
- App metadata and configuration
- Icon definitions for different screen sizes
- Display mode settings (standalone)
- Theme colors and orientation

### 3. Install Prompt
- Custom install button for supported browsers
- Automatic detection of installability
- User-friendly installation process

### 4. Offline Support
- Offline page when no internet connection
- Cached content for offline viewing
- Network status detection

## Installation Instructions

### For Users
1. Open the app in a supported browser (Chrome, Edge, Safari, Firefox)
2. Look for the install button in the bottom-right corner
3. Click "Installer l'app" to add to home screen
4. The app will be installed and accessible like a native app

### For Developers

#### Prerequisites
```bash
npm install vite-plugin-pwa workbox-window --save-dev
```

#### Build Commands
```bash
# Development
npm run dev

# Production build with PWA
npm run build:pwa

# Preview PWA locally
npm run serve
```

## PWA Configuration

### Service Worker Features
- **Caching Strategy**: CacheFirst for images, StaleWhileRevalidate for API calls
- **Cache Duration**: 
  - Images: 30 days
  - Fonts: 365 days
  - Static assets: Until next deployment

### Manifest Settings
- **Display Mode**: Standalone (full-screen app experience)
- **Orientation**: Portrait (mobile-optimized)
- **Theme Color**: Blue (#3b82f6)
- **Background Color**: White (#ffffff)

## Browser Support

### Full PWA Support
- Chrome/Chromium (Android, Desktop)
- Edge (Windows, Android)
- Safari (iOS 11.3+, macOS)

### Partial Support
- Firefox (basic PWA features)
- Samsung Internet

## Testing PWA Features

### 1. Install Prompt
- Open app in Chrome/Edge
- Look for install button
- Test installation process

### 2. Offline Functionality
- Install the app
- Disconnect internet
- Verify offline page appears
- Test cached content access

### 3. Service Worker
- Open DevTools > Application > Service Workers
- Verify service worker is registered
- Check cache storage

### 4. Manifest
- Open DevTools > Application > Manifest
- Verify all manifest properties are correct

## Customization

### Icons
Replace icons in `/public/` directory:
- `MYVOICE_974.png` - Main app icon
- Add additional sizes as needed (192x192, 512x512)

### Theme Colors
Update in `vite.config.ts`:
```typescript
theme_color: '#your-color',
background_color: '#your-background-color',
```

### Caching Strategy
Modify in `vite.config.ts` under `workbox.runtimeCaching`:
```typescript
{
  urlPattern: /your-api-pattern/,
  handler: 'NetworkFirst', // or 'CacheFirst', 'StaleWhileRevalidate'
  options: {
    cacheName: 'your-cache-name',
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 60 * 60 * 24 // 1 day
    }
  }
}
```

## Troubleshooting

### Service Worker Not Updating
1. Clear browser cache
2. Unregister service worker in DevTools
3. Reload page

### Install Button Not Showing
1. Check if app meets PWA criteria
2. Verify HTTPS is enabled
3. Check manifest.json is valid

### Offline Page Not Working
1. Verify service worker is registered
2. Check network status detection
3. Test with DevTools offline mode

## Performance Optimization

### Bundle Size
- PWA adds minimal overhead (~50KB)
- Service worker is loaded asynchronously
- Caching reduces network requests

### Loading Speed
- Static assets cached on first visit
- Subsequent visits load from cache
- Background updates ensure fresh content

## Security Considerations

### HTTPS Requirement
- PWA features require HTTPS in production
- Service workers only work over secure connections
- Local development uses HTTP (localhost exception)

### Content Security Policy
- Ensure CSP allows service worker registration
- Whitelist necessary domains for caching

## Future Enhancements

### Planned Features
- Push notifications
- Background sync
- Advanced caching strategies
- Offline form submission
- Progressive image loading

### Integration Opportunities
- Firebase Cloud Messaging for notifications
- IndexedDB for offline data storage
- Web Share API for native sharing

## Support

For PWA-related issues:
1. Check browser compatibility
2. Verify HTTPS configuration
3. Test in incognito mode
4. Clear browser data and retry

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
