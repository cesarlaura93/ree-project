import React from 'react';
import { Alert, AlertTitle, Collapse } from '@mui/material';

interface ErrorAlertProps {
  error: any;
  onClose?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onClose }) => {
  if (!error) return null;
  
  return (
    <Collapse in={!!error}>
      <Alert severity="error" onClose={onClose}>
        <AlertTitle>Error</AlertTitle>
        {error.message || 'Ha ocurrido un error en la aplicación'}
      </Alert>
    </Collapse>
  );
};

export default ErrorAlert;