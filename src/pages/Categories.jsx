import React, { useState, useMemo } from 'react';
import { Sparkles, Gamepad2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { gamesData } from '../data/games';

const Categories = () => {
  const location = useLocation();
  // Allow passing a category via query param ?cat=Cooking
  const initialCategory = new URLSearchParams(location.search).get('cat') || 'All';
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Extract all unique categories from the games data
  const allCategories = useMemo(() => {
    const cats = new Set(gamesData.map(g => g.category));
    return ['All', ...Array.from(cats)].sort();
  }, []);

  const filteredGames = useMemo(() => {
    if (selectedCategory === 'All') return gamesData;
    return gamesData.filter(g => g.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="container" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Sparkles size={32} color="var(--brand-primary)" />
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: 0, color: 'var(--text-primary)' }}>
          Browse Categories
        </h1>
      </div>

      {/* Category Selection Pills */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        flexWrap: 'wrap', 
        marginBottom: '3rem' 
      }}>
        {allCategories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? 'btn btn-primary' : 'glass-panel'}
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '9999px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              border: selectedCategory === cat ? 'none' : '1px solid var(--border-color)',
              color: selectedCategory === cat ? '#fff' : 'var(--brand-secondary)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--brand-accent)', padding: '0.5rem', borderRadius: '50%', color: '#fff' }}>
          <Gamepad2 size={24} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: 0 }}>
          {selectedCategory === 'All' ? 'All Games' : `${selectedCategory} Games`} 
          <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>({filteredGames.length})</span>
        </h2>
      </div>

      {filteredGames.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3>No games found in this category.</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}

    </div>
  );
};

export default Categories;
