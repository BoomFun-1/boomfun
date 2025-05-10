import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

interface TokenFormData {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: string;
}

const TokenCreator: React.FC = () => {
  const [formData, setFormData] = useState<TokenFormData>({
    name: '',
    symbol: '',
    totalSupply: '',
    decimals: '18'
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Call contract to create token
      setAlert({
        open: true,
        message: 'Token created successfully!',
        severity: 'success'
      });
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to create token, please try again',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Token
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Token Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Token Symbol"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Total Supply"
            name="totalSupply"
            type="number"
            value={formData.totalSupply}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Decimals"
            name="decimals"
            type="number"
            value={formData.decimals}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Token'}
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TokenCreator;