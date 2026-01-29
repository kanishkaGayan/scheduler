# Quick Setup: GitHub Auto-Update for TimeKeeper

## ⚡ 3 Steps to Enable Auto-Update

### Step 1️⃣ - Update GitHub Config (1 minute)
Open `src/hooks/useVersionCheck.ts` and change line 21:

**Before:**
```typescript
const GITHUB_REPO = 'kanishka-gayan/timekeeper'; // Change this to your repo
```

**After (your username):**
```typescript
const GITHUB_REPO = 'YOUR_USERNAME/timekeeper';
```

### Step 2️⃣ - Build Release (2 minutes)
```bash
cd /home/kanishka/Desktop/majorProjects/scheduler

# Linux AppImage
npm run electron:build

# Windows installer  
npm run electron:build:win
```

### Step 3️⃣ - Create GitHub Release (3 minutes)

**On GitHub.com:**
1. Go to your `timekeeper` repo
2. Click **Releases** → **Create new release**
3. Fill in:
   - **Tag:** `v1.0.11`
   - **Title:** `Version 1.0.11`
   - **Description:**
     ```
     - Added version display in header
     - Added reminder for tomorrow's deadlines
     - Improved UI
     ```
4. **Upload files:**
   - From `/release/TimeKeeper-1.0.11.AppImage`
   - From `/release/TimeKeeper Setup 1.0.11.exe`
5. Click **Publish release**

## ✅ That's It!

Now when you open the app:
- It will check GitHub every 30 minutes
- If new version exists, shows notification
- Users can click "Download" to get new version

## 🔍 How to Test

1. Create release `v1.0.11` (above steps)
2. Change version to `1.0.12`:
   - Edit `package.json` line 4
   - Edit `public/version.json` line 2
3. Run `npm run electron:build` again
4. Create another release `v1.0.12`
5. Open old v1.0.11 - should see update notification!

## 📝 Version Tags Must Be

```
v1.0.11     ✅ Correct
v1.0        ✅ Correct  
v1          ✅ Correct
1.0.11      ❌ Wrong (needs v prefix)
release-1.0 ❌ Wrong
```

## 📲 What Users See

**Update Notification at bottom-right:**
```
┌─────────────────────────────────┐
│ ⬇️  Update Available             │ ✕
│                                 │
│ Version 1.0.11 is now           │
│ available on GitHub!            │
│                                 │
│ What's new:                     │
│ • Version display in header     │
│ • Tomorrow deadline reminder    │
│ • Improved UI                   │
│                                 │
│  [ Later ]  [ Download ]        │
└─────────────────────────────────┘
```

Click **Download** → Opens GitHub release in browser → Download AppImage/installer

## ⚠️ Important Notes

- Update check needs **internet connection**
- Checks happen on app startup + every 30 minutes
- GitHub API allows 60 checks/hour (plenty for 2 checks/hour)
- Changelog from GitHub release body is auto-detected
- Works offline - falls back to local version.json

## 🆘 Troubleshooting

**"Not detecting update"**
- Verify GITHUB_REPO matches your repo
- Check GitHub release tag is `v1.0.11` format
- Open browser console (F12) to see errors
- Check release is "Published" not "Draft"

**"Download button not working"**
- Verify AppImage file uploaded to release
- Check file name contains "AppImage" 
- Release must be published (not draft)

**"Can't find my repo"**
- Create repo at github.com/YOUR_USERNAME/timekeeper
- Push code there first
- Then create releases

## 📚 Full Documentation

See `GITHUB_AUTO_UPDATE_SETUP.md` for detailed guide with screenshots and advanced setup.
