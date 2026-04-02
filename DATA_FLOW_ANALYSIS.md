# Frontend Data Flow Analysis

## Overview
This document explains where and how data flows through your frontend application.

---

## 1. **API Communication** (script.js)
### Data Source: Backend Server (http://localhost:5000)

#### Login Flow:
```
User Input (email, password)
    ↓
fetch('http://localhost:5000/api/auth/login', POST)
    ↓
Response Data received
    ↓
localStorage.setItem('user', JSON.stringify(data))
    ↓
DOM Elements Updated
```

**Endpoints:**
- `POST http://localhost:5000/api/auth/login` - Login
- `POST http://localhost:5000/api/auth/register` - Registration
- `POST http://localhost:5000/api/auth/forgot-password` - Password Reset

---

## 2. **localStorage** - Primary Data Storage
### Location: Browser's Local Storage

**Key:** `'user'`
**Data Structure:**
```javascript
{
    firstName: "User's First Name",
    lastName: "User's Last Name",
    email: "user@example.com",
    password: "encoded/hashed",
    // ... other fields from API response
}
```

**How it's used:**
- Stored after successful login
- Checked on page load to auto-login users
- Retrieved for displaying user info
- Removed on logout

---

## 3. **DOM Elements** - Display Layer
### Where Data is Rendered

#### Dashboard Page Updates:
```javascript
userNameEl = document.getElementById('userName')           // First name
displayNameEl = document.getElementById('displayName')     // Full name
displayEmailEl = document.getElementById('displayEmail')   // Email 
memberSinceEl = document.getElementById('memberSince')     // Join date
welcomeAvatar = document.getElementById('welcomeAvatar')   // Avatar letter
```

#### Location in HTML:
- Welcome banner section
- Profile Information card
- User avatar display

---

## 4. **Data Flow Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND DATA FLOW                        │
└─────────────────────────────────────────────────────────────┘

1. USER ACTIONS (Input)
   └─→ Login Form Submission
   └─→ Register Form Submission
   └─→ Logout Button Click

2. API CALLS (Network)
   └─→ fetch() to http://localhost:5000/api/auth/*
   └─→ Request: { email, password, firstName, lastName }
   └─→ Response: { firstName, lastName, email, ... }

3. BROWSER STORAGE (Persistence)
   └─→ localStorage.setItem('user', JSON.stringify(data))
   └─→ Retrieved on page load
   └─→ Cleared on logout

4. DOM UPDATES (Rendering)
   └─→ innerHTML/innerText/value updates
   └─→ Class additions/removals
   └─→ Display user information
   └─→ Show notifications

5. OUTPUT (User Sees)
   └─→ Dashboard with user info
   └─→ Notifications (success/error)
   └─→ Profile page with data populated
```

---

## 5. **Specific Data Destinations**

### After Login:
| Data | Destination | ID |
|------|-------------|-----|
| First Name | Welcome Banner | `#userName` |
| Full Name | Profile Card | `#displayName` |
| Email | Profile Card | `#displayEmail` |
| Join Date | Profile Card | `#memberSince` |
| Avatar Letter | Avatar Badge | `#welcomeAvatar` |
| All User Data | Browser Storage | `localStorage['user']` |

### Notifications:
```javascript
showNotification(message, type)  // Fixed position: top-right
// Types: 'success', 'error', 'warning', 'info'
// Displayed for 3.5 seconds
// Removed from DOM after animation
```

### User Avatar Display:
```javascript
displayUserAvatar()
// Updates all elements with [data-avatar] attribute
// Shows first letter of firstName in avatar circle
```

---

## 6. **Key JavaScript Functions Handling Data**

### Data Storage:
```javascript
localStorage.setItem('user', JSON.stringify(data))
```

### Data Retrieval:
```javascript
const user = JSON.parse(localStorage.getItem('user') || '{}')
```

### Data Display:
```javascript
// Updates multiple DOM elements
document.getElementById('userName').innerText = user.firstName
document.getElementById('displayName').innerText = user.firstName + ' ' + user.lastName
document.getElementById('displayEmail').innerText = user.email
```

### Data Clearing:
```javascript
localStorage.removeItem('user')
```

---

## 7. **Data Flow Timeline**

### Page Load:
1. Check if user exists in localStorage
2. If exists → Auto-login to dashboard
3. If not → Show login page

### After Login:
1. Send credentials to API
2. Receive user data (JSON)
3. Store in localStorage
4. Update 5+ DOM elements
5. Switch to dashboard page
6. Show success notification

### After Logout:
1. Remove user from localStorage
2. Clear login form
3. Return to login page
4. Show logout notification

---

## 8. **Current API Integration**

**Base URL:** `http://localhost:5000`

**Authentication Endpoints:**
- `/api/auth/login` - POST (email, password)
- `/api/auth/register` - POST (firstName, lastName, email, password)
- `/api/auth/forgot-password` - POST (email)

**Response Format:**
```json
{
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "password": "string",
    ... (other fields)
}
```

---

## 9. **Data Persistence Strategy**

| Layer | Technology | Lifetime | Purpose |
|-------|-----------|----------|---------|
| Session Memory | JavaScript Variables | Until page refresh | Temporary operations |
| Local Storage | Browser Storage | Indefinite | User session persistence |
| DOM | HTML Elements | While page loaded | Visual display |
| Network | API Response | Single request | Communication with backend |

---

## 10. **Important Notes**

✅ **Data stored in localStorage is:**
- Persistent across browser sessions
- Accessible only to this domain
- Visible in browser DevTools (not secure for sensitive data)
- String-based (JSON serialized)

⚠️ **Security Considerations:**
- Passwords stored in localStorage are visible
- Not recommended for production
- Consider using HTTP-only cookies with backend sessions
- Implement CSRF protection
- Use HTTPS in production

🔧 **Data Flow Debugging:**
- Check Browser DevTools → Application → Local Storage
- Monitor Network tab for API calls
- Use Console to inspect `localStorage.getItem('user')`
- Check DOM elements for rendered data

---

## Summary

**Frontend data flow:**
1. **Input** → User fills form
2. **API Call** → fetch() to backend
3. **Storage** → Data saved to localStorage
4. **Display** → DOM elements updated
5. **Output** → User sees personalized dashboard

All user data currently flows through localStorage and is displayed in the dashboard page.
