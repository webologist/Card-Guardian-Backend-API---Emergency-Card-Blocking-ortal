# 🚀 Card Guardian Deployment Checklist

Complete these steps in order. No coding knowledge needed!

---

## Phase 1: Account Setup (30 minutes)

### [ ] Step 1: Create GitHub Account
- [ ] Go to https://github.com/signup
- [ ] Sign up with email
- [ ] Verify email
- [ ] **Save your GitHub username and password**

### [ ] Step 2: Create MongoDB Account
- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create account
- [ ] Create new project: `Card Guardian`
- [ ] Create cluster: FREE TIER
- [ ] Create database user (username/password)
- [ ] Whitelist IP: 0.0.0.0/0
- [ ] Get connection string (looks like: `mongodb+srv://user:pass@cluster...`)
- [ ] **Save your MongoDB URI**

### [ ] Step 3: Create Vercel Account
- [ ] Go to https://vercel.com/signup
- [ ] Click "Continue with GitHub"
- [ ] Authorize Vercel
- [ ] **You're ready to deploy!**

---

## Phase 2: GitHub Setup (20 minutes)

### [ ] Step 4: Create Backend Repository
- [ ] Go to https://github.com/new
- [ ] Name: `card-guardian-backend`
- [ ] Visibility: Public
- [ ] Create repository
- [ ] Upload backend folder files (using GitHub web upload)
- [ ] **Save your repo URL**

### [ ] Step 5: Create Frontend Repository
- [ ] Go to https://github.com/new
- [ ] Name: `card-guardian-frontend`
- [ ] Visibility: Public
- [ ] Create repository
- [ ] Upload frontend folder files
- [ ] **Save your repo URL**

---

## Phase 3: Vercel Deployment (30 minutes)

### [ ] Step 6: Deploy Backend

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Enter backend GitHub repo URL: `https://github.com/YOUR-USERNAME/card-guardian-backend`
4. Wait for auto-detection
5. Click "Deploy"
6. Go to Project Settings → Environment Variables
7. Add these variables:
   - Key: `MONGODB_URI` | Value: `mongodb+srv://user:pass@cluster...`
   - Key: `JWT_SECRET` | Value: `your-secret-key-12345`
   - Key: `NODE_ENV` | Value: `production`
8. Click "Save"
9. Redeploy (find Redeploy button at top)
10. Wait for "Ready" status
11. **Copy your backend URL** (looks like: `https://card-guardian-backend.vercel.app`)

### [ ] Step 7: Deploy Frontend

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Enter frontend GitHub repo URL: `https://github.com/YOUR-USERNAME/card-guardian-frontend`
4. Framework: Vite
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Environment Variables:
   - Key: `VITE_API_URL` | Value: `https://your-backend-url.vercel.app/api`
   - (Replace with your actual backend URL from Step 6)
8. Click "Deploy"
9. Wait for "Ready" status
10. **Copy your frontend URL** (looks like: `https://card-guardian-frontend.vercel.app`)

---

## Phase 4: Testing (10 minutes)

### [ ] Step 8: Test Your App

1. Open your frontend URL in browser
2. **Login Screen** appears ✓
3. Enter phone: `9876543210`
4. Enter OTP: `123456`
5. Click "Verify OTP & Login"
6. **Dashboard** appears ✓
7. Click "Start blocking now"
8. Select bank: HDFC Bank
9. Card type: Debit
10. Last 4 digits: `8765`
11. Click "Proceed to SMS"
12. See SMS message pre-filled ✓
13. Everything works! 🎉

---

## Phase 5: Going Live

### [ ] Step 9: Configure Domain (Optional)

If you have a custom domain:
1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records (instructions provided by Vercel)

### [ ] Step 10: Set Up Monitoring

1. Go to Vercel dashboard
2. Check "Deployments" tab regularly
3. Check logs if something breaks

---

## Important URLs to Save

```
GitHub Backend Repo: https://github.com/USERNAME/card-guardian-backend
GitHub Frontend Repo: https://github.com/USERNAME/card-guardian-frontend
MongoDB URI: mongodb+srv://user:pass@cluster...
Vercel Backend: https://card-guardian-backend.vercel.app
Vercel Frontend: https://card-guardian-frontend.vercel.app
```

---

## If Something Goes Wrong

| Problem | Solution |
|---------|----------|
| Frontend won't load | Check if Vercel says "Ready" |
| Can't login | Check backend environment variables are set |
| Database error | Verify MongoDB URI in environment variables |
| Page is blank | Open browser console (F12) → look for errors |
| Deployment failed | Check Vercel build logs (click on failed deployment) |

---

## What Happens Next?

After deployment:
✅ App is live on the internet
✅ Users can access from any device
✅ Database stores information securely
✅ Backend API handles all requests
✅ Frontend shows beautiful UI

---

## Maintenance Tasks

- [ ] Monthly: Check Vercel logs for errors
- [ ] Quarterly: Add new banks to database
- [ ] Quarterly: Review user statistics
- [ ] Quarterly: Update dependencies (if Dependabot alerts appear)

---

## Success! 🎉

Your Card Guardian app is now live and ready to help users block their cards in emergencies!

**Backend:** `https://card-guardian-backend.vercel.app`  
**Frontend:** `https://card-guardian-frontend.vercel.app`

Share these links with your users!

---

**Questions?** Refer to README.md or GITHUB_SETUP.md

**Need help?** Check Vercel or GitHub documentation online
