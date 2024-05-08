import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import TodoState from './context/todoState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TodoState>
        <App />
      </TodoState>
    </BrowserRouter>
  </React.StrictMode>
);