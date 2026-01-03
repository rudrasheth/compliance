# ComplianceOS Deployment Guide

## 🚀 Vercel Deployment (Frontend)

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository with the code
- Backend deployed (Railway, Render, or Heroku)

### Step 1: Deploy Frontend to Vercel

1. **Connect to Vercel**:
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository: `https://github.com/rudrasheth/compliance.git`

2. **Configure Build Settings**:
   - Framework Preset: `Vite`
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**:
   Add the following environment variable in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be available at: `https://your-app-name.vercel.app`

### Step 2: Deploy Backend (Choose One)

#### Option A: Railway (Recommended)
1. Go to https://railway.app
2. Connect GitHub repository
3. Select the `server` folder as root
4. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
5. Deploy and get your backend URL

#### Option B: Render
1. Go to https://render.com
2. Connect GitHub repository
3. Create new Web Service
4. Set root directory to `server`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variables (same as Railway)

#### Option C: Heroku
1. Install Heroku CLI
2. Create new app: `heroku create your-app-name`
3. Set buildpack: `heroku buildpacks:set heroku/nodejs`
4. Add environment variables: `heroku config:set KEY=value`
5. Deploy: `git subtree push --prefix server heroku main`

### Step 3: Update Frontend Environment

1. **Update Vercel Environment Variable**:
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Update `VITE_API_URL` with your actual backend URL
   - Redeploy the frontend

2. **Update CORS in Backend**:
   Make sure your backend allows your Vercel domain in CORS settings.

### Step 4: Database Setup

1. **MongoDB Atlas**:
   - Ensure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) for production
   - Or add your deployment platform's IP ranges to the whitelist

2. **Seed Data** (Optional):
   ```bash
   # Run this once after backend deployment
   curl -X POST https://your-backend-url.com/api/seed
   ```

## 🔧 Environment Variables Reference

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (server/.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/compliance_db
JWT_SECRET=your_super_secure_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## 🌐 Custom Domain (Optional)

1. **Add Custom Domain in Vercel**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Update Environment Variables**:
   - Update `FRONTEND_URL` in backend to use custom domain
   - Update any hardcoded URLs

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Check build logs for specific errors

2. **API Calls Fail**:
   - Verify `VITE_API_URL` is correct
   - Check CORS settings in backend
   - Ensure backend is deployed and accessible

3. **Authentication Issues**:
   - Verify JWT_SECRET is set in backend
   - Check MongoDB connection
   - Ensure email service is configured

4. **Database Connection Fails**:
   - Check MongoDB Atlas network access
   - Verify connection string format
   - Ensure database user has proper permissions

## 📊 Monitoring

1. **Vercel Analytics**:
   - Enable in Vercel dashboard for frontend monitoring

2. **Backend Monitoring**:
   - Use platform-specific monitoring (Railway, Render, etc.)
   - Set up error tracking (Sentry, LogRocket)

3. **Database Monitoring**:
   - Use MongoDB Atlas monitoring
   - Set up alerts for performance issues

## 🚀 Production Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render/Heroku
- [ ] Database accessible from backend
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Email service working
- [ ] Authentication flow tested
- [ ] All features working in production
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] SSL certificates active

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check database connectivity
5. Review CORS and security settings

---

**ComplianceOS** - Professional Compliance Management System