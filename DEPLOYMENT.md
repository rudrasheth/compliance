# ComplianceOS Deployment Guide

## 🚀 Vercel Full-Stack Deployment

This guide will help you deploy both the frontend and backend on Vercel using serverless functions.

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository with the code
- MongoDB Atlas database

### Step 1: Deploy to Vercel

1. **Connect to Vercel**:
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository: `https://github.com/rudrasheth/compliance.git`

2. **Configure Build Settings**:
   - Framework Preset: `Vite` (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `dist` (auto-filled)
   - Install Command: `npm install` (auto-filled)

3. **Environment Variables**:
   Add these environment variables in Vercel dashboard:
   ```
   MONGODB_URI=mongodb+srv://rudrasheth2201_db_user:AjWHinfAIKdHXrN6@cluster0.oeyajri.mongodb.net/compliance_db?retryWrites=true&w=majority
   JWT_SECRET=compliance_jwt_secret_2026_secure_key_change_in_production
   EMAIL_USER=stockmaster577@gmail.com
   EMAIL_PASS=obuauvyjlerywxke
   NODE_ENV=production
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your app will be live at: `https://your-project-name.vercel.app`

### Step 2: Verify Deployment

1. **Test Frontend**:
   - Visit your Vercel URL
   - Check if the login page loads

2. **Test API**:
   - Visit `https://your-project-name.vercel.app/api/health`
   - Should return: `{"success":true,"message":"Compliance API is running"}`

3. **Test Full Flow**:
   - Register a new account
   - Check email for OTP
   - Verify email and login
   - Test dashboard features

### Step 3: Custom Domain (Optional)

1. **Add Custom Domain**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Update Environment Variables**:
   - No changes needed for same-domain deployment

## 🔧 Environment Variables Reference

### Required Environment Variables
```env
# Database Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/compliance_db

# JWT Secret (use a strong, random string)
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Email Configuration (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Environment
NODE_ENV=production
```

## 📁 Project Structure for Vercel

```
compliance/
├── api/                    # Serverless API functions
│   ├── auth/
│   │   ├── login.js
│   │   ├── register.js
│   │   └── verify-email.js
│   ├── filings/
│   │   └── index.js
│   ├── notifications/
│   │   └── index.js
│   ├── compliance/
│   │   ├── dashboard.js
│   │   └── health-matrix.js
│   ├── health.js
│   └── _middleware.js
├── src/                    # React frontend
├── server/                 # Shared models and utilities
│   ├── models/
│   └── config/
├── dist/                   # Built frontend (auto-generated)
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

## 🚀 Deployment Features

### Frontend (Static Site)
- ✅ React + TypeScript + Vite
- ✅ Tailwind CSS + shadcn/ui
- ✅ Client-side routing
- ✅ Responsive design
- ✅ PWA ready

### Backend (Serverless Functions)
- ✅ Node.js + Express-style routing
- ✅ MongoDB integration
- ✅ JWT authentication
- ✅ Email services
- ✅ Input validation
- ✅ Audit logging

### Database
- ✅ MongoDB Atlas
- ✅ Serverless connection pooling
- ✅ Automatic scaling

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**:
   ```bash
   # Check dependencies
   npm install
   npm run build
   ```

2. **API Functions Don't Work**:
   - Check environment variables in Vercel dashboard
   - Verify MongoDB connection string
   - Check function logs in Vercel dashboard

3. **Authentication Issues**:
   - Verify JWT_SECRET is set
   - Check MongoDB connection
   - Ensure email service is configured

4. **Database Connection Fails**:
   - Check MongoDB Atlas network access (allow 0.0.0.0/0)
   - Verify connection string format
   - Ensure database user has proper permissions

### Debugging Steps:

1. **Check Vercel Function Logs**:
   - Go to Vercel dashboard → Functions tab
   - Click on any function to see logs

2. **Test API Endpoints**:
   ```bash
   # Health check
   curl https://your-app.vercel.app/api/health
   
   # Test registration
   curl -X POST https://your-app.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123"}'
   ```

3. **Monitor Performance**:
   - Use Vercel Analytics
   - Check function execution times
   - Monitor database performance in MongoDB Atlas

## 📊 Production Checklist

- [ ] Frontend deployed and accessible
- [ ] API functions working
- [ ] Database connected
- [ ] Environment variables configured
- [ ] Email service working
- [ ] Authentication flow tested
- [ ] All features working
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active
- [ ] Monitoring set up

## 🔒 Security Considerations

1. **Environment Variables**:
   - Never commit secrets to Git
   - Use strong JWT secrets
   - Rotate secrets regularly

2. **Database Security**:
   - Use MongoDB Atlas network restrictions
   - Enable database authentication
   - Regular security updates

3. **API Security**:
   - Rate limiting (built into Vercel)
   - Input validation
   - CORS configuration

## 📈 Scaling

Vercel automatically handles:
- ✅ Auto-scaling functions
- ✅ Global CDN
- ✅ Edge caching
- ✅ DDoS protection

## 💰 Cost Optimization

- Vercel Hobby plan: Free for personal projects
- Pro plan: $20/month for production apps
- MongoDB Atlas: Free tier available (512MB)

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints directly
4. Check database connectivity
5. Review MongoDB Atlas logs

---

**ComplianceOS** - Full-Stack Deployment on Vercel 🚀