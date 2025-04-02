
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get the root element
const rootElement = document.getElementById("root");

// Ensure the root element exists
if (!rootElement) {
  throw new Error("Root element not found. Make sure there is a <div id='root'> in your HTML.");
}

// Create a root and render the app
createRoot(rootElement).render(<App />);
