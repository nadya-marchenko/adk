import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { Groq } from 'groq-sdk';

// Types for fund terminology
interface TerminologyInfo {
  term: string;
  definition: string;
  category: string;
  verified: boolean;
}

interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  verified?: TerminologyInfo;
  extractedTerms?: string[];
  error?: boolean;
}

// Fund terminology database for verification
const FUND_TERMINOLOGY_DB: Record<string, TerminologyInfo> = {
  'esg': {
    term: 'ESG',
    definition: 'Environmental, Social, and Governance. A framework used to evaluate a company\'s sustainability and ethical impact. Environmental factors include climate change and resource usage. Social factors cover labor practices and community relations. Governance involves board structure and executive compensation.',
    category: 'Sustainability',
    verified: true
  },
  'alpha': {
    term: 'Alpha',
    definition: 'A measure of investment performance that indicates how much a security or portfolio has earned compared to a benchmark index. Positive alpha indicates outperformance, while negative alpha indicates underperformance.',
    category: 'Performance',
    verified: true
  },
  'sharpe ratio': {
    term: 'Sharpe Ratio',
    definition: 'A risk-adjusted measure of return that calculates excess return per unit of risk. It\'s calculated as (Return - Risk-free rate) / Standard deviation. Higher Sharpe ratios indicate better risk-adjusted performance.',
    category: 'Risk Management',
    verified: true
  },
  'aum': {
    term: 'AUM (Assets Under Management)',
    definition: 'The total market value of assets that an investment company or financial institution manages on behalf of clients. It\'s a key metric for measuring the size and success of investment firms.',
    category: 'Metrics',
    verified: true
  },
  'private equity': {
    term: 'Private Equity',
    definition: 'Investment in companies that are not publicly traded. Private equity firms typically buy companies, improve operations, and sell them for a profit. Common strategies include buyouts, growth capital, and distressed investing.',
    category: 'Asset Classes',
    verified: true
  },
  'volatility': {
    term: 'Volatility',
    definition: 'A statistical measure of the dispersion of returns for a security or market index. Higher volatility indicates greater price swings and risk, while lower volatility suggests more stable returns.',
    category: 'Risk Management',
    verified: true
  },
  'drawdown': {
    term: 'Drawdown',
    definition: 'The peak-to-trough decline during a specific period for an investment or portfolio. Maximum drawdown represents the largest loss from a peak to a trough. It\'s a key measure of downside risk.',
    category: 'Risk Management',
    verified: true
  },
  'reit': {
    term: 'REIT (Real Estate Investment Trust)',
    definition: 'A company that owns, operates, or finances income-generating real estate. REITs provide investors a way to earn a share of income from real estate investments without having to buy properties directly.',
    category: 'Asset Classes',
    verified: true
  },
  'cat': {
    term: 'CAT',
    definition: 'Total Annual Cost Coca Cola or Consolidated Audit Trail.',
    category: 'CAT',
    verified: true
  }
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: 'Hello! I\'m your Fund Terminology Assistant. I can help you understand financial terms like ESG, Alpha, Sharpe Ratio, and more. Just ask me about any fund-related terminology!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [groqClient, setGroqClient] = useState<Groq | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Groq client
    const apiKey = process.env.REACT_APP_GROQ_API_KEY;
    if (apiKey) {
      const client = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
      });
      setGroqClient(client);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const verifyTerminology = (term: string): TerminologyInfo | null => {
    const normalizedTerm = term.toLowerCase();
    return FUND_TERMINOLOGY_DB[normalizedTerm] || null;
  };

  const extractTermsFromQuery = (query: string): string[] => {
    const terms: string[] = [];
    const queryLower = query.toLowerCase();
    
    Object.keys(FUND_TERMINOLOGY_DB).forEach(term => {
      if (queryLower.includes(term)) {
        terms.push(term);
      }
    });
    
    return terms;
  };

  const handleSendMessage = async (messageText: string): Promise<void> => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Check if we have a verified definition
      const extractedTerms = extractTermsFromQuery(messageText);
      let verifiedInfo: TerminologyInfo | null = null;
      
      if (extractedTerms.length > 0) {
        verifiedInfo = verifyTerminology(extractedTerms[0]);
      }

      if (groqClient) {
        // Create a system prompt that focuses on fund terminology
        const systemPrompt = `You are a financial terminology expert focused specifically on fund management, investment, and financial definitions. 
        
        IMPORTANT RULES:
        1. Only provide definitions and explanations for financial and fund-related terms
        2. Keep responses concise but comprehensive (2-3 sentences max)
        3. If asked about non-financial topics, politely redirect to fund terminology
        4. Always mention if a term is commonly used in specific contexts (e.g., "commonly used in private equity")
        5. Include practical examples when helpful
        
        Focus areas include: ESG, performance metrics (Alpha, Sharpe Ratio, etc.), asset classes (Private Equity, REITs, etc.), risk management terms, and fund operations.`;

        const response = await groqClient.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: messageText }
          ],
          model: 'llama3-8b-8192',
          temperature: 0.3,
          max_tokens: 300
        });

        const botResponse: Message = {
          type: 'bot',
          content: response.choices[0].message.content || 'Sorry, I couldn\'t generate a response.',
          timestamp: new Date(),
          verified: verifiedInfo || undefined,
          extractedTerms: extractedTerms
        };

        setMessages(prev => [...prev, botResponse]);
      } else {
        // Fallback response if Groq is not available
        const fallbackResponse: Message = {
          type: 'bot',
          content: 'I need a Groq API key to provide AI-powered responses. Please set up your REACT_APP_GROQ_API_KEY environment variable. However, I can still help with verified definitions!',
          timestamp: new Date(),
          verified: verifiedInfo || undefined,
          extractedTerms: extractedTerms
        };

        setMessages(prev => [...prev, fallbackResponse]);
      }

    } catch (error) {
      console.error('Error calling Groq API:', error);
      
      // Show error with any verified information we might have
      const extractedTerms = extractTermsFromQuery(messageText);
      const verifiedInfo = extractedTerms.length > 0 ? verifyTerminology(extractedTerms[0]) : null;
      
      const errorResponse: Message = {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please check your API key or try again later.',
        timestamp: new Date(),
        error: true,
        verified: verifiedInfo || undefined,
        extractedTerms: extractedTerms
      };

      setMessages(prev => [...prev, errorResponse]);
    }

    setLoading(false);
    setInput('');
  };

  const handleSend = async (): Promise<void> => {
    await handleSendMessage(input);
  };

  // Fixed: Send message immediately when chip is clicked
  const handleSuggestedQueryClick = async (query: string): Promise<void> => {
    await handleSendMessage(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (message: Message): React.JSX.Element => {
    return (
      <Paper 
        key={message.timestamp.getTime()}
        sx={{ 
          p: 2, 
          mb: 2, 
          maxWidth: '80%',
          backgroundColor: message.type === 'user' ? 'primary.main' : 'grey.100',
          color: message.type === 'user' ? 'white' : 'text.primary'
        }}
      >
        <Typography variant="body2">
          {message.content}
        </Typography>
        
        {/* Show verification info if available */}
        {message.verified && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <VerifiedIcon color="success" sx={{ mr: 1, fontSize: 16 }} />
              <Typography variant="caption" color="success.main" fontWeight="bold">
                Verified Definition
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {message.verified.term}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {message.verified.definition}
            </Typography>
            <Chip 
              label={message.verified.category} 
              size="small" 
              color="primary" 
              sx={{ mt: 1 }} 
            />
          </Box>
        )}

        {/* Show extracted terms */}
        {message.extractedTerms && message.extractedTerms.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Related terms: {message.extractedTerms.join(', ')}
            </Typography>
          </Box>
        )}

        {/* Show error indicator */}
        {message.error && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <WarningIcon color="error" sx={{ mr: 1, fontSize: 16 }} />
            <Typography variant="caption" color="error">
              Error occurred
            </Typography>
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {message.timestamp.toLocaleTimeString()}
        </Typography>
      </Paper>
    );
  };

  const suggestedQueries: string[] = [
    "What is ESG?",
    "Explain Alpha in investing",
    "What is Sharpe Ratio?",
    "Define private equity",
    "What is AUM?",
    "Explain volatility"
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Setup Notice */}
      {!groqClient && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            To enable AI responses, set up your Groq API key:
            <br />
            1. Get your free API key from <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer">console.groq.com/keys</a>
            <br />
            2. Create a .env file in the project root: REACT_APP_GROQ_API_KEY=your_key_here
            <br />
            3. Restart the development server
          </Typography>
        </Alert>
      )}

      {/* Suggested Queries */}
      <Box sx={{ mb: 2, px: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Try asking about:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {suggestedQueries.map((query, index) => (
            <Chip
              key={index}
              label={query}
              onClick={() => handleSuggestedQueryClick(query)}
              variant="outlined"
              size="small"
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* Messages Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column',
          p: 1,
          px: 3
        }}
      >
        {messages.map((message, index) => (
          <Box key={index} sx={{ display: 'flex', width: '100%', justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start' }}>
            {formatMessage(message)}
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about fund terminology (e.g., 'What is ESG?')"
            disabled={loading}
            variant="outlined"
            size="small"
          />
          <Tooltip title="Send message">
            <IconButton 
              onClick={handleSend} 
              disabled={!input.trim() || loading}
              color="primary"
            >
              <SendIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          <InfoIcon sx={{ fontSize: 12, mr: 0.5 }} />
          This bot specializes in fund and investment terminology. Verified definitions are marked with a ✓.
        </Typography>
      </Box>
    </Box>
  );
};

export default Chatbot; 