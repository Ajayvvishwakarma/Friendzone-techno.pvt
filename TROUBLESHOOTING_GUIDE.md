# ?? TROUBLESHOOTING GUIDE

## Step 1: Verify All Files Exist

Run this command in PowerShell:

```powershell
cd "C:\Users\DELL\Desktop\Ajaydev\"
ls index.html, style.css, script.js, server-new.js, avatar-placeholder.svg
```

**Expected Output:** All 5 files should be listed ?

---

## Step 2: Start the Servers

### Terminal 1 - Start Backend API
```powershell
cd "C:\Users\DELL\Desktop\Ajaydev\"
node api-server.js
```

**Expected Output:**
```
? API Server Running
API server listening on port 5000
```

### Terminal 2 - Start Frontend Server
```powershell
cd "C:\Users\DELL\Desktop\Ajaydev\"
node server-new.js
```

**Expected Output:**
```
???????????????????????????????????????????????????
? FRONTEND SERVER STARTED!
???????????????????????????????????????????????????
?? URL: http://localhost:8000

Files being served:
  ? index.html
  ? style.css
  ? script.js

Press Ctrl+C to stop
```

---

## Step 3: Open Browser

Go to: **http://localhost:8000**

You should see:
- Purple gradient background
- White login card in the center
- Email input field
- Password input field
- Sign In button
- Sign Up link
- Forgot Password link

---

## Step 4: Check Browser Console

Press: **F12** (or Right-click ? Inspect)

Go to: **Console** tab

Look for errors. Common ones and solutions:

### ? Error: "Failed to fetch http://localhost:5000/..."
**Problem:** Backend server not running
**Solution:** Start api-server.js in Terminal 1

### ? Error: "GET https://via.placeholder.com net::ERR_NAME_NOT_RESOLVED"
**Problem:** Old code still being used
**Solution:** 
1. Hard refresh: **Ctrl+Shift+Delete** (clear cache)
2. Then **Ctrl+F5** (hard refresh)

### ? Error: "Cannot find element by ID..."
**Problem:** HTML elements missing
**Solution:** Check if index.html was created properly

### ? No Errors
**Great!** Everything is working

---

## Step 5: Test Login

### Use Test Account:
```
Email: ajayvishwakrma2021@gmail.com
Password: 7068009780
```

### Expected Result:
1. Email field accepts email
2. Password field shows dots
3. Click "Sign In"
4. Page shows "Welcome, Ajay! ??"
5. Dashboard loads with 6 cards

---

## Step 6: Test Registration

1. Click "Sign Up"
2. Fill in form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: Test@123
   - Confirm: Test@123
   - Check: I agree
3. Click "Create Account"
4. Should see success notification
5. Should redirect to login

---

## Step 7: Test Dashboard Features

### Profile Information Card
- Click "Edit Profile" button
- Modal should open
- Fill in fields
- Click "Save Changes"
- Green notification should appear

### Photo Upload Card
- Click "Upload Photo" button
- See purple avatar placeholder
- Click "Browse Files"
- Select image from computer
- Click "Upload"
- Green notification should appear

### Password Card
- Click "Change Password"
- Fill current password
- Fill new password (watch strength bar)
- Confirm new password
- Click "Change Password"
- Green notification should appear

### Navbar
- Click "Logout"
- Should redirect to login page
- Green notification should say logged out

---

## Common Issues & Solutions

### ?? Issue: Port 8000 Already in Use
```powershell
# Find process using port 8000
Get-Process node

# Kill the process
Stop-Process -Name node -Force

# Then start server-new.js again
node server-new.js
```

### ?? Issue: Port 5000 Already in Use
```powershell
# Same as above, but api-server.js might not start
# Just kill node processes and restart both
```

### ?? Issue: "Cannot find module"
**Problem:** Node modules missing
**Solution:** Make sure you have Node.js installed
```powershell
node --version  # Should show v12+ or higher
```

### ?? Issue: Page Not Displaying
**Solutions:**
1. Check firewall isn't blocking port 8000
2. Try different browser (Chrome, Edge, Firefox)
3. Try http://127.0.0.1:8000 instead of localhost

### ?? Issue: Styles Not Showing
**Solutions:**
1. Hard refresh: **Ctrl+F5**
2. Clear browser cache: **Ctrl+Shift+Delete**
3. Check Network tab in F12 for failed requests
4. Make sure style.css file exists

### ?? Issue: Forms Not Working
**Solutions:**
1. Check Console for JavaScript errors (F12 ? Console)
2. Make sure script.js file exists
3. Verify API server is running (should see messages in Terminal 1)

---

## Verification Checklist

- [ ] All 5 files exist in C:\Users\DELL\Desktop\Ajaydev\
- [ ] api-server.js is running (Terminal 1)
- [ ] server-new.js is running (Terminal 2)
- [ ] Browser can access http://localhost:8000
- [ ] Login page displays with purple theme
- [ ] No errors in browser console (F12)
- [ ] Can login with test credentials
- [ ] Can see dashboard after login
- [ ] Can click modal buttons and see forms
- [ ] Can logout and return to login

---

## Need Help?

Provide me with:
1. **What you tried:** (e.g., "I clicked Sign In")
2. **What happened:** (e.g., "Page went blank")
3. **What you expected:** (e.g., "Dashboard should load")
4. **Any error messages:** (from F12 console)
5. **Current state:** (e.g., "Server running? Yes/No")

Then I can help you fix it! ??

---

## Quick Reference

| Component | Port | URL | Status |
|-----------|------|-----|--------|
| Frontend Server | 8000 | http://localhost:8000 | Running in Terminal 2 |
| Backend API | 5000 | http://localhost:5000 | Running in Terminal 1 |
| Index Page | - | / (root) | index.html |
| API Login | - | POST /api/auth/login | ajayvishwakrma2021@gmail.com |
| API Register | - | POST /api/auth/register | new account creation |

---

**Status:** Ready to Help! ??
