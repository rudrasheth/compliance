# Compliance Management System

A full-stack compliance management application built with React, Node.js, Express, and MongoDB with complete authentication system.

## 🚀 Features

### **Authentication & Security**
- **User Registration** with email verification
- **Secure Login** with JWT tokens
- **Email Verification** with OTP system
- **Password Reset** via email
- **Profile Management** with user settings
- **Session Management** with automatic logout
- **Welcome Emails** for new users

### **Core Features**
- **Dashboard**: Real-time compliance overview with health matrix and charts
- **Filings Management**: Track tax returns and compliance documents
- **Kanban Workflow**: Drag-and-drop filing status management
- **Audit Logs**: Complete system activity tracking
- **Notifications**: Real-time alerts and reminders
- **Calendar**: Deadline tracking and scheduling
- **Settings**: User preferences and system configuration

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **React Router** for navigation
- **React Query** for API state management
- **React Beautiful DnD** for drag-and-drop

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** authentication with bcrypt
- **Nodemailer** for email services
- **Express Validator** for input validation
- **Helmet** for security
- **CORS** for cross-origin requests
- **Rate limiting** for API protection

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- Gmail account for email services
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd compliance-matrix
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in the server directory:
```env
MONGODB_URI=mongodb+srv://rudrasheth2201_db_user:AjWHinfAIKdHXrN6@cluster0.oeyajri.mongodb.net/compliance_db?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
EMAIL_USER=stockmaster577@gmail.com
EMAIL_PASS=obuauvyjlerywxke
FRONTEND_URL=http://localhost:8080
```

Seed the database:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
# In the root directory
npm install
```

Create `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 🔐 Authentication Flow

### Registration Process
1. User fills registration form
2. System validates input and creates account
3. OTP sent to user's email
4. User verifies email with OTP
5. Welcome email sent upon successful verification
6. User redirected to dashboard

### Login Process
1. User enters email and password
2. System validates credentials
3. JWT token generated and stored
4. User redirected to dashboard
5. Protected routes accessible

### Password Reset
1. User requests password reset
2. Reset link sent to email
3. User clicks link and sets new password
4. Account access restored

## 📊 Database Schema

### Collections

#### Users
- Personal information (name, email, company)
- Authentication data (hashed password, tokens)
- Email verification status
- Role and permissions

#### Filings
- Title, type, due date, status, priority
- Documents, acknowledgment numbers
- Created/updated by tracking

#### AuditLogs  
- User actions, entities, timestamps
- Authentication events (login, logout, registration)
- Status tracking (success/pending/failed)
- IP address and user agent logging

#### Notifications
- Title, message, type, priority
- Read/unread status
- User-specific notifications

#### ComplianceMetrics
- Monthly compliance scores
- Filing statistics and trends
- Performance tracking

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification with OTP
- `POST /api/auth/resend-otp` - Resend verification OTP
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### Filings
- `GET /api/filings` - Get all filings
- `POST /api/filings` - Create new filing
- `PUT /api/filings/:id` - Update filing
- `DELETE /api/filings/:id` - Delete filing
- `GET /api/filings/status/overview` - Get overview stats

### Audit Logs
- `GET /api/audit-logs` - Get audit logs
- `GET /api/audit-logs/stats` - Get audit statistics

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/mark-all-read` - Mark all as read

### Compliance
- `GET /api/compliance/metrics` - Get compliance metrics
- `GET /api/compliance/health-matrix` - Get health matrix data
- `GET /api/compliance/dashboard` - Get dashboard overview

## 📧 Email Features

### Email Templates
- **Welcome Email**: Sent after successful registration
- **OTP Verification**: 6-digit code for email verification
- **Password Reset**: Secure reset link with expiration
- **Professional Design**: Responsive HTML templates

### Email Configuration
- **Gmail SMTP** integration
- **Automatic sending** for user actions
- **Error handling** with fallback options
- **Security** with app-specific passwords

## 🔒 Security Features

- **Password Hashing** with bcrypt (12 rounds)
- **JWT Tokens** with expiration (7 days)
- **Rate Limiting** (100 requests per 15 minutes)
- **Input Validation** with express-validator
- **CORS Protection** with whitelist
- **Helmet.js** for security headers
- **MongoDB Injection** protection
- **Environment Variables** for sensitive data

## 🎨 UI/UX Features

- **Responsive Design** for all screen sizes
- **Protected Routes** with authentication checks
- **Loading States** and error handling
- **Real-time Updates** with optimistic UI
- **Form Validation** with visual feedback
- **Toast Notifications** for user feedback
- **Password Strength** indicators
- **Professional Styling** with Tailwind CSS

## 📱 Pages & Components

### Authentication Pages
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - Account creation
- **Verify Email** (`/verify-email`) - OTP verification
- **Forgot Password** (`/forgot-password`) - Password reset request
- **Reset Password** (`/reset-password`) - New password setup

### Application Pages
- **Dashboard** (`/`) - Main overview (Protected)
- **Filings** (`/filings`) - Document management (Protected)
- **Calendar** (`/calendar`) - Deadline tracking (Protected)
- **Audit** (`/audit`) - Activity logs (Protected)
- **Notifications** (`/notifications`) - Alerts (Protected)
- **Settings** (`/settings`) - Configuration (Protected)

### Key Components
- **ProtectedRoute** - Authentication wrapper
- **AuthManager** - State management
- **HealthMatrix** - Compliance status grid
- **ComplianceChart** - Score trend visualization
- **KanbanBoard** - Workflow management
- **AuditLogsTable** - Activity tracking
- **CountdownTimer** - Deadline alerts

## 🚀 Deployment

## 🚀 Deployment

### Quick Deploy to Vercel

1. **Fork/Clone the repository**
2. **Deploy Frontend to Vercel**:
   - Connect your GitHub repository to Vercel
   - Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`
   - Deploy automatically

3. **Deploy Backend** (choose one):
   - **Railway**: Connect repository, set environment variables, deploy
   - **Render**: Create web service, configure environment, deploy
   - **Heroku**: Use Heroku CLI or GitHub integration

4. **Configure Environment Variables**:
   ```bash
   # Frontend (Vercel)
   VITE_API_URL=https://your-backend-url.com/api
   
   # Backend (Railway/Render/Heroku)
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Backend Deployment
1. Set production environment variables
2. Update CORS origins for production domain
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Ensure MongoDB Atlas is accessible
5. Configure email service for production

### Frontend Deployment
1. Update `VITE_API_URL` to production API URL
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or similar platforms
4. Configure environment variables in deployment platform

## 🔄 Development Workflow

### Adding New Features
1. Create API endpoints in `/server/routes/`
2. Add database models in `/server/models/`
3. Update API client in `/src/lib/api.ts`
4. Create/update React components
5. Add routing if needed
6. Update authentication if required

### Database Changes
1. Update Mongoose models
2. Create migration scripts if needed
3. Update seed data in `/server/scripts/seedData.js`
4. Test with fresh database

## 🐛 Troubleshooting

### Common Issues

**Authentication Errors**
- Check JWT secret configuration
- Verify token expiration settings
- Ensure proper CORS setup

**Email Not Sending**
- Verify Gmail app password
- Check email service configuration
- Review firewall settings

**MongoDB Connection Failed**
- Check MongoDB URI in `.env`
- Verify network access in MongoDB Atlas
- Ensure correct database name

**API Not Responding**
- Check if backend server is running on port 5000
- Verify CORS configuration
- Check network connectivity

**Frontend Build Errors**
- Clear node_modules and reinstall
- Check TypeScript errors
- Verify environment variables

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.