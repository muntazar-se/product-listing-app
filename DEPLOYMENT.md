# Deployment Guide

## Vercel Deployment (Recommended)

This project is configured for full-stack deployment on Vercel, which supports both frontend and backend in a single deployment.

### Prerequisites

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Make sure all dependencies are installed:
```bash
npm run install-all
```

### Deployment Steps

1. **Login to Vercel:**
```bash
vercel login
```

2. **Deploy the project:**
```bash
vercel
```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Set project name (e.g., "products-listing")
   - Confirm deployment settings

4. **For production deployment:**
```bash
vercel --prod
```

### Project Structure for Vercel

- **Frontend**: React app in `/frontend` directory
- **Backend**: Serverless functions in `/backend/api` directory
- **Configuration**: `vercel.json` handles routing and builds

### API Endpoints

- **Products API**: `/api/products` (handled by `backend/api/products.js`)
- **Frontend**: Served from `/frontend/dist` after build

### Environment Variables

No environment variables are required for this deployment. The gold price is set to a static fallback value of $75/gram.

### Custom Domain

After deployment, you can add a custom domain in the Vercel dashboard:
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain

### Alternative Deployment Options

#### Option 2: Separate Deployments

**Frontend on Vercel:**
- Deploy only the `frontend` directory
- Update API calls to point to your backend URL

**Backend on Railway/Render:**
- Deploy the `backend` directory separately
- Set environment variables as needed

#### Option 3: Netlify + Railway

**Frontend on Netlify:**
- Connect your GitHub repo
- Set build command: `cd frontend && npm install && npm run build`
- Set publish directory: `frontend/dist`

**Backend on Railway:**
- Deploy the `backend` directory
- Update frontend API calls to Railway URL

### Troubleshooting

1. **Build Errors**: Check that all dependencies are properly installed
2. **API Errors**: Verify the serverless function is properly configured
3. **CORS Issues**: The API includes CORS headers for cross-origin requests
4. **File Path Issues**: Ensure `products.json` is in the correct location

### Local Development

For local development, run both servers:
```bash
npm run dev
```

This will start:
- Backend on `http://localhost:4000`
- Frontend on `http://localhost:5173` 