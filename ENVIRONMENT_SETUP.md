# Environment Variables Setup

## Overview
The application now uses environment variables to configure the API base URL (`http://localhost:5000`) throughout the application.

## Environment Variables Required

### 1. API Configuration
Create a `.env.local` file in the project root with:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
```

**Location**: Project root (`project/.env.local`)

**Usage**: This variable is used by all API calls throughout the application.

## Setup Instructions

1. **Create Environment File**:
   ```bash
   cd project
   cp env.example .env.local
   ```

2. **Edit Configuration**:
   - Open `.env.local`
   - Set `VITE_API_BASE_URL` to your desired API URL
   - For development, keep it as `http://localhost:5000`

3. **Restart Development Server**:
   ```bash
   npm run dev
   ```

## Files Updated

The following files now use the environment variable instead of hardcoded URLs:

### API Service
- `src/services/api.ts` - Exports `BASE_URL` from environment variable

### Pages
- `src/pages/AdminPanel.tsx` - Studies API calls
- `src/pages/Home.tsx` - Studies API calls  
- `src/pages/SocialFeed.tsx` - Questions API calls
- `src/pages/Studies.tsx` - Gifts API calls
- `src/pages/StudiesList.tsx` - Studies API calls

### Admin Components
- `src/components/admin/Dashboard.tsx` - Studies API calls
- `src/components/admin/Gifts.tsx` - CRUD operations for gifts
- `src/components/admin/CurrentStudies.tsx` - CRUD operations for studies
- `src/components/admin/MyQuestions.tsx` - CRUD operations for questions

## Benefits

1. **Configuration Management**: Easy to change API URL for different environments
2. **Environment Separation**: Different URLs for development, staging, production
3. **Maintainability**: Single source of truth for API URL
4. **Security**: API URLs don't need to be hardcoded in source code

## Production Setup

For production deployment, set the environment variable in your deployment platform:

- **Vercel**: Add `VITE_API_BASE_URL` in Environment Variables section
- **Netlify**: Add environment variable in Site settings
- **Heroku**: Use `heroku config:set VITE_API_BASE_URL=your-production-url`

## Troubleshooting

If the application still uses hardcoded URLs:
1. Check if `.env.local` file exists and contains the correct variable
2. Verify the variable name is exactly `VITE_API_BASE_URL`
3. Restart the development server after adding/changing environment variables
4. Clear browser cache and reload the page
