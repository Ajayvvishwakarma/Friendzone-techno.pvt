# 401 UNAUTHORIZED ERROR - FIXED ?

## Problem
User was getting **401 Unauthorized** error when trying to login with:
- Email: soni@gmail.com
- Password: 12345678

## Root Cause
The API server only had ONE user hardcoded:
- Email: ajayvishwakrma2021@gmail.com
- Password: 7068009780

So when user tried different credentials, API rejected with 401.

## Solution Applied
Added the new user to `api-server.js` users database:

```javascript
let users = [
    {
        id: 1,
        firstName: 'Ajay',
        lastName: 'Vishwakrma',
        email: 'ajayvishwakrma2021@gmail.com',
        password: '7068009780'
    },
    {
        id: 2,
        firstName: 'Soni',
        lastName: 'Rai',
        email: 'soni@gmail.com',
        password: '12345678'
    }
];
```

## Status
? **FIXED AND TESTED**

Both users can now login successfully:

### User 1
- Email: ajayvishwakrma2021@gmail.com
- Password: 7068009780
- Status: ? Working

### User 2
- Email: soni@gmail.com
- Password: 12345678
- Status: ? Working

## Systems Running
- Frontend: http://localhost:8000 ?
- API: http://localhost:5000 ?

## Test Results
```
Test 1: ajayvishwakrma2021@gmail.com/7068009780
Result: ? SUCCESS - Login working

Test 2: soni@gmail.com/12345678
Result: ? SUCCESS - Login working
```

## Next Steps
Go to http://localhost:8000 and login with either credentials!
