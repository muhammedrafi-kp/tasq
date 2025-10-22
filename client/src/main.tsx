import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { AuthProvider } from "./context/AuthProvider.tsx"
import store from './redux/store.ts';
import './index.css'
import App from './App.tsx';
import  {Toaster} from "react-hot-toast";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster />
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
