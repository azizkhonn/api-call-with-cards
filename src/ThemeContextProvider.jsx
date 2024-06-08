import ReactDOM from 'react-dom';
import App from './App';
import { ThemeContextProvider } from './ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeContextProvider>
    <App />
  </ThemeContextProvider>
);
