import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  Assessment,
  Chat as ChatIcon,
  Close as CloseIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import Chatbot from './components/Chatbot';

// Types for fund data
interface Fund {
  name: string;
  aum: string;
  return: string;
  riskLevel: 'Low' | 'Medium' | 'Medium-High' | 'High';
  description: string;
  sectors: string[];
  geography: string;
}

interface Metric {
  metric: string;
  value: string;
  benchmark: string;
  performance: 'outperforming' | 'underperforming';
}

interface FundData {
  privateMarkets: {
    title: string;
    funds: Fund[];
  };
  benchmarking: {
    title: string;
    analytics: Metric[];
    insights: string[];
  };
}

// Create a blue-themed Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
      light: '#42a5f5',
    },
    secondary: {
      main: '#0d47a1',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    h3: {
      fontWeight: 600,
      color: '#1976d2',
    },
    h4: {
      fontWeight: 500,
      color: '#115293',
    },
    h5: {
      fontWeight: 500,
      color: '#1976d2',
    },
  },
});

// Sample fund data
const fundData: FundData = {
  privateMarkets: {
    title: "Private Markets & Real Estate",
    funds: [
      {
        name: "Alpha Real Estate Fund",
        aum: "$2.4B",
        return: "12.5%",
        riskLevel: "Medium-High",
        description: "Diversified real estate portfolio focusing on commercial properties in major metropolitan areas.",
        sectors: ["Commercial", "Residential", "Industrial"],
        geography: "North America, Europe"
      },
      {
        name: "Beta Infrastructure Fund",
        aum: "$1.8B",
        return: "9.2%",
        riskLevel: "Medium",
        description: "Infrastructure investments in renewable energy, transportation, and utilities.",
        sectors: ["Energy", "Transportation", "Utilities"],
        geography: "Global"
      },
      {
        name: "Gamma Private Equity",
        aum: "$3.1B",
        return: "15.8%",
        riskLevel: "High",
        description: "Growth-stage private equity investments in technology and healthcare companies.",
        sectors: ["Technology", "Healthcare", "Consumer"],
        geography: "North America, Asia"
      }
    ]
  },
  benchmarking: {
    title: "Smart Fund Benchmarking",
    analytics: [
      {
        metric: "Sharpe Ratio",
        value: "1.42",
        benchmark: "1.18",
        performance: "outperforming"
      },
      {
        metric: "Alpha Generation",
        value: "3.2%",
        benchmark: "0.8%",
        performance: "outperforming"
      },
      {
        metric: "Volatility",
        value: "8.5%",
        benchmark: "12.1%",
        performance: "outperforming"
      },
      {
        metric: "Maximum Drawdown",
        value: "-4.2%",
        benchmark: "-8.7%",
        performance: "outperforming"
      }
    ],
    insights: [
      "ESG-compliant portfolios showing 23% better risk-adjusted returns",
      "Alternative investment allocation improved portfolio diversification by 31%",
      "Smart beta strategies contributed to 2.1% excess alpha generation",
      "Systematic rebalancing reduced portfolio volatility by 15%"
    ]
  }
};

function App(): React.JSX.Element {
  const [chatOpen, setChatOpen] = useState<boolean>(false);

  const handleChatToggle = (): void => {
    setChatOpen(!chatOpen);
  };

  const getRiskChipColor = (risk: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (risk) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'Medium-High': return 'warning';
      case 'High': return 'error';
      default: return 'default';
    }
  };

  const getPerformanceChipColor = (performance: string): 'success' | 'error' => {
    return performance === 'outperforming' ? 'success' : 'error';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Avatar sx={{ mr: 2, bgcolor: 'white', color: 'primary.main' }}>
            <AccountBalance />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            FundScope Analytics
          </Typography>
          <Button color="inherit" startIcon={<InfoIcon />}>
            About
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Advanced Fund Analytics Platform
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Comprehensive insights into private markets, real estate, and smart benchmarking
          </Typography>
        </Box>

        {/* Private Markets & Real Estate Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <TrendingUp sx={{ mr: 2 }} />
            {fundData.privateMarkets.title}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {fundData.privateMarkets.funds.map((fund: Fund, index: number) => (
              <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {fund.name}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip label={`AUM: ${fund.aum}`} color="primary" sx={{ mr: 1, mb: 1 }} />
                      <Chip label={`Return: ${fund.return}`} color="success" sx={{ mr: 1, mb: 1 }} />
                      <Chip 
                        label={`Risk: ${fund.riskLevel}`} 
                        color={getRiskChipColor(fund.riskLevel)} 
                        sx={{ mb: 1 }} 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {fund.description}
                    </Typography>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Sectors:
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {fund.sectors.map((sector: string, idx: number) => (
                        <Chip key={idx} label={sector} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))}
                    </Box>
                    <Typography variant="subtitle2" color="primary">
                      Geography: {fund.geography}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Smart Fund Benchmarking Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Assessment sx={{ mr: 2 }} />
            {fundData.benchmarking.title}
          </Typography>
          
          <Grid container spacing={3}>
            {/* Performance Metrics */}
            <Grid item xs={12} md={6} {...({} as any)}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom color="primary">
                    Performance Metrics vs Benchmark
                  </Typography>
                  <Grid container spacing={2}>
                    {fundData.benchmarking.analytics.map((metric: Metric, index: number) => (
                      <Grid item xs={12} sm={6} key={index} {...({} as any)}>
                        <Box sx={{ p: 2, border: 1, borderColor: 'grey.200', borderRadius: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {metric.metric}
                          </Typography>
                          <Typography variant="h6" color="primary">
                            {metric.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Benchmark: {metric.benchmark}
                          </Typography>
                          <Chip 
                            label={metric.performance} 
                            color={getPerformanceChipColor(metric.performance)}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Key Insights */}
            <Grid item xs={12} md={6} {...({} as any)}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom color="primary">
                    Key Insights & Analytics
                  </Typography>
                  {fundData.benchmarking.insights.map((insight: string, index: number) => (
                    <Box key={index} sx={{ 
                      p: 2, 
                      mb: 2, 
                      backgroundColor: 'primary.light', 
                      borderRadius: 1,
                      color: 'white'
                    }}>
                      <Typography variant="body2">
                        {insight}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* ESG Information Box */}
        <Card sx={{ mb: 4, backgroundColor: 'primary.dark', color: 'white' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              About ESG and Fund Terminology
            </Typography>
            <Typography variant="body1">
              Our AI chatbot can help you understand fund-related terminology like ESG (Environmental, Social, and Governance), 
              Alpha, Sharpe Ratio, and more. Click the chat icon to get instant definitions and explanations.
            </Typography>
          </CardContent>
        </Card>
      </Container>

      {/* Floating Chat Button */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={handleChatToggle}
      >
        <ChatIcon />
      </Fab>

      {/* Chat Dialog */}
      <Dialog
        open={chatOpen}
        onClose={handleChatToggle}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: '80vh' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Fund Terminology Assistant
          <IconButton onClick={handleChatToggle}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '100%' }}>
          <Chatbot />
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}

export default App; 