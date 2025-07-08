# Fund Info App with AI Chatbot

A modern React application featuring fund analytics with an AI-powered chatbot for financial terminology definitions using Groq AI.

## Features

✅ **Modern Design**: Clean, blue-themed UI using Material-UI components  
✅ **Fund Information Sections**:
- Private Markets & Real Estate funds with detailed metrics
- Smart Fund Benchmarking with performance analytics
- Key insights and ESG information

✅ **AI Chatbot Features**:
- Groq-powered AI responses for fund terminology
- Built-in verification system for accurate definitions
- Specialized in financial and investment terms
- Real-time chat interface with suggested queries

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Your Free Groq API Key
1. Visit [console.groq.com](https://console.groq.com/)
2. Create a free account (no billing required initially)
3. Go to [API Keys](https://console.groq.com/keys)
4. Click "Create API Key" and give it a name
5. Copy your API key

### 3. Set Up Environment Variables
Create a `.env` file in the project root:
```bash
# In fund-info-app/.env
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

**Example:**
```bash
REACT_APP_GROQ_API_KEY=gsk_abc123def456...
```

### 4. Start the Application
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Using the AI Chatbot

### Chatbot Features
- **Verified Definitions**: Pre-verified terminology database for accuracy
- **Groq AI Integration**: Fast, intelligent responses using Llama models
- **Financial Focus**: Specialized in fund and investment terminology
- **Error Handling**: Graceful fallbacks with helpful error messages

### Supported Terms (Verified Database)
- **ESG** - Environmental, Social, and Governance
- **Alpha** - Investment performance vs benchmark
- **Sharpe Ratio** - Risk-adjusted return measure
- **AUM** - Assets Under Management
- **Private Equity** - Non-public company investments
- **Volatility** - Price movement measure
- **Drawdown** - Peak-to-trough decline
- **REIT** - Real Estate Investment Trust

### Example Queries
Try asking the chatbot:
- "What is ESG?"
- "Explain Alpha in investing"
- "What is Sharpe Ratio?"
- "Define private equity"
- "What is AUM?"
- "Explain volatility"

## Architecture

### Components Structure
```
src/
├── App.js                 # Main application component
├── components/
│   └── Chatbot.js        # AI chatbot component
└── ...
```

### Key Technologies
- **React 18** - Modern UI framework
- **Material-UI (MUI)** - Component library and design system
- **Groq SDK** - AI integration for fast inference
- **Llama 3** - AI model for natural language processing

### Chatbot Architecture
1. **Input Processing**: Extracts financial terms from user queries
2. **Verification**: Checks against curated terminology database
3. **AI Response**: Uses Groq API with specialized financial prompts
4. **Verification Display**: Shows verified definitions alongside AI responses

## Groq Integration Details

### Why Groq?
- **Fast Inference**: Significantly faster than traditional AI APIs
- **Free Tier**: Generous free usage without billing requirements
- **Open Models**: Access to Llama 3 and other open-source models
- **High Quality**: Reliable responses for financial terminology

### Models Used
- **llama3-8b-8192**: Primary model for chatbot responses
- **Temperature: 0.3**: Focused on accuracy over creativity
- **Max Tokens: 300**: Concise, relevant responses

### Error Handling
- **No API Key**: Shows setup instructions
- **API Errors**: Graceful fallback with verified definitions
- **Rate Limits**: Proper error messaging and retry logic

## Customization

### Adding New Terminology
Edit `src/components/Chatbot.js` and add to `FUND_TERMINOLOGY_DB`:

```javascript
'new_term': {
  term: 'New Term',
  definition: 'Detailed definition here...',
  category: 'Category Name',
  verified: true
}
```

### Styling Customization
Modify the MUI theme in `src/App.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#your-color-here',
    },
    // ... other customizations
  },
});
```

## Production Deployment

### Security Note
In production, implement a backend proxy for Groq API calls instead of using `dangerouslyAllowBrowser: true`.

### Environment Variables
Set up your production environment variables:
```bash
REACT_APP_GROQ_API_KEY=your_production_groq_key
```

### Build for Production
```bash
npm run build
```

## Troubleshooting

### Common Issues

**Chatbot not responding:**
1. Check your `.env` file exists and has the correct API key
2. Restart the development server after adding the API key
3. Check browser console for error messages

**API Key errors:**
1. Verify your Groq API key is valid
2. Check if you've exceeded rate limits
3. Ensure the key has proper permissions

**UI issues:**
1. Clear browser cache
2. Check if all MUI dependencies are installed
3. Verify React version compatibility

### Support
- Groq Documentation: [docs.groq.com](https://docs.groq.com)
- Material-UI Docs: [mui.com](https://mui.com)
- React Docs: [react.dev](https://react.dev)

## License

This project is open source and available under the MIT License.

---

**Built with ❤️ using React, Material-UI, and Groq AI**
