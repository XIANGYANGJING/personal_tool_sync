import { createRoot } from 'react-dom/client';
import App from './App';
import { FirebaseProvider } from './firebase/FirebaseProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <FirebaseProvider>
    <App />
  </FirebaseProvider>
);