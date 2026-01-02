# 🚀 Deploying JoyPop to Vercel

This guide will walk you through deploying your JoyPop app to Vercel in just a few minutes.

## Prerequisites

- ✅ GitHub repository with your code (already done!)
- ✅ A [Vercel account](https://vercel.com/signup) (free tier works great)
- ✅ Your Supabase project credentials

---

## Step 1: Connect GitHub to Vercel

1. Go to [Vercel](https://vercel.com) and sign in (or create an account)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select your `joypop-app` repository
   - If you don't see it, click **"Adjust GitHub App Permissions"** to grant access

---

## Step 2: Configure Your Project

### Framework Preset
- Vercel should automatically detect **Next.js** ✅
- If not, select it from the dropdown

### Root Directory
- Leave as `./` (root)
- **IMPORTANT:** If your code is in a `src` subdirectory, set Root Directory to `src`

### Build Settings
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

> [!TIP]
> You usually don't need to change these - Vercel's defaults work perfectly!

---

## Step 3: Add Environment Variables

This is the most important step! Click **"Environment Variables"** and add:

### Required Variables

| Name | Value | Where to Find It |
|------|-------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | [Supabase Dashboard](https://app.supabase.com) → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Same location as above |

### How to Add Each Variable:

1. Type the variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
2. Paste the value from your Supabase dashboard
3. Click **"Add"**
4. Repeat for the second variable

> [!IMPORTANT]
> Make sure to copy these values exactly from your Supabase project settings. Any typos will break authentication!

---

## Step 4: Deploy! 🎉

1. Click **"Deploy"**
2. Wait 2-3 minutes while Vercel builds your app
3. You'll see a success screen with your live URL!

Your app will be live at: `https://joypop-app.vercel.app` (or similar)

---

## Step 5: Test Your Deployment

Visit your new URL and verify:

- ✅ App loads without errors
- ✅ You can sign in with magic link
- ✅ Stars can be added to the jar
- ✅ Savouring, gratitude, and kindness features work
- ✅ PWA installation works on mobile

> [!TIP]
> To install as a PWA on mobile:
> - **iOS Safari:** Tap Share → Add to Home Screen
> - **Android Chrome:** Tap menu → Install App

---

## 🔄 Automatic Deployments

Great news! Every time you push to your `main` branch on GitHub, Vercel will automatically:
1. Build your app
2. Run checks
3. Deploy the new version

No manual work needed! 🎊

---

## 🐛 Troubleshooting

### Build Fails

**Error:** `Module not found` or `Cannot find module`
- **Solution:** Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error:** `Environment variable not defined`
- **Solution:** Double-check your environment variables in Vercel dashboard
- Go to Project Settings → Environment Variables

### App Loads But Features Don't Work

**Problem:** Can't sign in or create stars
- **Solution:** Verify your Supabase environment variables are correct
- Check Supabase dashboard for any authentication errors

**Problem:** PWA won't install
- **Solution:** Make sure you're accessing via HTTPS (Vercel provides this automatically)
- Clear browser cache and try again

### White Screen or 404 Error

**Problem:** App shows blank page
- **Solution:** Check Vercel deployment logs for errors
- Verify the build completed successfully
- Make sure Root Directory is set correctly (should be `src` if your code is in a subdirectory)

---

## 📊 Monitoring Your App

### View Deployment Logs
1. Go to your Vercel dashboard
2. Click on your project
3. Click on any deployment to see detailed logs

### Check Analytics
- Vercel provides free analytics
- Go to your project → Analytics tab
- See visitor counts, performance metrics, and more

---

## 🔐 Security Notes

> [!CAUTION]
> Never commit your `.env.local` file to GitHub! It contains sensitive credentials.

The `.gitignore` file already excludes this, but always double-check before pushing.

Your `NEXT_PUBLIC_*` variables are safe to expose in the browser - they're designed for client-side use.

---

## 🎨 Custom Domain (Optional)

Want to use your own domain like `joypop.com`?

1. Go to Project Settings → Domains
2. Add your domain
3. Follow Vercel's DNS configuration instructions
4. Wait for DNS propagation (5-30 minutes)

---

## ✅ You're Done!

Your JoyPop app is now live and accessible worldwide! 🌍

Every code change you push will automatically deploy. Happy coding! 💜

---

**Need Help?** Check the [Vercel Documentation](https://vercel.com/docs) or [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
