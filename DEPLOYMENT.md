# Deployment Guide for Funds Application

## Overview
This application consists of a React frontend that connects to a backend API for funds data. The frontend uses environment-specific URLs to connect to the appropriate backend.

## Frontend Deployment (GitHub Pages)

The frontend is already configured for GitHub Pages deployment via the existing `package.json` configuration:

- **Homepage**: `https://nadzeya.marchanka.github.io/adk`
- **Deploy script**: `npm run deploy`

### Current GitHub Pages Configuration
The app is set up to work with the `/adk` base path in production, which matches your GitHub repository name.

### Required GitHub Settings
1. Go to your repository **Settings** → **Pages**
2. Set **Source** to "Deploy from a branch"
3. Set **Branch** to `gh-pages` 
4. Set **Folder** to `/ (root)`

### Deployment Commands
```bash
# Build and deploy to GitHub Pages
npm run deploy
```

## Backend Integration

Since you already have your backend, the frontend is configured to connect to:
- **Local Development**: `http://0.0.0.0:8000`
- **Production**: `https://adk-be.onrender.com`

The application will automatically detect the environment and use the appropriate URL.

## Local Development

1. **Start the backend** on `http://0.0.0.0:8000`
2. **Start the frontend**:
   ```bash
   npm start
   ```
3. The frontend will automatically connect to the local backend

## Production Deployment Checklist

- [ ] Backend deployed and accessible at `https://adk-be.onrender.com`
- [ ] Backend CORS configured for GitHub Pages domain
- [ ] All API endpoints implemented and working
- [ ] GitHub Pages configured in repository settings
- [ ] Frontend deployed via `npm run deploy`

## Features Included

✅ **Server-side pagination** - Handle large datasets efficiently  
✅ **Advanced filtering** - 12+ filter options including ranges and boolean filters  
✅ **Multi-column sorting** - Sort by any supported field  
✅ **Expandable rows** - Detailed fund information on click  
✅ **Responsive design** - Works on desktop and mobile  
✅ **Error handling** - Graceful fallbacks for API failures  
✅ **Loading states** - Visual feedback during data fetching  
✅ **Search functionality** - Search by fund manager  
✅ **Active filter indicators** - Clear visual feedback on applied filters 