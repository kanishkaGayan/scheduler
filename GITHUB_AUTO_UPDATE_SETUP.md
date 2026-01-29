# GitHub Auto-Update Setup Guide

## Overview
The TimeKeeper app is now configured to check for updates from GitHub releases automatically. When you open the app, it will check GitHub for new versions and notify you if an update is available.

## Setup Steps

### 1. Update the Repository Configuration
Edit `src/hooks/useVersionCheck.ts` and update the GitHub repository:

```typescript
const GITHUB_REPO = 'YOUR_USERNAME/timekeeper'; // Change this line
```

Replace `YOUR_USERNAME` with your GitHub username or organization.

**Example:**
```typescript
const GITHUB_REPO = 'kanishka-gayan/timekeeper';
```

### 2. Create a GitHub Repository
If you haven't already:
1. Go to [GitHub.com](https://github.com)
2. Create a new repository named `timekeeper`
3. Push your code to the repository

### 3. Create Release Tags
When you build a new version (e.g., 1.0.11), create a GitHub release:

1. Go to your repository on GitHub
2. Click **"Releases"** tab
3. Click **"Create a new release"**
4. **Tag version:** `v1.0.11` (must start with 'v')
5. **Release title:** `Version 1.0.11`
6. **Description:** Add changelog (markdown format):
   ```
   - Added version display in header
   - Added reminder notification for tomorrow's deadlines
   - Improved UI and performance
   ```
7. **Upload Assets:** Attach the AppImage and Windows installer files:
   - `TimeKeeper-1.0.11.AppImage`
   - `TimeKeeper Setup 1.0.11.exe`
8. Click **"Publish release"**

### 4. How It Works

**When you open the app:**
- It checks GitHub API for the latest release
- Compares the remote version with local version (1.0.11)
- If a new version is found, shows an update notification
- User can click to download the new version from GitHub

**Update Check Frequency:**
- On app startup
- Every 30 minutes while app is running

### 5. Version Format
Versions must follow semantic versioning: `major.minor.patch`
- Example: `1.0.11`
- Valid formats: `1.0`, `1.0.0`, `1.0.11`

### 6. Testing Auto-Update

**To test the update detection:**

1. Build current version (1.0.11):
   ```bash
   npm run electron:build      # Linux AppImage
   npm run electron:build:win  # Windows installer
   ```

2. Create a test release on GitHub with v1.0.11

3. Change version to 1.0.12 in:
   - `package.json`
   - `public/version.json`

4. Build again

5. Open the old version (1.0.11) - it should detect v1.0.12 is available

### 7. Fallback Mechanism
If GitHub is unreachable (no internet), the app falls back to:
- Checking local `public/version.json` file
- Update check continues to work offline

### 8. Next Steps

**Build and Release v1.0.11:**
```bash
npm run electron:build      # Linux
npm run electron:build:win  # Windows
```

Then create a GitHub release with these files and the AppImage/installer will be available for download through the update notification.

## Notes
- The GitHub API has rate limits (60 requests/hour without authentication)
- For production, consider using GitHub OAuth token for higher limits
- Users need internet connection to download updates
- The app auto-detects version and shows notification at the bottom-right

## Troubleshooting

**Update notification not showing:**
- Check browser console (F12) for errors
- Verify GitHub repository path is correct
- Ensure GitHub release is published (not draft)
- Check tag format is `vX.X.X`

**Update button not working:**
- Verify Assets are attached to GitHub release
- Check file names include `AppImage` or `TimeKeeper Setup`
- Ensure download URL is publicly accessible
