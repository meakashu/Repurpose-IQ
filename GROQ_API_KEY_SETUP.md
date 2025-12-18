# 🔑 Groq API Key Setup Guide

## 📍 **Direct Links**

### **Main Console (Login/Register):**
👉 **https://console.groq.com/**

### **API Keys Page (Direct):**
👉 **https://console.groq.com/keys**

### **Documentation:**
👉 **https://console.groq.com/docs**

---

## 🚀 **Quick Steps to Generate API Key**

### Step 1: Access Groq Console
1. Go to: **https://console.groq.com/**
2. Click **"Sign Up"** (if new) or **"Sign In"** (if existing account)

### Step 2: Navigate to API Keys
1. After logging in, go to: **https://console.groq.com/keys**
   - Or click **"API Keys"** in the dashboard menu

### Step 3: Create New API Key
1. Click **"Create API Key"** button
2. Give it a name (optional, e.g., "RepurposeIQ")
3. Click **"Create"** or **"Submit"**
4. **⚠️ IMPORTANT:** Copy the key immediately - you won't see it again!

### Step 4: Update Your .env File
1. Open `.env` file in your project
2. Find the line: `GROQ_API_KEY=...`
3. Replace with: `GROQ_API_KEY=your_new_key_here`
4. Save the file

### Step 5: Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## ✅ **Verification**

After updating the key, test it:
```bash
node test-groq-key.js
```

**Expected output if working:**
```
✅ API KEY IS VALID!
   Response: Hello, Groq is working!
🎉 Groq AI is ready to use!
```

---

## 🔗 **All Important Links**

| Purpose | Link |
|---------|------|
| **Main Console** | https://console.groq.com/ |
| **API Keys** | https://console.groq.com/keys |
| **Documentation** | https://console.groq.com/docs |
| **Models** | https://console.groq.com/docs/models |

---

## 💡 **Tips**

- ✅ API keys start with `gsk_`
- ✅ Keys are typically 50-60 characters long
- ✅ Keep your key secret (never commit to git)
- ✅ You can create multiple keys for different projects
- ✅ Keys can be revoked/deleted from the console

---

## ⚠️ **Important Notes**

1. **Free Tier Available:** Groq offers free tier with generous limits
2. **No Credit Card Required:** For free tier (check current terms)
3. **Rate Limits:** Free tier has rate limits (check console for details)
4. **Key Security:** Never share your API key publicly

---

## 🆘 **Troubleshooting**

### If you get "Invalid API Key" error:
- ✅ Check key is copied correctly (no extra spaces)
- ✅ Verify key starts with `gsk_`
- ✅ Make sure `.env` file is in project root
- ✅ Restart server after updating `.env`

### If you can't access console:
- Check if account is verified
- Try different browser
- Clear browser cache
- Contact Groq support if issues persist

---

**Ready to get started?** 👉 **https://console.groq.com/keys**
