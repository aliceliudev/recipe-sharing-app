# 🚀 QUICK START - Run These Commands

## Setup (First Time Only)

```bash
# Terminal 1 - Start Backend
cd /workspaces/recipe-sharing-app/backend
npm run dev

# You should see:
# ✅ Socket.io server is ready for connections
# ✅ express server running on http://localhost:3001
```

```bash
# Terminal 2 - Start Frontend  
cd /workspaces/recipe-sharing-app
npm run dev

# You should see:
# ✅ ➜  Local:   http://localhost:5173/
```

```bash
# Terminal 3 - Ensure MongoDB is running
docker ps | grep mongo

# If NOT running, start it:
docker run -d --name recipe-mongodb -p 27017:27017 mongo:6.0.4
```

---

## 🧪 Testing Steps

### Step 1: Open Two Browsers
- **Browser 1**: `http://localhost:5173`
- **Browser 2**: `http://localhost:5173`

### Step 2: Check Console in Both Browsers
**Press F12 to open DevTools → Console tab**

Look for messages:
```
🔌 Connecting to Socket.io at: http://localhost:3001
✅ Socket connected: [socket-id]
```

### Step 3: Create Two Accounts

**Browser 1:**
- Click "Sign up" (top right)
- Username: `alice`
- Password: `pass123`
- Click Sign up
- Enter username/password again
- Click Login

**Browser 2:**
- Click "Sign up"
- Username: `bob`
- Password: `pass456`
- Click Sign up
- Enter username/password again  
- Click Login

### Step 4: Look at Top of Page

**Both browsers should show a status banner:**
- Green: ✅ Connected
- Red: ⚠️ Disconnected

**If Red:** Something is wrong, check DEBUGGING_GUIDE.md

### Step 5: Create Recipe in Browser 1

- Scroll down to "Add New Recipe" section
- **Title**: Chocolate Cake
- **Description**: A delicious homemade chocolate cake
- **Ingredients** (one per line):
  ```
  2 cups flour
  1 cup sugar
  3 eggs
  ```
- Click "Add Recipe" button

### Step 6: Watch Browser 2

🎉 **A popup should appear in TOP-RIGHT corner!**

It should show:
```
🎉 New Recipe Added!
Chocolate Cake
by alice

[View Recipe] [Dismiss]
```

### Step 7: Click Actions

- **View Recipe**: Navigate to `/recipe/[id]` and see full details
- **Dismiss**: Close the popup
- **Wait 8 seconds**: Auto-dismisses

---

## ✨ Success Indicators

You know it's working when:

✅ Status banner is **GREEN**
✅ Console shows **✅ Socket connected**
✅ Popup appears in **TOP-RIGHT corner**
✅ Popup shows **correct recipe title**
✅ Popup shows **correct author name**
✅ **View Recipe** button works
✅ Backend console shows: **Broadcasted new recipe:**

---

## 🐛 If Popup Doesn't Appear

1. **Check status banner**
   - Is it GREEN or RED?
   - If RED, backend isn't connecting

2. **Check browser console**
   - Look for connection messages
   - Look for socket event messages
   - Look for any error messages

3. **Check backend terminal**
   - Look for: `Broadcasted new recipe: Chocolate Cake by alice`
   - If you don't see this, recipe wasn't created properly

4. **Try manual refresh**
   - Go to Backend terminal
   - Press Ctrl+C to stop
   - Run `npm run dev` again
   - Refresh frontend (Ctrl+R)

---

## 📊 Expected Terminal Outputs

### Backend Terminal (should show):
```
Successfully connected to mongodb://localhost:27017/recipe-sharing
Starting server with PORT=3001, HOST=0.0.0.0
express server running on http://localhost:3001
server is accessible on all interfaces at port 3001
Socket.io server is ready for connections

[When you create recipe in Browser 1]
Broadcasted new recipe: Chocolate Cake by alice
```

### Frontend Terminal (should show):
```
VITE v7.2.2  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## 🆘 Quick Troubleshooting

| Problem | Check |
|---------|-------|
| No connection | Is backend running on 3001? |
| Popup doesn't appear | Is status banner green? |
| Popup appears but no button works | Is frontend running on 5173? |
| Error in console | Check browser DevTools console |
| Recipe not saving | Is MongoDB running? Check Docker |

---

## 💡 Pro Tips

- Keep browser DevTools open to watch console logs
- Test with the same browser/tabs first
- Create recipes with clear, unique titles for testing
- Check backend logs when troubleshooting
- Screenshots help debug visual issues

---

**You're all set! Follow these steps and the notification will appear! 🎉**
