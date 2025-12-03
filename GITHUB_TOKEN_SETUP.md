# GitHub Token Setup Instructions

## Step 1: Generate New Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "DevOps-Dashboard-2024"
4. Select these scopes:
   ✅ repo (all checkboxes under repo)
   ✅ read:user
   ✅ workflow
5. Set expiration: 90 days (or custom)
6. Click "Generate token"
7. **COPY THE TOKEN IMMEDIATELY** - you won't see it again!

## Step 2: Update .env File
Open `server/.env` and replace the GITHUB_TOKEN line:

```
GITHUB_TOKEN=paste_your_new_token_here
```

## Step 3: Restart Server
```powershell
# Stop current server (Ctrl+C)
npm start
```

## Step 4: Verify
You should see in server logs:
```
GitHub Token Status: Loaded (ghp_XXXXXX...)
Fetching repositories from GitHub...
Fetched 28 repositories from GitHub
```

---

## Troubleshooting

If still getting 401 errors:
- Make sure there are NO SPACES before or after the token
- Token should start with `ghp_`
- Regenerate the token and try again
