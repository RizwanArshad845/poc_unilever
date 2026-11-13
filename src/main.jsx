import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import Landing from './pages/Landing.jsx';
import Scan from './pages/Scan.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      {/* App is served under /unilever/ (vite.config.js `base`) */}
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
);
