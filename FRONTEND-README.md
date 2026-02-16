# AI Invoice Generator - Frontend

Complete frontend for the AI-powered invoice management application built with React, Tailwind CSS, and integrated with backend APIs.

## 🎯 Features

- ✅ **Landing Page** - Hero, Features, Testimonials, FAQ, Footer
- ✅ **Authentication** - Login, Signup with JWT
- ✅ **Dashboard** - Stats cards, AI insights, recent invoices
- ✅ **Invoice Management** - Create, view, edit, delete invoices
- ✅ **AI Features** - Generate invoices from text, payment reminders
- ✅ **Profile Management** - Edit user and business information
- ✅ **Print/Download** - Export invoices as PDF

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── landing/
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── FAQ.jsx
│   │   │   └── Footer.jsx
│   │   ├── layout/
│   │   │   └── DashboardLayout.jsx
│   │   └── ui/
│   │       └── ProfileDropdown.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── login.jsx
│   │   │   └── signup.jsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── Invoices/
│   │   │   ├── AllInvoices.jsx
│   │   │   ├── CreateInvoice.jsx
│   │   │   └── InvoiceDetails.jsx
│   │   ├── LandingPage/
│   │   │   └── LandingPage.jsx
│   │   └── profile/
│   │       └── ProfilePage.jsx
│   ├── utils/
│   │   └── axiosInstance.js
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Install Required Packages

Make sure these packages are installed:

```bash
npm install react-router-dom axios react-hot-toast lucide-react
```

### 3. Environment Variables

Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Change the URL to match your backend server.

### 4. File Placement

Make sure all files are placed according to the project structure above. 

**Key files to verify:**
- ✅ `src/context/AuthContext.jsx`
- ✅ `src/utils/axiosInstance.js`
- ✅ `src/components/auth/ProtectedRoute.jsx`
- ✅ `src/App.jsx` (updated with AuthProvider)

### 5. Start Development Server

```bash
npm run dev
```

The app should open at `http://localhost:5173`

## 🔧 Configuration

### Backend API Connection

Update the backend URL in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Or change the default in `src/utils/axiosInstance.js`:
```javascript
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
```

### Tailwind CSS

Tailwind is already configured. If you need to customize:
- Edit `tailwind.config.js`
- Add custom styles in `src/index.css`

## 📦 Dependencies

Main packages used:
- **React** - UI framework
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Tailwind CSS** - Styling

## 🎨 Key Pages

### Landing Page (/)
- Hero section with CTA buttons
- Features showcase
- Testimonials
- FAQ accordion
- Footer with links

### Authentication
- `/login` - Login page
- `/signup` - Signup with business info

### Dashboard (/dashboard)
- Stats cards (Total, Paid, Unpaid, Revenue)
- AI Insights generator
- Recent invoices table

### Invoices
- `/invoices` - All invoices (searchable, filterable)
- `/invoices/new` - Create new invoice
- `/invoices/:id` - Invoice details (print/download)

### Profile (/profile)
- View/edit personal info
- Update business details

## 🔐 Authentication Flow

1. User signs up → JWT token stored in localStorage
2. Token sent with every API request via axios interceptor
3. Protected routes check authentication via ProtectedRoute component
4. Automatic redirect to /login if unauthorized

## 🎯 API Integration

All API calls use `axiosInstance` which:
- Automatically adds JWT token to headers
- Handles 401 errors (auto-logout)
- Base URL configurable via .env

## 🖨️ Print/Download Features

Invoice details page supports:
- Print to PDF via browser print dialog
- Responsive print styles
- Professional invoice layout

## 🤖 AI Features

### Create Invoice with AI
- Paste email or text
- AI extracts client info, items, amounts
- Auto-generates structured invoice

### Payment Reminders
- AI generates professional reminder emails
- Copy to clipboard
- Customize and send

### Dashboard Insights
- AI analyzes invoicing patterns
- Revenue trends
- Recommendations

## 🐛 Troubleshooting

### "Module not found" errors
- Check file paths match the structure
- Verify all files are in correct directories

### "axiosInstance" errors
- Ensure `utils/axiosInstance.js` exists
- Check it has `export default axiosInstance`
- Run `npm install axios`

### Blank page
- Check browser console for errors
- Verify backend is running
- Check `.env` file exists with correct API URL

### Styles not working
- Verify Tailwind CSS is configured
- Check `index.css` imports Tailwind directives
- Restart dev server

## 📝 Notes for Backend Integration

The frontend expects these API endpoints:

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Invoices
- `GET /api/invoices` - Get all user's invoices
- `GET /api/invoices/:id` - Get single invoice
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### AI
- `POST /api/ai/create-invoice` - Generate invoice from text
- `POST /api/ai/reminder/:id` - Generate payment reminder
- `GET /api/ai/insights` - Get dashboard insights

## 🎓 Interview Tips

When discussing this project:

1. **Mention the architecture**
   - Component-based React structure
   - Context API for state management
   - Protected routes for security
   - Axios interceptors for auth

2. **Highlight features**
   - JWT authentication
   - CRUD operations
   - AI integration
   - Responsive design
   - Print/PDF functionality

3. **Technical decisions**
   - Why Context API over Redux (simpler for small app)
   - Axios over fetch (interceptors, better error handling)
   - Tailwind CSS (rapid development, consistency)

4. **Be honest**
   - If asked about specific implementations, explain what you learned
   - Mention you followed best practices from tutorials/documentation
   - Show enthusiasm for learning more

## 📚 Learning Resources

- React: https://react.dev
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- Axios: https://axios-http.com

## 🎉 You're Ready!

Frontend is complete and ready to connect with your backend. Good luck with your interview at Tagalys! 💪

---

*