# 🚀 SUPER SIMPLE: Deploy to GitHub in 5 Minutes

## Step 1: Go to https://github.com/new (Create Backend Repo)

**Fill in:**
- Repository name: `card-guardian-backend`
- Description: `Card Guardian Backend API`
- Visibility: Public
- Click "Create repository"

## Step 2: Upload Backend Files

You'll see this screen:

```
…or create a new repository on the command line
or push an existing repository from the command line
or import code from another repository
or upload files
```

**Click: "Upload files"** button (or go to green "Code" button → Upload files)

**Upload these 4 files:**
1. server.js
2. package.json
3. .env.example
4. vercel.json

Click "Commit changes"

✅ **Backend done!**

---

## Step 3: Go to https://github.com/new (Create Frontend Repo)

**Fill in:**
- Repository name: `card-guardian-frontend`
- Description: `Card Guardian Frontend`
- Visibility: Public
- Click "Create repository"

## Step 4: Upload Frontend Files

Click "Upload files" button

**Upload these 7 files:**
```
Root level:
- package.json
- index.html
- vite.config.js
- .env.example

Inside a folder called "src":
- main.jsx
- App.jsx
- index.css
```

**How to upload with folders:**
- GitHub automatically creates folders if you upload files into folder structure
- Just make sure files in src/ are inside src/ folder

Click "Commit changes"

✅ **Frontend done!**

---

## Step 5: Deploy Both to Vercel (Automatic)

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Enter your backend GitHub URL
4. Vercel auto-detects and deploys!
5. Add environment variables:
   - `MONGODB_URI` = (from MongoDB Atlas)
   - `JWT_SECRET` = your-secret-key
6. Redeploy
7. Copy backend URL

Repeat for frontend with:
- `VITE_API_URL` = your backend URL

---

## 📥 Download All Files Here:

I've organized all files by type. Pick what you need:

### Backend (4 files) - Download these:
- [ ] server.js
- [ ] package.json
- [ ] .env.example
- [ ] vercel.json

### Frontend (7 files) - Download these:
- [ ] package.json
- [ ] index.html
- [ ] vite.config.js
- [ ] .env.example
- [ ] main.jsx (put in src/ folder)
- [ ] App.jsx (put in src/ folder)
- [ ] index.css (put in src/ folder)

---

## ⏱️ Timeline:
- Step 1-2: 2 minutes (create backend, upload 4 files)
- Step 3-4: 2 minutes (create frontend, upload 7 files)
- Step 5: 1 minute (deploy to Vercel)

**Total: 5 minutes**

---

## 🎯 You're done when:
✅ Two GitHub repositories created  
✅ All 11 files uploaded  
✅ Both deployed on Vercel  
✅ Backend and Frontend URLs showing "Ready"

**Then:** Share those URLs with users! 🎉
