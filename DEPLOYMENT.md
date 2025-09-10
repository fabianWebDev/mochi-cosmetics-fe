# Deployment Guide for Render

This guide will help you deploy your React e-commerce frontend to Render.

## Prerequisites

- A Render account
- Your backend API deployed and accessible
- Git repository with your code

## Environment Variables

Before deploying, you'll need to set up the following environment variables in Render:

1. **VITE_API_BASE_URL**: Your production API URL (e.g., `https://your-api-domain.com/api`)
2. **VITE_MEDIA_BASE_URL**: Your production media URL (e.g., `https://your-api-domain.com`)

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. Push your code to your Git repository
2. In Render dashboard, create a new "Static Site"
3. Connect your Git repository
4. Render will automatically detect the `render.yaml` configuration
5. Set your environment variables in the Render dashboard
6. Deploy!

### Option 2: Manual Configuration

1. In Render dashboard, create a new "Static Site"
2. Connect your Git repository
3. Configure the following settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: 20
4. Add your environment variables
5. Deploy!

### Option 3: Using Docker

1. In Render dashboard, create a new "Web Service"
2. Connect your Git repository
3. Render will automatically detect the Dockerfile
4. Set your environment variables
5. Deploy!

## Post-Deployment

After deployment, your site will be available at a Render-provided URL. You can:

1. Set up a custom domain in Render dashboard
2. Configure SSL certificates (automatically handled by Render)
3. Set up monitoring and logging

## Troubleshooting

### Common Issues

1. **Build fails**: Check that all dependencies are in `package.json`
2. **API calls fail**: Verify your `VITE_API_BASE_URL` is correct
3. **Routing issues**: Ensure your backend supports CORS for your frontend domain

### Environment Variables

Make sure to set these in your Render dashboard:
- `VITE_API_BASE_URL=https://your-backend-api.com/api`
- `VITE_MEDIA_BASE_URL=https://your-backend-api.com`

## Performance Optimizations

The build is already optimized with:
- Code splitting
- Asset minification
- Gzip compression
- Static asset caching
- Security headers

## Security

The deployment includes:
- Security headers
- Non-root user in Docker
- CORS configuration
- XSS protection

## Monitoring

Render provides built-in monitoring for:
- Build logs
- Runtime logs
- Performance metrics
- Error tracking
