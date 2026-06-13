import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Heart } from 'lucide-react';

const GameCard = ({ game }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div 
      className="glass-panel"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 20px 40px rgba(236, 72, 153, 0.15)' : '0 8px 32px rgba(236, 72, 153, 0.05)',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ position: 'relative', width: '100%', paddingTop: '75%', overflow: 'hidden' }}>
        <img 
          src={game.coverUrl} 
          alt={game.title}
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        />
        
        {/* Play Button Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}>
          <Link to={`/play/${game.id}`} className="btn btn-primary" style={{ transform: isHovered ? 'scale(1)' : 'scale(0.8)' }}>
            <Play size={20} fill="currentColor" /> Play Now
          </Link>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255,255,255,0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            zIndex: 10
          }}
        >
          <Heart size={18} color="var(--brand-primary)" fill={isFavorite ? 'var(--brand-primary)' : 'none'} />
        </button>
      </div>

      <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            {game.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#fef3c7', color: '#d97706', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            <Star size={12} fill="currentColor" />
            {game.rating}
          </div>
        </div>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {game.description}
        </p>
        
        <div style={{ display: 'inline-block', alignSelf: 'flex-start', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--brand-secondary)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>
          {game.category}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
