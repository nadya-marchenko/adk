# Fund Info App with AI Chatbot (TypeScript)

A modern React TypeScript application featuring fund analytics with an AI-powered chatbot for financial terminology definitions using Groq AI.

## ✨ Features

✅ **TypeScript Support**: Full TypeScript implementation with proper types and interfaces  
✅ **Modern Design**: Clean, blue-themed UI using Material-UI components  
✅ **Fund Information Sections**:
- Private Markets & Real Estate funds with detailed metrics
- Smart Fund Benchmarking with performance analytics
- Key insights and ESG information

✅ **AI Chatbot Features**:
- Groq-powered AI responses for fund terminology
- **Fixed**: Clickable suggestion chips that send messages immediately
- Built-in verification system for accurate definitions
- Specialized in financial and investment terms
- Real-time chat interface with suggested queries

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Your Free Groq API Key
1. Visit [console.groq.com](https://console.groq.com/)
2. Create a free account (no billing required initially)
3. Navigate to [console.groq.com/keys](https://console.groq.com/keys)
4. Click "Create API Key" and give it a name
5. Copy the generated API key

### 3. Set Up Environment Variables

Create a `.env` file in the project root:
```bash
# .env
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

⚠️ **Important**: Never commit your `.env` file to version control!

### 4. Start Development Server
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📦 GitHub Pages Deployment

### Method 1: Automatic Deployment (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Deploy TypeScript fund info app"
git push origin main
```

2. **Deploy to GitHub Pages**:
```bash
npm run deploy
```

This will:
- Build your TypeScript React app
- Deploy to `https://yourusername.github.io/fund-info-app`
- Handle all the build process automatically

### Method 2: Manual GitHub Actions Deployment

1. **Create GitHub Actions Workflow**:
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build app
      run: npm run build
      env:
        REACT_APP_GROQ_API_KEY: ${{ secrets.REACT_APP_GROQ_API_KEY }}
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
```

2. **Add API Key to GitHub Secrets**:
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and Variables → Actions
   - Click "New repository secret"
   - Name: `REACT_APP_GROQ_API_KEY`
   - Value: Your Groq API key

## 🔐 Environment Variables for Production

### For GitHub Pages Deployment:

Since GitHub Pages is a static hosting service, you have a few options for handling environment variables:

#### Option 1: Build-Time Environment Variables (Recommended)
Add your API key to GitHub Secrets and use it during the build process:

1. Go to your GitHub repository
2. Settings → Secrets and Variables → Actions
3. Add: `REACT_APP_GROQ_API_KEY` with your API key
4. The build process will inject this during deployment

#### Option 2: Runtime Configuration
For sensitive applications, consider using a backend proxy:

```javascript
// Instead of direct API calls, use a backend endpoint
const response = await fetch('/api/groq-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userInput })
});
```

## 🛠️ TypeScript Configuration

The project uses TypeScript with the following key features:

### Type Definitions
- `Fund` interface for fund data structure
- `Metric` interface for performance metrics
- `Message` interface for chat messages
- `TerminologyInfo` interface for verified definitions

### Key TypeScript Files
- `src/App.tsx` - Main application component
- `src/components/Chatbot.tsx` - AI chatbot component
- `src/index.tsx` - Application entry point
- `tsconfig.json` - TypeScript configuration

### Build Configuration
```json
{
  "compilerOptions": {
    "target": "es5",
    "strict": true,
    "jsx": "react-jsx",
    "noEmit": true
  }
}
```

## 🤖 AI Chatbot Features

### Available Fund Terminology
- **ESG**: Environmental, Social, and Governance
- **Alpha**: Performance vs benchmark
- **Sharpe Ratio**: Risk-adjusted returns
- **AUM**: Assets Under Management
- **Private Equity**: Non-public company investments
- **Volatility**: Price movement measure
- **Drawdown**: Peak-to-trough decline
- **REIT**: Real Estate Investment Trust

### Chatbot Capabilities
- ✅ **Instant Responses**: Groq AI provides fast, accurate definitions
- ✅ **Verification System**: Built-in database of verified financial terms
- ✅ **Clickable Suggestions**: Fixed - chips now send messages immediately
- ✅ **Context-Aware**: Understands fund and investment terminology
- ✅ **Error Handling**: Graceful fallbacks when API is unavailable

## 📱 Technologies Used

- **React 19** with TypeScript
- **Material-UI (MUI)** for design system
- **Groq AI SDK** for fast AI responses
- **GitHub Pages** for deployment
- **GitHub Actions** for CI/CD

## 🔧 Development Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Deploy to GitHub Pages
npm run deploy

# Build and deploy (combined)
npm run predeploy && npm run deploy
```

## 📚 Project Structure

```
fund-info-app/
├── src/
│   ├── components/
│   │   └── Chatbot.tsx          # AI chatbot component
│   ├── App.tsx                  # Main app component
│   ├── index.tsx                # Entry point
│   └── index.css                # Styles
├── public/
│   └── index.html               # HTML template
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript config
└── README.md                    # This file
```

## 🌐 Live Demo

After deployment, your app will be available at:
`https://yourusername.github.io/fund-info-app`

## 🚨 Troubleshooting

### Common Issues:

1. **API Key Not Working**:
   - Verify your Groq API key is correct
   - Check if `.env` file is in the project root
   - Ensure environment variable starts with `REACT_APP_`

2. **TypeScript Errors**:
   - Run `npm run build` to check for type errors
   - Ensure all imports have proper types
   - Check tsconfig.json configuration

3. **Deployment Issues**:
   - Verify GitHub repository name matches homepage URL
   - Check if GitHub Pages is enabled in repository settings
   - Ensure build runs successfully locally

4. **Chatbot Not Responding**:
   - Check browser console for API errors
   - Verify API key is set in environment variables
   - Try the verified definitions (they work without API)

## 🔗 Useful Links

- [Groq Console](https://console.groq.com/) - Get your API key
- [GitHub Pages Guide](https://pages.github.com/) - Deployment help
- [Material-UI Documentation](https://mui.com/) - UI components
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy coding! 🎉**
