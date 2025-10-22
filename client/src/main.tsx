import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './redux/store.ts';
import './index.css'
import App from './App.tsx';
import  {Toaster} from "react-hot-toast";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
        <Toaster />
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
)
