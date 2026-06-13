import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Search, User, LogOut, Moon, Sun } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Header = () => {
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('gamergirl-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gamergirl-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: '1rem',
      margin: '1rem auto',
      maxWidth: '1200px',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      borderRadius: '9999px'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Sparkles size={28} color="var(--brand-primary)" fill="var(--brand-primary)" />
        <span style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: '1.5rem', 
          fontWeight: 800,
          background: 'var(--hub-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          GamerGurls
        </span>
      </Link>

      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Home</Link>
        <Link to="/categories" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Categories</Link>
        
        <div style={{ position: 'relative', marginLeft: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search games..." 
            style={{
              padding: '0.5rem 1rem 0.5rem 2.5rem',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)',
              background: 'rgba(255,255,255,0.8)',
              outline: 'none',
              fontFamily: 'var(--font-main)',
              width: '200px'
            }}
          />
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={toggleTheme} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px' }}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <a href={`${import.meta.env.VITE_ARCADE_URL || 'http://localhost:5173'}/pricing`} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: '#d97706', borderColor: '#fcd34d', background: '#fef3c7' }}>
              👑 Go Pro
            </a>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--brand-secondary)' }}>
              <Heart size={20} fill="var(--brand-secondary)" /> My Favorites
            </Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={toggleTheme} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px' }}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <a href={`${import.meta.env.VITE_ARCADE_URL || 'http://localhost:5173'}/pricing`} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: '#d97706', borderColor: '#fcd34d', background: '#fef3c7' }}>
              👑 Go Pro
            </a>
            <a href={`${import.meta.env.VITE_ARCADE_URL || 'http://localhost:5173'}/login`} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', textDecoration: 'none' }}>
              <User size={16} /> Login
            </a>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
