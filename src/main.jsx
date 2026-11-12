import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import Landing from './pages/Landing.jsx';
import Scan from './pages/Scan.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
    <Analytics />
  </StrictMode>,
);
