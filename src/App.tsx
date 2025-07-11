import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
  Box
} from '@mui/material';
import {
  AccountBalance,
  Chat as ChatIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Dashboard,
  List as ListIcon
} from '@mui/icons-material';
import Chatbot from './components/Chatbot';
import MainPage from './components/MainPage';
import FundsListPage from './pages/FundsListPage';

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

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        component={Link}
        to="/"
        color="inherit"
        startIcon={<Dashboard />}
        variant={isActive('/') ? 'outlined' : 'text'}
        sx={{
          backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          borderColor: isActive('/') ? 'rgba(255, 255, 255, 0.5)' : 'transparent'
        }}
      >
        Dashboard
      </Button>
      <Button
        component={Link}
        to="/funds"
        color="inherit"
        startIcon={<ListIcon />}
        variant={isActive('/funds') ? 'outlined' : 'text'}
        sx={{
          backgroundColor: isActive('/funds') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          borderColor: isActive('/funds') ? 'rgba(255, 255, 255, 0.5)' : 'transparent'
        }}
      >
        Funds Explorer
      </Button>
    </Box>
  );
};

const AppContent: React.FC = () => {
  const [chatOpen, setChatOpen] = useState<boolean>(false);

  const handleChatToggle = (): void => {
    setChatOpen(!chatOpen);
  };

  return (
    <>
      {/* Header */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Avatar sx={{ mr: 2, bgcolor: 'white', color: 'primary.main' }}>
            <AccountBalance />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            FundScope Analytics
          </Typography>
          
          {/* Navigation */}
          <Navigation />
          
          <Button color="inherit" startIcon={<InfoIcon />} sx={{ ml: 2 }}>
            About
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/funds" element={<FundsListPage />} />
        </Routes>
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
    </>
  );
};

function App(): React.JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename={process.env.NODE_ENV === 'production' ? '/adk' : ''}>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App; 