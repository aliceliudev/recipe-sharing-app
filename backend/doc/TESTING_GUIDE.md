# Testing Real-time Recipe Notifications with Socket.io

## Current Status

✅ **All servers are running:**
- Backend: `http://localhost:3001` (with Socket.io)
- Frontend: `http://localhost:5173`
- MongoDB: `localhost:27017`

## Quick Start Testing

### Step 1: Open Two Browser Tabs/Windows

1. Open Browser 1: `http://localhost:5173`
2. Open Browser 2: `http://localhost:5173`

### Step 2: Create Two User Accounts

**In Browser 1:**
1. Go to Signup page (`http://localhost:5173/signup`)
2. Create account for User A (example: username "alice", password "password123")
3. Login with User A credentials
4. You should see the "Recipe Sharing Community" page

**In Browser 2:**
1. Go to Signup page (`http://localhost:5173/signup`)
2. Create account for User B (example: username "bob", password "password456")
3. Login with User B credentials
4. You should see the "Recipe Sharing Community" page

### Step 3: Verify Socket.io Connection

**In Both Browsers:**
1. Open Developer Tools (F12 or Right-click → Inspect)
2. Go to Console tab
3. You should see the following messages:
   ```
   Connecting to Socket.io at: http://localhost:3001
   Socket connected: [socket-id]
   ```

If you don't see these, the connection failed. Check the browser console for errors.

### Step 4: Test Real-time Notification

**In Browser 1 (as User A):**
1. Scroll down to "Add New Recipe" section
2. Fill in the recipe details:
   - **Recipe Title**: "Chocolate Cake"
   - **Description**: "A delicious homemade chocolate cake"
   - **Ingredients**: (one per line)
     - 2 cups flour
     - 1 cup sugar
     - 3 eggs
   - **Image URL**: (optional, you can leave blank or paste a URL)
3. Click "Add Recipe" button
4. You should see success message: "Recipe created successfully!"

**In Browser 2 (as User B - keep watching!):**
1. A colorful **popup notification** should appear in the top-right corner
2. The notification displays:
   - 🎉 Icon
   - Title: "New Recipe Added!"
   - Recipe Title: "Chocolate Cake"
   - Author: "alice" (User A's username)
   - Two buttons: "View Recipe" and "Dismiss"

### Step 5: Interact with Notification

**Option A: View Recipe**
1. Click the "View Recipe" button in the notification
2. You will navigate to the recipe detail page showing:
   - Recipe image (if provided)
   - Recipe title: "Chocolate Cake"
   - Author: "by alice"
   - Description
   - Ingredients list
   - Tags (if any)

**Option B: Dismiss**
1. Click "Dismiss" button to close the notification
2. Or wait 8 seconds - the notification auto-dismisses

### Step 6: Verify Backend Logging

**In Backend Terminal:**
You should see console logs like:
```
Broadcasted new recipe: Chocolate Cake by alice
```

## Expected Behavior

✅ **What Should Happen:**
1. Recipe created in Browser 1
2. Notification appears instantly in Browser 2 (within 1-2 seconds)
3. Multiple browsers can receive notifications simultaneously
4. Each notification has correct recipe data (title and author)
5. Clicking "View Recipe" correctly navigates to recipe detail page

❌ **If Notifications Don't Appear:**

1. **Check Backend Terminal:**
   - Should show "Socket.io server is ready for connections"
   - Should show "Broadcasted new recipe:" log

2. **Check Browser 2 Console:**
   - Look for "Socket connected:" message
   - Look for "Received new recipe notification:" message
   - Look for any error messages

3. **Common Issues:**
   - **No connection:** Socket URL might be wrong. Check console shows `http://localhost:3001`
   - **No broadcast:** Backend didn't emit the event. Check backend logs
   - **Network tab:** Look at WebSocket connections. Search for "socket.io" in Network tab

## Testing with Multiple Recipes

Repeat Step 4 with different recipes to test multiple notifications:

**Browser 1 Recipe 2:**
- Title: "Spaghetti Carbonara"
- Description: "Italian pasta classic"

**Browser 2 Should Display:**
- New notification for "Spaghetti Carbonara"

**Browser 1 Recipe 3:**
- Title: "Chocolate Brownies"
- Description: "Fudgy and moist"

**Browser 2 Should Display:**
- New notification for "Chocolate Brownies"

## Debugging

### Enable More Logs

If you want more detailed Socket.io logging:

1. Open Browser 2 Console
2. Type: `localStorage.debug = '*'`
3. Refresh the page
4. Look for Socket.io debug messages

### Check Network

1. Open Developer Tools → Network tab
2. Filter by "WS" (WebSocket)
3. You should see Socket.io WebSocket connection
4. When a recipe is created, look for activity

### Verify Recipe in Database

If you want to verify recipes are actually saved:

1. Open terminal and run:
   ```bash
   mongosh mongodb://localhost:27017/recipe-sharing
   ```
2. Then query:
   ```javascript
   db.recipes.find().pretty()
   ```
3. You should see your created recipes

## Browser Compatibility

Socket.io works on:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Known Limitations

1. Notifications only appear while on the Blog page
2. If you navigate away from Blog page, you won't see the notification
3. If browser is closed, you won't receive notifications

## Architecture Flow

```
Browser 1 (Recipe Creator)
         ↓
    HTTP POST /api/v1/recipes
         ↓
    Backend Server
         ↓
    Save to MongoDB
         ↓
    Socket.io Broadcast: "new-recipe" event
         ↓
Browser 2 (All connected clients)
         ↓
    Receive "new-recipe" event
         ↓
    Display Popup Notification
```

## Success Indicators

✅ You know it's working when:
1. Socket connection message appears in console
2. Popup appears in top-right corner of Browser 2
3. Popup has correct recipe title and author name
4. "View Recipe" button navigates to recipe detail page
5. Backend console shows broadcast message

---

**Enjoy testing real-time notifications! 🎉**
