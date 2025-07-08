# GitHub Pages Deployment Guide

This guide will help you deploy your TypeScript Fund Info App to GitHub Pages with your Groq API key.

## 🚀 Method 1: GitHub Actions Deployment (Recommended)

This method handles API keys securely and builds the project automatically.

### Step 1: Create GitHub Actions Workflow

1. **Create directory structure**:
```bash
mkdir -p .github/workflows
```

2. **Create `.github/workflows/deploy.yml`**:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build app
      run: npm run build
      env:
        REACT_APP_GROQ_API_KEY: ${{ secrets.REACT_APP_GROQ_API_KEY }}
    
    - name: Setup Pages
      uses: actions/configure-pages@v4
    
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './build'
  
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

### Step 2: Add API Key to GitHub Secrets

1. **Go to your GitHub repository**
2. **Navigate to**: Settings → Secrets and Variables → Actions
3. **Click**: "New repository secret"
4. **Add**:
   - Name: `REACT_APP_GROQ_API_KEY`
   - Value: Your Groq API key (e.g., `gsk_abc123def456...`)

### Step 3: Enable GitHub Pages

1. **Go to**: Settings → Pages
2. **Source**: Deploy from a branch
3. **Branch**: `gh-pages` (will be created automatically)
4. **Folder**: `/ (root)`

### Step 4: Deploy

1. **Commit and push your changes**:
```bash
git add .
git commit -m "Add GitHub Actions deployment"
git push origin main
```

2. **GitHub Actions will automatically**:
   - Build your TypeScript React app
   - Inject the API key during build
   - Deploy to GitHub Pages

3. **Your app will be available at**:
   `https://yourusername.github.io/your-repo-name`

---

## 🔧 Method 2: Manual Deployment (If npm issues persist)

If you're experiencing npm permission issues, you can deploy manually.

### Step 1: Build Locally with API Key

1. **Create `.env` file** (if not exists):
```bash
echo "REACT_APP_GROQ_API_KEY=your_groq_api_key_here" > .env
```

2. **Try building with yarn** (alternative to npm):
```bash
# Install yarn if you don't have it
npm install -g yarn

# Install dependencies
yarn install

# Build the project
yarn build
```

### Step 2: Deploy Build Folder

1. **Install gh-pages globally**:
```bash
npm install -g gh-pages
```

2. **Deploy the build folder**:
```bash
gh-pages -d build
```

### Step 3: Alternative Manual Deployment

If gh-pages doesn't work, you can manually create the gh-pages branch:

1. **Build your project** (using method above)
2. **Create and switch to gh-pages branch**:
```bash
git checkout --orphan gh-pages
git rm -rf .
```

3. **Copy build contents**:
```bash
cp -r build/* .
cp build/.* . 2>/dev/null || true
```

4. **Commit and push**:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

5. **Switch back to main**:
```bash
git checkout main
```

---

## 🔐 Environment Variables for Production

### Option 1: Build-Time Injection (Recommended)

Use GitHub Secrets to inject the API key during build:

```yaml
# In your GitHub Actions workflow
- name: Build app
  run: npm run build
  env:
    REACT_APP_GROQ_API_KEY: ${{ secrets.REACT_APP_GROQ_API_KEY }}
```

### Option 2: Runtime Configuration

For more security, prompt users to enter their API key:

```typescript
// In your Chatbot component
const [apiKey, setApiKey] = useState<string>('');

useEffect(() => {
  const storedKey = localStorage.getItem('groq-api-key');
  if (storedKey) {
    setApiKey(storedKey);
  } else {
    const key = prompt('Enter your Groq API key:');
    if (key) {
      localStorage.setItem('groq-api-key', key);
      setApiKey(key);
    }
  }
}, []);
```

### Option 3: Environment-Specific Configuration

Create different configurations for different environments:

```javascript
// config.js
const config = {
  development: {
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    apiEndpoint: 'https://api.groq.com'
  },
  production: {
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    apiEndpoint: 'https://api.groq.com'
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

---

## 🛠️ Troubleshooting

### Common Issues:

1. **npm permission errors**:
   - Try using `yarn` instead of `npm`
   - Use the GitHub Actions method
   - Clear npm cache: `npm cache clean --force`

2. **Build fails**:
   - Check TypeScript errors: `npx tsc --noEmit`
   - Ensure all dependencies are installed
   - Verify API key is set correctly

3. **GitHub Pages not updating**:
   - Check Actions tab for build status
   - Verify GitHub Pages is enabled
   - Clear browser cache

4. **API key not working**:
   - Verify API key format in GitHub Secrets
   - Check if API key has proper permissions
   - Ensure variable name is exactly `REACT_APP_GROQ_API_KEY`

### Testing Your Deployment:

1. **Test build locally**:
```bash
npm run build
npx serve -s build
```

2. **Check for TypeScript errors**:
```bash
npx tsc --noEmit
```

3. **Verify API key is injected**:
```bash
# After build, check if API key is in the bundle
grep -r "REACT_APP_GROQ_API_KEY" build/ || echo "API key not found"
```

---

## 🌐 Custom Domain (Optional)

If you want to use a custom domain:

1. **Add CNAME file to public folder**:
```bash
echo "yourdomain.com" > public/CNAME
```

2. **Configure DNS**:
   - Add CNAME record pointing to `yourusername.github.io`
   - Or A records pointing to GitHub Pages IPs

3. **Update package.json homepage**:
```json
{
  "homepage": "https://yourdomain.com"
}
```

---

## 📝 Summary 

**Recommended approach**: Use GitHub Actions (Method 1) for automatic deployment with secure API key handling.

**Fallback**: Use manual deployment (Method 2) if experiencing npm issues.

**Result**: Your TypeScript Fund Info App will be available at `https://yourusername.github.io/your-repo-name` with full AI chatbot functionality.

---

**Need help?** Check the main README.md for troubleshooting or open an issue on GitHub. 