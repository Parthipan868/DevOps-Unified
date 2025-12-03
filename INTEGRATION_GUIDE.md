# DevOps Unified Dashboard - Integration Guide

## 🔗 Connecting Real Services

### 1. **GitHub Integration**

#### Setup GitHub Personal Access Token:
1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Generate new token with scopes: `repo`, `read:user`, `workflow`
3. Copy the token

#### Update Backend:
Add to `server/.env`:
```env
GITHUB_TOKEN=your_github_token_here
GITHUB_USERNAME=your_github_username
```

Install GitHub API client:
```bash
cd server
npm install @octokit/rest
```

#### Implementation:
Update `server/controllers/githubController.js` to use real GitHub API instead of mock data.

---

### 2. **Jenkins Integration**

#### Prerequisites:
- Jenkins server running (local or remote)
- Jenkins API token

#### Get Jenkins Token:
1. Login to Jenkins
2. Click your username → Configure → API Token → Add new Token
3. Copy the token

#### Update Backend:
Add to `server/.env`:
```env
JENKINS_URL=http://your-jenkins-server:8080
JENKINS_USERNAME=your_username
JENKINS_TOKEN=your_jenkins_token
```

Install Jenkins client:
```bash
cd server
npm install jenkins
```

---

### 3. **Docker Integration**

#### Prerequisites:
- Docker Desktop installed and running
- Docker Engine API accessible

#### Update Backend:
Add to `server/.env`:
```env
DOCKER_HOST=unix:///var/run/docker.sock  # For Linux/Mac
# DOCKER_HOST=npipe:////./pipe/docker_engine  # For Windows
```

Install Docker client:
```bash
cd server
npm install dockerode
```

---

## 📝 Quick Start for Testing

### Option 1: Use Mock Data (Current Setup)
The app already works with mock data. Navigate to each tab to see it populate automatically.

### Option 2: Connect Real Services
Follow the steps above for GitHub, Jenkins, and Docker.

### Option 3: Hybrid Approach
Connect only the services you have available. The app will use mock data for others.

---

## 🚀 Next Steps

1. **Test with Mock Data First**: Navigate to GitHub, Jenkins, and Docker tabs to see mock data
2. **Set up one service at a time**: Start with GitHub (easiest)
3. **Verify connections**: Check server logs for successful API calls
4. **Replace mock data**: Update controllers to use real API clients

---

## 📊 Expected Real Data

- **GitHub**: Your actual repositories, commits, pull requests, stars
- **Jenkins**: Your actual pipelines, build history, job status
- **Docker**: Your running containers, images, resource usage

---

## 🔧 Troubleshooting

### Dark/Light Mode:
- Click the **moon icon** (top-right) to switch to dark mode
- Click the **sun icon** to switch to light mode
- The theme persists in browser storage

### Data Not Loading:
1. Check browser console for errors (F12)
2. Verify backend server is running on port 5000
3. Check MongoDB connection
4. Verify API tokens are valid

### CORS Issues:
If you get CORS errors when connecting to external services, update `server/index.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```
