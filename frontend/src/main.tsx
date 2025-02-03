import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import '@fontsource/roboto/cyrillic.css';

import App from './App.tsx';
import { SnackbarProvider } from 'notistack';

createRoot(document.getElementById('root')!).render(
  <>
    <CssBaseline />
    <SnackbarProvider autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} maxSnack={1}>
      <App />
    </SnackbarProvider>
  </>
);
