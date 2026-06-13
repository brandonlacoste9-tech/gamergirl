import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import GamePlayer from './pages/GamePlayer';
import Categories from './pages/Categories';
import SparkleCursor from './components/SparkleCursor';
import { playHoverSound } from './utils/audio';

function App() {
  useEffect(() => {
    // Global listener for hover sounds
    const handleMouseOver = (e) => {
      // Check if we hovered over a button, link, or game card
      const target = e.target.closest('button, a, .glass-panel');
      if (target && !target.dataset.hovered) {
        target.dataset.hovered = 'true';
        playHoverSound();
        
        // Remove the hovered state when mouse leaves to allow re-triggering
        target.addEventListener('mouseleave', () => {
          target.dataset.hovered = 'false';
        }, { once: true });
      }
    };

    document.body.addEventListener('mouseover', handleMouseOver);
    return () => document.body.removeEventListener('mouseover', handleMouseOver);
  }, []);

  return (
    <BrowserRouter>
      <SparkleCursor />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/play/:id" element={<GamePlayer />} />
        <Route path="*" element={<div className="container" style={{padding: '4rem', textAlign: 'center'}}>Coming soon...</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
