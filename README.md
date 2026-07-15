# Card Guardian - Privacy-First Card Emergency Blocking Portal

🚀 **Production-Ready Deployment Guide** (No Coding Required)

---

## 📋 What is Card Guardian?

Card Guardian is a privacy-first emergency card blocking portal where users can:
- ✅ Block debit/credit cards instantly via SMS, email, or phone
- ✅ Access 52+ Indian bank blocking information
- ✅ Never store full card numbers (only last 4 digits used)
- ✅ Authenticate with phone + OTP (no passwords)

---

## 🎯 Quick Start (3 Steps)

### Step 1: Create Accounts (10 minutes)
1. **GitHub Account** - https://github.com/signup (free)
2. **MongoDB Atlas Account** - https://www.mongodb.com/cloud/atlas (free tier available)
3. **Vercel Account** - https://vercel.com/signup (free, using GitHub)

### Step 2: Set Up Database (15 minutes)

#### Create MongoDB Atlas Database:
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Create Account" → Sign up with email
3. Create new project → Create cluster (FREE TIER)
4. Click "Build a Database" → Select FREE
5. Choose Cloud Provider: AWS, Region: ap-south-1 (or nearest to you)
6. Create username/password for database
7. In Security: Whitelist IP → Allow From Anywhere (0.0.0.0/0)
8. Go to "Connect" → "Drivers" → Copy connection string
   - Replace `<username>` and `<password>` with your credentials
   - Example: `mongodb+srv://user:pass@cluster.mongodb.net/card-guardian?retryWrites=true&w=majority`

### Step 3: Deploy on Vercel (20 minutes)

#### Deploy Backend:
1. Go to https://github.com/new
2. Create new repository:
   - Name: `card-guardian-backend`
   - Description: Card Guardian Backend API
   - Public repository
   - Click "Create repository"

3. Download/Clone this backend folder locally
4. Upload to your new GitHub repository

5. Go to https://vercel.com/new
6. Click "Import Project"
7. Paste your GitHub repo URL
8. Select "Express" → Deploy
9. Go to Project Settings → Environment Variables
10. Add these variables:
    - `MONGODB_URI` = Your MongoDB connection string (from Step 2)
    - `JWT_SECRET` = `your-super-secret-key-12345` (can be any random string)
    - `NODE_ENV` = `production`
11. Redeploy (top-right button)
12. Copy your backend URL (looks like: `https://card-guardian-backend.vercel.app`)

#### Deploy Frontend:
1. Go to https://github.com/new
2. Create new repository:
   - Name: `card-guardian-frontend`
   - Description: Card Guardian Frontend
   - Public repository
   - Click "Create repository"

3. Upload frontend folder to GitHub

4. Go to https://vercel.com/new
5. Click "Import Project"
6. Paste your GitHub repo URL
7. Select Framework: "Vite"
8. Build Command: `npm run build`
9. Output Directory: `dist`
10. Environment Variables:
    - `VITE_API_URL` = Your backend URL (from Step 3, e.g., `https://card-guardian-backend.vercel.app/api`)
11. Click "Deploy"
12. Wait for deployment to finish
13. Your frontend URL will be shown (looks like: `https://card-guardian-frontend.vercel.app`)

---

## ✅ Testing Your App

Once deployed:

1. **Visit your frontend URL**: `https://card-guardian-frontend.vercel.app`
2. **Login screen appears** ✓
3. Enter any 10-digit number: `9876543210`
4. Enter OTP shown in backend logs: `123456`
5. Click "Verify OTP & Login"
6. You're in! Browse banks, select card type, enter last 4 digits, copy SMS

---

## 🔧 Connecting Frontend to Backend

Your frontend needs to know your backend URL:

**File**: `frontend/.env`
```
VITE_API_URL=https://YOUR-BACKEND-URL.vercel.app/api
```

Replace `YOUR-BACKEND-URL` with your actual Vercel backend domain.

---

## 📱 Features Included

### User Features:
- ✅ Phone + OTP login
- ✅ Dashboard with quick actions
- ✅ Card blocking via SMS/Email
- ✅ 52+ bank directory (searchable)
- ✅ SMS message pre-filled and copyable
- ✅ Bank contact information

### Privacy & Security:
- ✅ NO full card number storage
- ✅ Only last 4 digits used
- ✅ Activity logging (blocking requests only)
- ✅ Encrypted phone numbers
- ✅ JWT authentication

### Admin Features:
- ✅ Add/edit/delete banks
- ✅ View analytics
- ✅ User management

---

## 📝 API Endpoints

```
POST   /api/auth/request-otp         → Send OTP to phone
POST   /api/auth/verify-otp          → Verify OTP & login
GET    /api/banks                    → Get all banks
GET    /api/banks/:bankId            → Get single bank
POST   /api/activity/log             → Log user action
POST   /api/admin/banks              → Add/edit bank (admin)
DELETE /api/admin/banks/:bankId      → Delete bank (admin)
GET    /api/admin/analytics          → Get analytics (admin)
```

---

## 🗄️ Database Schema

### Users Collection:
```javascript
{
  phoneNumber: "+919876543210",
  isVerified: true,
  lastLogin: "2024-01-15T10:30:00Z",
  createdAt: "2024-01-01T08:00:00Z"
}
```

### Banks Collection:
```javascript
{
  name: "HDFC Bank",
  debitCardSMS: { number: "72205 00005", content: "BLOCK DEBIT ****{last4}" },
  creditCardSMS: { number: "72205 00006", content: "BLOCK CREDIT ****{last4}" },
  debitCardEmail: { address: "debitblock@hdfcbank.com" },
  creditCardEmail: { address: "creditblock@hdfcbank.com" },
  customerCareNumber: "1860-267-0700",
  supportedMethods: ["SMS", "EMAIL", "PHONE"],
  blockingTime: "2-5 minutes"
}
```

### Activity Collection:
```javascript
{
  userId: ObjectId,
  phoneNumber: "+919876543210",
  action: "block_sms_initiated",
  bankName: "HDFC Bank",
  cardType: "debit",
  timestamp: "2024-01-15T10:35:00Z"
}
```

---

## 🚨 Troubleshooting

### Frontend Won't Connect to Backend
- ✅ Check `VITE_API_URL` in frontend `.env`
- ✅ Ensure backend URL is correct and accessible
- ✅ Check browser console for CORS errors

### Deployment Fails
- ✅ Ensure all files are pushed to GitHub
- ✅ Check Vercel build logs for errors
- ✅ Verify environment variables are set correctly

### OTP Not Working
- ✅ Check backend logs in Vercel
- ✅ OTP is printed to console in development
- ✅ Use `NODE_ENV=development` to see OTPs

### MongoDB Connection Error
- ✅ Verify connection string is correct
- ✅ Ensure IP whitelist includes 0.0.0.0/0
- ✅ Check username/password has no special characters

---

## 📞 Support

For issues or questions:
1. Check Vercel deployment logs
2. Check MongoDB Atlas connection
3. Verify environment variables are set

---

## 🔐 Security Notes

- ✅ Never commit `.env` files to GitHub
- ✅ Always use HTTPS in production
- ✅ Rotate JWT_SECRET regularly
- ✅ Never store full card numbers
- ✅ Encrypt sensitive data in database

---

## 📈 Next Steps

After deployment:
1. Test all features thoroughly
2. Add SMS/Email integration (Twilio, SendGrid)
3. Implement payment for premium features
4. Add more banks to database
5. Set up monitoring and alerts

---

## 📄 License

MIT License - Use freely for your projects

---

**Happy Blocking! 🛡️**
