# Firebase Setup Guide for TimeKeeper

Your Firebase credentials are already configured in `src/firebase.ts`. Now you need to set up your Firestore database and security rules.

## ✅ Current Status
- Firebase project: **scheduler-a63a0**
- Firebase credentials: **✅ Already configured**
- Offline persistence: **✅ Enabled**
- TypeScript errors: **✅ Fixed**

## 🔥 What to Do Now

### Step 1: Create Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project **"scheduler-a63a0"**
3. Navigate to **Firestore Database** (left sidebar)
4. Click **"Create Database"**
5. Choose **Start in test mode** (for development)
6. Select region: **us-central1** (or nearest to you)
7. Click **"Enable"**

### Step 2: Set Firestore Security Rules
⚠️ **IMPORTANT:** Test mode allows anyone to read/write. Update for production.

1. In Firestore, go to **Rules** tab
2. Replace the rules with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users
    // For development, you can use this permissive rule:
    match /tasks/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### Step 3: Create "tasks" Collection
1. In Firestore Console, click **"Create Collection"**
2. Collection ID: `tasks`
3. Add your first document (click "Auto ID"):
   ```json
   {
     "title": "Welcome to TimeKeeper",
     "description": "This is your first task",
     "deadline": 2026-02-01T00:00:00Z,
     "priority": "Low",
     "status": "Completed"
   }
```

### Step 4: Test the Connection
1. Open your app at `http://localhost:5173/`
2. Check the **Browser Console** (F12 → Console tab)
3. You should see:
   ```
   ✅ Firebase initialized successfully
   ✅ Offline persistence enabled
   ```

4. Click **"+ Add Test Task"** button
5. Check the console for:
   - `📝 Adding task to Firestore:...`
   - `✅ Task added successfully with ID: ...`

### Step 5: Troubleshooting

**Error: "Missing or insufficient permissions"**
- Check your Firestore security rules
- Ensure "tasks" collection exists
- Verify you're in the correct Firebase project

**Error: "Database not found"**
- Create the Firestore database (Step 1)
- Use `us-central1` region

**No tasks appearing:**
- The app fetches tasks on load
- Make sure you have documents in the `tasks` collection
- Check browser console for errors

**Offline persistence warning:**
- This is normal in development with multiple tabs
- Close extra browser tabs if needed

### Reference: Task Document Structure

```json
{
  "title": "string",
  "description": "string",
  "deadline": "Timestamp (Firestore will auto-convert from JS Date)",
  "priority": "High | Medium | Low",
  "status": "Pending | In-Progress | Completed"
}
```

## 📝 Next Steps

Once Firestore is set up and working:

1. **Remove Test Button** - Delete the "+ Add Test Task" button from `src/App.tsx`
2. **Add Real Features:**
   - Add new task form
   - Edit task functionality
   - Delete task button
   - Status update dropdown
3. **Add Authentication** - Implement Firebase Auth to secure data per user
4. **Production Rules** - Set up proper security rules based on auth

---

**Support:** Check the browser console (F12) for detailed error messages and logs.
