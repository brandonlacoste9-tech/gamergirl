import React, { useMemo } from 'react';
import { Sparkles, TrendingUp, Star, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { gamesData } from '../data/games';

const Home = () => {
  const navigate = useNavigate();

  const trendingGames = useMemo(() => {
    return [...gamesData].filter(g => g.isPopular).slice(0, 8);
  }, []);

  const newArrivals = useMemo(() => {
    // Just shuffling to fake "new" since we don't have dates
    return [...gamesData].sort(() => 0.5 - Math.random()).slice(0, 8);
  }, []);

  const allGames = useMemo(() => {
    return [...gamesData].slice(0, 200); // Show top 200 to keep DOM fast but look massive
  }, []);

  const featuredCategories = ['Fashion & Beauty', 'Cooking', 'Simulation', 'Design', 'Puzzles', 'Pets & Animals'];

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      
      {/* Hero Poster */}
      <div className="animate-fade-in" style={{
        width: '100%',
        marginTop: '1rem',
        marginBottom: '4rem',
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(236,72,153,0.2)'
      }}>
        <img 
          src="/assets/gamergurls_poster.jpg" 
          alt="Gamer Gurls - Over 800+ of your favourite games" 
          style={{ width: '100%', display: 'block', objectFit: 'cover' }}
        />
        
        {/* Call to Action Button overlaid on the poster */}
        <div style={{
          position: 'absolute',
          bottom: '8%',
          right: '5%',
          display: 'flex',
          gap: '1rem'
        }}>
          <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.2rem', boxShadow: '0 0 20px rgba(236,72,153,0.8)' }}>
            Start Playing
          </button>
        </div>
      </div>

      {/* Featured Categories Pills */}
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '3rem', scrollbarWidth: 'none' }}>
        {featuredCategories.map(cat => (
          <button 
            key={cat} 
            onClick={() => navigate(`/categories?cat=${encodeURIComponent(cat)}`)}
            className="glass-panel" 
            style={{ 
              padding: '1rem 2rem', 
              borderRadius: '9999px', 
              whiteSpace: 'nowrap', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              color: 'var(--brand-secondary)',
              border: '1px solid var(--border-color)',
              background: 'rgba(255, 255, 255, 0.6)'
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Trending Now */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--brand-primary)', padding: '0.5rem', borderRadius: '50%', color: '#fff' }}>
            <TrendingUp size={24} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: 0 }}>Trending Now</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {trendingGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--brand-accent)', padding: '0.5rem', borderRadius: '50%', color: '#fff' }}>
            <Star size={24} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: 0 }}>New Arrivals</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {newArrivals.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* All Games (Massive Grid) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--brand-secondary)', padding: '0.5rem', borderRadius: '50%', color: '#fff' }}>
            <Crown size={24} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: 0 }}>The Full Collection (800+)</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {allGames.map((game, index) => (
            <GameCard key={`${game.id}-${index}`} game={game} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
