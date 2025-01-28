import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './login';
import App from './App';
import Register from './Register';
import AuthWrapper from './AuthWrapper';


const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <Router>
      <Routes>
        <Route
          path="/admin"
          element={
            <AuthWrapper>
              <App />
            </AuthWrapper>
          }
        />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  </StrictMode>
);
