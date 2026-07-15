# GitHub Setup Guide (Copy-Paste Instructions)

## What is GitHub?
GitHub is like a free cloud storage for code. You don't need to understand code to use it!

---

## Step 1: Create GitHub Account (2 minutes)

1. Go to https://github.com/signup
2. Enter your email
3. Create password
4. Click "Create account"
5. Verify email (check your inbox)
6. You now have a GitHub account! ✅

---

## Step 2: Download Your Code

### Option A: Using Git (Easiest)

1. Download Git from https://git-scm.com/download/win (Windows) or https://git-scm.com/download/mac (Mac)
2. Install it (accept all defaults)
3. Open Terminal/Command Prompt and run:

```bash
git clone https://github.com/YOUR-USERNAME/card-guardian-backend.git
cd card-guardian-backend
```

### Option B: Using GitHub Web (No Installation)

1. Go to your repository on GitHub
2. Click green "Code" button
3. Click "Download ZIP"
4. Extract the ZIP file to your computer

---

## Step 3: Create First Repository

### Backend Repository:

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `card-guardian-backend`
   - **Description**: Card Guardian Backend API
   - **Visibility**: Public
   - Uncheck "Add a README file" (we'll upload existing)
3. Click "Create repository"

4. You'll see instructions. Copy these lines to Terminal:
```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/card-guardian-backend.git
git push -u origin main
```

### Frontend Repository:

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `card-guardian-frontend`
   - **Description**: Card Guardian Frontend
   - **Visibility**: Public
3. Click "Create repository"
4. Follow same steps as above

---

## Step 4: Upload Files

### Using GitHub Web (Easiest - No Terminal):

1. Go to your repository
2. Click "Add file" → "Upload files"
3. Drag and drop your files or click to browse
4. Add commit message: "Initial commit"
5. Click "Commit changes"

### Using Terminal:

```bash
# Navigate to your folder
cd ~/card-guardian-backend

# Add all files
git add .

# Create a commit (like saving a version)
git commit -m "Initial commit"

# Push to GitHub (upload to cloud)
git push origin main
```

---

## Step 5: Connect to Vercel

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access GitHub
4. Click "New Project"
5. Select your repository
6. Vercel will automatically detect and deploy!

---

## What Does Each Folder Contain?

```
card-guardian/
├── backend/              ← API code (server)
│   ├── server.js        ← Main backend file
│   ├── package.json     ← Dependencies
│   └── .env.example     ← Configuration template
│
├── frontend/            ← Web interface (what users see)
│   ├── src/
│   │   ├── App.jsx      ← Main app
│   │   ├── index.css    ← Styling
│   │   └── main.jsx     ← Entry point
│   ├── index.html       ← HTML file
│   ├── vite.config.js   ← Build configuration
│   └── package.json     ← Dependencies
│
└── README.md            ← This guide
```

---

## Useful Commands

```bash
# Check if Git is installed
git --version

# Set up Git for first time
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"

# Check current folder
pwd

# Change folder
cd path/to/folder

# List files
ls (Mac/Linux) or dir (Windows)

# Push changes to GitHub
git add .
git commit -m "Your message"
git push

# See status
git status
```

---

## If You Get Stuck

1. **Error: "git command not found"** → Download Git from https://git-scm.com
2. **Error: "fatal: not a git repository"** → Run `git init` first
3. **Error: "Permission denied"** → Use `sudo` before command (Mac/Linux)
4. **Files not showing on GitHub** → Run `git push` to upload

---

## Video Tutorials

If you prefer videos instead:
- GitHub basics: https://www.youtube.com/watch?v=w3jLJU7DT5E
- Uploading to GitHub: https://www.youtube.com/watch?v=YKJ6c6sPHwo

---

## Summary

1. ✅ Create GitHub account
2. ✅ Create 2 repositories (backend + frontend)
3. ✅ Upload code files
4. ✅ Connect to Vercel
5. ✅ Done! Your app is live 🚀

**You don't need to understand any code - just follow the steps!**
