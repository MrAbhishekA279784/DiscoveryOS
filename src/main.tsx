import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {DemoUserProvider} from './auth/DemoUserContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoUserProvider>
      <App />
    </DemoUserProvider>
  </StrictMode>,
);
