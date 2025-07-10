import React, { useState } from 'react';
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
  Avatar
} from '@mui/material';
import {
  AccountBalance,
  Chat as ChatIcon,
  Close as CloseIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import Chatbot from './components/Chatbot';
import MainPage from './components/MainPage';

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

function App(): React.JSX.Element {
  const [chatOpen, setChatOpen] = useState<boolean>(false);

  const handleChatToggle = (): void => {
    setChatOpen(!chatOpen);
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
        {/* Main Page Content */}
        <MainPage />
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