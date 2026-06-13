import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Maximize2, Heart, Share2, AlertCircle } from 'lucide-react';
import { gamesData } from '../data/games';
import { supabase } from '../supabaseClient';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';

const GamePlayer = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState('FREE');
  const [trialSeconds, setTrialSeconds] = useState(5400);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundGame = gamesData.find(g => g.id === id);
    if (foundGame) setGame(foundGame);
    
    // Check Auth Status and Plan
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        supabase.from('profiles').select('plan, trial_seconds_remaining').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data) {
              setPlan(data.plan);
              setTrialSeconds(data.trial_seconds_remaining ?? 5400);
            }
          });
      } else if (foundGame && foundGame.isFree) {
        // Enforce login to play free trial
        window.location.href = 'http://localhost:5173/login';
      }
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!game || plan === 'PRO' || !game.isFree || !user || trialSeconds <= 0) return;

    let isFocused = document.hasFocus();
    const onFocus = () => isFocused = true;
    const onBlur = () => isFocused = false;
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    const heartbeat = async () => {
      if (!isFocused) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      try {
        const res = await fetch(`${apiUrl}/api/heartbeat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setTrialSeconds(data.trial_seconds_remaining);
        }
      } catch(err) { console.error('Heartbeat failed:', err); }
    };

    const intervalId = setInterval(heartbeat, 60000); // every minute
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, [game, plan, user, trialSeconds]);

  const handleFullscreen = () => {
    const iframe = document.getElementById('game-iframe');
    if (iframe) {
      if (iframe.requestFullscreen) iframe.requestFullscreen();
      else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
      else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>Loading...</div>;
  if (!game) return (
    <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
      <AlertCircle size={48} color="var(--brand-primary)" style={{ margin: '0 auto 1rem' }} />
      <h1 style={{ fontFamily: 'var(--font-heading)' }}>Game Not Found</h1>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Arcade</Link>
    </div>
  );

  return (
    <div className="container" style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 800px', display: 'flex', flexDirection: 'column' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Games
        </Link>
        
        {/* Trial Timer Display */}
        {plan !== 'PRO' && game.isFree && trialSeconds > 0 && (
          <div style={{ background: trialSeconds <= 300 ? '#ff0055' : 'rgba(255,255,255,0.6)', color: trialSeconds <= 300 ? '#fff' : 'var(--brand-secondary)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', marginBottom: '1rem', display: 'inline-block', alignSelf: 'flex-start', border: trialSeconds > 300 ? '1px solid var(--border-color)' : 'none' }}>
            Free Trial: {Math.floor(trialSeconds / 60)}:{(trialSeconds % 60).toString().padStart(2, '0')}
          </div>
        )}

        <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', background: '#fff' }}>
          <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#ff1493', borderRadius: '16px', overflow: 'hidden', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)' }}>
            <iframe
              id="game-iframe"
              src={game.gameUrl}
              title={game.title}
              allowFullScreen
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none',
                filter: (trialSeconds <= 0 && plan !== 'PRO') ? 'blur(10px) grayscale(100%)' : 'none',
                pointerEvents: (trialSeconds <= 0 && plan !== 'PRO') ? 'none' : 'auto'
              }}
            ></iframe>

            {trialSeconds <= 0 && plan !== 'PRO' && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.8)', zIndex: 10 }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>Time's Up! ⏰</h2>
                <p style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '2rem' }}>Your 1.5-hour free trial has expired.</p>
                <a href="http://localhost:5173/pricing" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem', textDecoration: 'none' }}>
                  👑 Subscribe to Pro Gamer
                </a>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', padding: '0 0.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '2rem', color: 'var(--text-primary)' }}>{game.title}</h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setIsFavorite(!isFavorite)} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px' }}>
                <Heart size={20} fill={isFavorite ? 'var(--brand-primary)' : 'none'} color={isFavorite ? 'var(--brand-primary)' : 'var(--brand-primary)'} />
              </button>
              <button className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px' }}>
                <Share2 size={20} />
              </button>
              <button onClick={handleFullscreen} className="btn btn-primary" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px' }}>
                <Maximize2 size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem', fontSize: '1.5rem' }}>About this Game</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{game.description}</p>
        </div>
      </div>
      
      <div style={{ flex: '0 1 300px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>You might also like</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {gamesData.filter(g => g.category === game.category && g.id !== game.id).slice(0, 4).map(rg => (
            <Link key={rg.id} to={`/play/${rg.id}`} className="glass-panel" style={{ display: 'flex', gap: '1rem', padding: '0.75rem', alignItems: 'center', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.02)' } }}>
              <img src={rg.coverUrl} alt={rg.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{rg.title}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--brand-secondary)', background: 'rgba(168, 85, 247, 0.1)', padding: '0.1rem 0.5rem', borderRadius: '999px', display: 'inline-block' }}>{rg.category}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;
