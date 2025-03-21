import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import axios from './utils/axios';

// Set up global axios defaults
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
