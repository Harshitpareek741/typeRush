
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import  './index.css';
import { AppProvider } from './context/appContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
</AppProvider>

);
