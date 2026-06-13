import React, { useEffect, useState } from 'react';

const SparkleCursor = () => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    let sparkleId = 0;

    const handleMouseMove = (e) => {
      // Create a new sparkle every few pixels instead of every single event to avoid overwhelming React
      if (Math.random() > 0.5) return;

      const newSparkle = {
        id: sparkleId++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 10 + 5, // 5px to 15px
        color: Math.random() > 0.5 ? 'var(--brand-primary)' : 'var(--brand-secondary)'
      };

      setSparkles(prev => [...prev.slice(-15), newSparkle]); // Keep max 15 sparkles to prevent lag
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="sparkle-anim"
          style={{
            position: 'absolute',
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            background: sparkle.color,
            borderRadius: '50%',
            filter: 'blur(2px)',
            boxShadow: `0 0 10px ${sparkle.color}`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};

export default SparkleCursor;
