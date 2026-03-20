# 🔥 GOOGLE SIGN-IN SETUP - FOLLOW THIS EXACTLY

## ⚡ OPTION 1: Use Auth0 with Google (REAL Authentication)

### Step 1: Create Auth0 Account
1. Go to https://auth0.com
2. Sign up for FREE account
3. Create a new tenant (e.g., "applyo-dev")

### Step 2: Create Application
1. In Auth0 Dashboard, go to **Applications** → **Applications**
2. Click **Create Application**
3. Name it "Applyo" 
4. Choose **Regular Web Applications**
5. Click **Create**

### Step 3: Configure Application Settings
In your application settings, set:

**Allowed Callback URLs:**
```
http://localhost:3000/api/auth/callback
```

**Allowed Logout URLs:**
```
http://localhost:3000
```

**Allowed Web Origins:**
```
http://localhost:3000
```

Click **Save Changes**

### Step 4: Enable Google Social Connection
1. In Auth0 Dashboard, go to **Authentication** → **Social**
2. Find **Google** and toggle it ON
3. You have 2 options:

   **Option A - Use Auth0's Dev Keys (Quick Test):**
   - Auth0 provides development keys
   - Just enable it and you're done!
   - ⚠️ Shows "Auth0 Development Keys" warning

   **Option B - Use Your Own Google OAuth (Production):**
   - Go to https://console.cloud.google.com
   - Create a new project
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Choose **Web application**
   - Add Authorized redirect URI: `https://YOUR_AUTH0_DOMAIN.auth0.com/login/callback`
   - Copy Client ID and Client Secret to Auth0

4. Click **Save**

### Step 5: Configure Environment Variables

Create `.env.local` file in your project root:

```bash
# Get these from Auth0 Dashboard → Applications → Applyo → Settings
AUTH0_SECRET='GENERATE_THIS_WITH_OPENSSL_COMMAND_BELOW'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_TENANT.us.auth0.com'
AUTH0_CLIENT_ID='your_client_id_from_auth0'
AUTH0_CLIENT_SECRET='your_client_secret_from_auth0'
AUTH0_DOMAIN='YOUR_TENANT.us.auth0.com'

# MongoDB (use local or Atlas)
MONGODB_URI='mongodb://localhost:27017/applyo'
```

**Generate AUTH0_SECRET:**
```bash
openssl rand -hex 32
```
Or use online: https://generate-secret.vercel.app/32

### Step 6: Start the App
```bash
npm run dev
```

Visit http://localhost:3000/auth/login and click **Sign in with Google**! 🎉

---

## 🔧 OPTION 2: Dev Mock (No Auth0 Setup Required)

Perfect for quick testing without setting up Auth0:

### Create `.env.local`:
```bash
# Dev Mode
DEV_MOCK_AUTH='true'
DEV_MOCK_EMAIL='dev@example.com'
DEV_MOCK_NAME='Dev User'

# MongoDB
MONGODB_URI='mongodb://localhost:27017/applyo'
```

### Start App:
```bash
npm run dev
```

Visit http://localhost:3000/auth/login and click **"Sign in as a mock user"**

---

## 🐛 TROUBLESHOOTING

### ❌ "Auth0 is not configured"
**Problem:** Missing environment variables
**Solution:** 
1. Check `.env.local` exists in project root
2. Verify all `AUTH0_*` variables are set
3. Restart dev server: `Ctrl+C` then `npm run dev`

### ❌ "Failed to start OAuth flow"
**Problem:** Auth0 not reached
**Solution:**
1. Check `AUTH0_ISSUER_BASE_URL` format: `https://tenant.us.auth0.com`
2. Verify internet connection
3. Check Auth0 tenant is active

### ❌ "Callback URL mismatch"
**Problem:** Redirect URI not configured in Auth0
**Solution:**
1. Go to Auth0 Application Settings
2. Add `http://localhost:3000/api/auth/callback` to Allowed Callback URLs
3. Save changes
4. Try again

### ❌ "Invalid state"
**Problem:** Session/cookie issue
**Solution:**
1. Clear browser cookies for localhost
2. Restart dev server
3. Try in incognito mode

### ❌ Google sign-in shows Auth0 login instead
**Problem:** Google connection not enabled
**Solution:**
1. Go to Auth0 → Authentication → Social
2. Enable Google
3. Make sure it's toggled ON (blue)

### ❌ "Access denied"
**Problem:** Google connection configuration
**Solution:**
1. In Auth0 Google settings, check "Enable" is ON
2. If using custom Google OAuth, verify redirect URI matches
3. Try with Auth0 dev keys first

---

## ✅ VERIFICATION CHECKLIST

Before testing, ensure:
- [ ] `.env.local` file exists in project root
- [ ] All required env vars are set (check with `cat .env.local`)
- [ ] MongoDB is running (`mongod` or Atlas connection works)
- [ ] Auth0 application created
- [ ] Google Social Connection enabled in Auth0
- [ ] Callback URLs configured in Auth0
- [ ] Dev server restarted after env changes

---

## 🎯 QUICK TEST

1. Start MongoDB: `mongod`
2. Start app: `npm run dev`
3. Open: http://localhost:3000/auth/login
4. Click: **Sign in with Google**
5. Should redirect to Google login
6. After sign-in, redirects back to dashboard

---

## 📝 EXAMPLE .env.local (REAL AUTH0)

```bash
# Auth0 Configuration
AUTH0_SECRET='a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://applyo-dev.us.auth0.com'
AUTH0_CLIENT_ID='AbCdEfGhIjKlMnOpQrStUvWx'
AUTH0_CLIENT_SECRET='1234567890abcdefghijklmnopqrstuvwxyz'
AUTH0_DOMAIN='applyo-dev.us.auth0.com'

# MongoDB
MONGODB_URI='mongodb://localhost:27017/applyo'

# Optional: OpenAI for AI features
OPENAI_API_KEY='sk-...'
```

---

## 🚀 NEXT STEPS AFTER SIGN-IN WORKS

1. ✅ Test full auth flow (login → dashboard → logout)
2. ✅ Check MongoDB user creation (`mongosh` → `use applyo` → `db.users.find()`)
3. ✅ Test protected routes
4. ✅ Configure production Auth0 tenant
5. ✅ Deploy to Vercel/Netlify

---

## 💡 TIPS

- **Development:** Use Auth0 dev keys for Google (fastest setup)
- **Production:** Use your own Google OAuth credentials
- **Testing:** Use Dev Mock mode for quick iterations
- **Debugging:** Check browser console and Network tab
- **MongoDB:** Atlas free tier works great for development

---

Need help? The Google sign-in flow should work now! 🎉
