// src/components/ErrorDisplay.tsx
import { Alert, Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ my: 4, textAlign: 'center' }}>
      <Alert severity="error" sx={{ justifyContent: 'center', mb: 2 }}>
        <Typography>{message}</Typography>
      </Alert>
      <Box>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          Kembali
        </Button>
        <Button variant="contained" onClick={onRetry}>
          Coba Lagi
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorDisplay;
