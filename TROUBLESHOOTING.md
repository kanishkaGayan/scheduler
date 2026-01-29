# Troubleshooting Guide

## Issue: "Failed to add task" Error

### What's Happening?
The Firestore database might not be set up, or security rules don't allow writing.

### Quick Diagnostic Steps

1. **Open Browser Console** (F12 → Console tab)
2. **Look for these logs:**
   - ✅ `Firebase initialized successfully` → Firebase connected
   - ✅ `Offline persistence enabled` → Offline mode ready
   - ❌ If you don't see these, Firebase isn't loading

3. **Click "+ Add Test Task"** and watch the console for:
   - `📝 Adding task to Firestore:...` → Request sent
   - `❌ Error adding task:` → Check the error details

### Common Error Messages & Fixes

#### ❌ "PERMISSION_DENIED: Missing or insufficient permissions"
**Cause:** Firestore security rules are blocking the write
**Fix:**
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select "scheduler-a63a0" project
- Go to Firestore → Rules tab
- Set to test mode rules (or see FIREBASE_SETUP.md)
- Click "Publish"

#### ❌ "FAILED_PRECONDITION: Cloud Firestore is not available"
**Cause:** Firestore database not created yet
**Fix:**
- Go to Firestore section in Firebase Console
- Click "Create Database"
- Choose "Start in test mode"
- Select region and enable

#### ❌ "DATABASE_UNAVAILABLE"
**Cause:** Firebase service temporarily down or wrong project
**Fix:**
- Check internet connection
- Verify you're using correct Firebase project credentials
- Try again in a few minutes

#### ❌ "INVALID_ARGUMENT: The operation you attempted requires a document"
**Cause:** The "tasks" collection doesn't exist
**Fix:**
- In Firebase Console, create a new collection named "tasks"
- Add at least one document to it
- Or add your first task through the app

### Debug Mode - Enable Detailed Logging

Add this to `src/firebase.ts` after initialization:

```typescript
// Enable Firebase debug logging
localStorage.debug = '*';
```

### Check Firestore Rules

Go to Firestore → Rules tab and see:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{document=**} {
      allow read, write: if request.auth != null;  // ← Requires auth
      // or for testing:
      allow read, write: if true;  // ← Open to all (test mode)
    }
  }
}
```

### Verify Collection Structure

1. Go to Firestore Console
2. You should see "tasks" collection
3. It should have at least one document
4. Each document should have fields:
   - `title` (string)
   - `description` (string)
   - `deadline` (Timestamp)
   - `priority` (string: "High", "Medium", "Low")
   - `status` (string: "Pending", "In-Progress", "Completed")

### Network Issues?

1. Open DevTools (F12)
2. Go to Network tab
3. Click "+ Add Test Task"
4. Look for request to `firestore.googleapis.com`
5. Check the response status:
   - 200 = Success
   - 403 = Permission denied
   - 503 = Service unavailable

### Still Stuck?

Check the browser console for the full error object:
```javascript
// You should see detailed error like:
{
  code: "permission-denied",
  message: "Missing or insufficient permissions",
  details: {...}
}
```

Search for that error code in [Firebase Documentation](https://firebase.google.com/docs/firestore/troubleshoot).

---

**Next Steps:** See `FIREBASE_SETUP.md` for complete setup instructions.
