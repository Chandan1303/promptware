import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  Avatar,
  Chip,
  Paper,
  Alert,
  Collapse,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyIcon from '@mui/icons-material/Key';
import InfoIcon from '@mui/icons-material/Info';

import { useCarbon } from '../context/CarbonContext';
import { useLanguage } from '../context/LanguageContext';
import { askGemini } from '../services/gemini';

export const AIAssistant = () => {
  const { answers, customApiKey, saveCustomApiKey } = useCarbon();
  const { t } = useLanguage();
  const [messages, setMessages] = useState(() => {
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: t("Hi! I am your AI Sustainability Coach. I have analyzed your carbon analyzer answers. Ask me why your footprint is high, what your largest contributors are, or how to reduce them next month!"),
        timestamp: new Date().toLocaleTimeString()
      }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyInput, setKeyInput] = useState(customApiKey || '');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [showConfigSaved, setShowConfigSaved] = useState(false);
  
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    if (textToSend.trim() === '' || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askGemini(textToSend, answers, customApiKey);
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "I encountered an error querying the model. Please check your network connection or API Key.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveKey = () => {
    saveCustomApiKey(keyInput.trim() !== '' ? keyInput : null);
    setShowConfigSaved(true);
    setTimeout(() => setShowConfigSaved(false), 3000);
  };

  const presetQuestions = [
    "Why is my carbon footprint high?",
    "What is my biggest contributor?",
    "How can I reduce next month?",
    "What should I improve first?"
  ];

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 900, mx: 'auto', display: 'flex', flexDirection: 'column', height: { xs: 'calc(100vh - 80px)', md: 'calc(100vh - 40px)' } }}>
      
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            EcoGuide AI Assistant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Conversational coach powered by Google Gemini generative models.
          </Typography>
        </Box>

        <Button
          size="small"
          variant="outlined"
          startIcon={<KeyIcon />}
          onClick={() => setShowKeyConfig(!showKeyConfig)}
          endIcon={showKeyConfig ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          aria-expanded={showKeyConfig}
          aria-controls="api-key-configuration-panel"
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          API Key Setup
        </Button>
      </Box>

      <Collapse in={showKeyConfig}>
        <Card id="api-key-configuration-panel" sx={{ mb: 3, borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              Configure Gemini API Credentials
            </Typography>
            <Typography variant="caption" color="text.secondary" paragraph>
              The app falls back to a custom simulation if no key is entered. For live API responses, enter a Google Gemini API Key. Keys are cached locally and never sent to a third-party server.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                type="password"
                label="Gemini API Key"
                placeholder="AIzaSy..."
                size="small"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                fullWidth
                slotProps={{
                  htmlInput: { 'aria-label': 'Enter your Gemini API key' }
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
              <Button
                variant="contained"
                onClick={handleSaveKey}
                sx={{
                  borderRadius: '10px',
                  px: 3,
                  backgroundColor: 'primary.main',
                  color: '#fff',
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
              >
                Save
              </Button>
            </Box>

            {showConfigSaved && (
              <Alert severity="success" sx={{ mt: 2, py: 0 }} role="status">
                API Key Configuration Updated.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Collapse>

      <Alert
        severity={customApiKey || import.meta.env.VITE_GEMINI_API_KEY ? "success" : "info"}
        icon={<InfoIcon />}
        sx={{ mb: 2, borderRadius: '10px' }}
      >
        {customApiKey || import.meta.env.VITE_GEMINI_API_KEY
          ? "Connected to live Google Gemini service."
          : "Running in local simulation mode. Enter an API key in the Setup panel to enable live responses."}
      </Alert>

      <Paper
        variant="outlined"
        sx={{
          flexGrow: 1,
          borderRadius: '16px',
          borderColor: 'divider',
          mb: 2,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: 'background.paper'
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            pr: 1,
            mb: 2
          }}
          aria-label="Conversation logs feed"
          tabIndex={0}
        >
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <ListItem
                  key={msg.id}
                  disablePadding
                  sx={{
                    display: 'flex',
                    justifyContent: isAssistant ? 'flex-start' : 'flex-end'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: isAssistant ? 'row' : 'row-reverse',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      maxWidth: { xs: '90%', sm: '75%' }
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: isAssistant ? 'primary.main' : 'secondary.main',
                        width: 36,
                        height: 36
                      }}
                      aria-hidden="true"
                    >
                      {isAssistant ? <SmartToyIcon /> : <PersonIcon />}
                    </Avatar>
                    
                    <Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: isAssistant ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                          backgroundColor: isAssistant
                            ? 'action.hover'
                            : 'rgba(0, 191, 165, 0.08)',
                          border: '1px solid',
                          borderColor: isAssistant ? 'divider' : 'rgba(0, 191, 165, 0.2)',
                          '& p': { m: 0, mb: 1, '&:last-child': { mb: 0 } },
                          '& h3': { mt: 0, mb: 1, fontSize: '1.1rem', fontWeight: 'bold' }
                        }}
                      >
                        <Box sx={{ whiteSpace: 'pre-line' }}>
                          {msg.text}
                        </Box>
                      </Paper>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, px: 1, textAlign: isAssistant ? 'left' : 'right' }}>
                        {msg.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              );
            })}

            {isLoading && (
              <ListItem disablePadding sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                    <SmartToyIcon />
                  </Avatar>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '4px 16px 16px 16px', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CircularProgress size={16} color="primary" />
                    <Typography variant="body2" color="text.secondary">EcoGuide is formulating insights...</Typography>
                  </Paper>
                </Box>
              </ListItem>
            )}
            <div ref={chatBottomRef} />
          </List>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {presetQuestions.map((q, i) => (
            <Chip
              key={i}
              label={q}
              onClick={() => handleSendMessage(q)}
              clickable
              disabled={isLoading}
              size="small"
              sx={{
                borderRadius: '8px',
                py: 1.5,
                '&:hover': { backgroundColor: 'primary.light', color: '#fff' }
              }}
            />
          ))}
        </Box>

        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          sx={{ display: 'flex', gap: 1.5 }}
        >
          <TextField
            fullWidth
            placeholder="Type a message or sustainability question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            size="medium"
            slotProps={{
              htmlInput: { 'aria-label': 'Chat Input message field' }
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={isLoading || inputValue.trim() === ''}
            aria-label="Send message to AI assistant"
            sx={{
              borderRadius: '12px',
              px: 3,
              backgroundColor: 'primary.main',
              color: '#fff',
              '&:hover': { backgroundColor: 'primary.dark' }
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
export default AIAssistant;
