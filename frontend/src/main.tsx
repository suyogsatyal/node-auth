import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/Context.tsx';
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx';
import Settings from './pages/Settings.tsx';
import Dashboard from './pages/Dashboard.tsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} ></Route>
        <Route path="/settings" element={<Settings />} ></Route>
        <Route path="/dashboard" element={<Dashboard />} ></Route>
        <Route path="/login" element={<Login />} ></Route>
        <Route path="/signup" element={<Signup />} ></Route>
      </Routes>
    </BrowserRouter>
        </AuthProvider>
  </React.StrictMode>,
)
