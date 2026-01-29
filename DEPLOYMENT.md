# Deployment & Update Guide

## Auto-Update System

Your TimeKeeper app now has an automatic update notification system that:

1. **Checks for updates on app start** - Automatically checks when the app loads
2. **Periodic checks** - Checks every 30 minutes for new versions
3. **Update notification** - Shows a notification card with changelog when updates are available
4. **One-click update** - Users can update by clicking the "Update Now" button

## How It Works

### Version Management

The app version is managed through `public/version.json`:

```json
{
  "version": "1.0.0",
  "releaseDate": "2026-01-28",
  "changelog": [
    "Initial release",
    "Task management with CRUD operations",
    "Calendar view with full-screen modal"
  ]
}
```

### Releasing Updates

When you want to release a new version:

1. **Make your code changes**
2. **Update version.json**:
   ```json
   {
     "version": "1.1.0",
     "releaseDate": "2026-02-01",
     "changelog": [
       "New feature: Task templates",
       "Improved: Calendar performance",
       "Fixed: Offline sync issues"
     ]
   }
   ```

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Release v1.1.0: Add task templates"
   git push origin main
   ```

4. **Deploy** (see deployment options below)

### Deployment Options

#### Option 1: GitHub Pages (Recommended for static hosting)

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

#### Option 2: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo at https://vercel.com
```

#### Option 3: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Or drag & drop dist folder at https://app.netlify.com
```

#### Option 4: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

## Maintaining Updates

### Regular Update Workflow

1. **Develop new features** on a feature branch
2. **Test thoroughly** locally
3. **Update version.json** with new version number and changelog
4. **Commit changes** with descriptive message
5. **Push to main branch**
6. **Deploy to hosting** (automated or manual)
7. **Users automatically see update notification** on their next visit or within 30 minutes

### Version Numbering

Follow semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes (2.0.0)
- **MINOR**: New features, backward compatible (1.1.0)
- **PATCH**: Bug fixes (1.0.1)

### Changelog Best Practices

- Start with action verbs: "Added", "Fixed", "Improved", "Changed"
- Be specific but concise
- Group by type: Features, Fixes, Performance
- Limit to 3-5 most important changes in notification

Example:
```json
{
  "version": "1.2.0",
  "releaseDate": "2026-02-15",
  "changelog": [
    "Added: Task recurring schedules",
    "Fixed: Calendar timezone issues",
    "Improved: Offline sync reliability",
    "Changed: Updated task form UI"
  ]
}
```

## CI/CD Setup (Optional)

### GitHub Actions Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

This will automatically deploy whenever you push to main!

## Monitoring Updates

Users will see an update notification like this:

```
┌─────────────────────────────────┐
│ 🔄 Update Available             │
│                                 │
│ Version 1.1.0 is now available! │
│                                 │
│ What's new:                     │
│ • Task recurring schedules      │
│ • Calendar timezone fixes       │
│ • Improved offline sync         │
│                                 │
│ [Update Now]                    │
└─────────────────────────────────┘
```

## Repository

Your code is now available at:
https://github.com/kanishkaGayan/scheduler

## Next Steps

1. Choose a hosting platform (GitHub Pages, Vercel, Netlify, or Firebase)
2. Deploy your app
3. Test the update notification by changing version.json
4. Set up CI/CD for automatic deployments (optional)
