import React from 'react';

const FlavorPreviewBar = ({ flavors, showTop = 2 }) => {
  if (!flavors) {
    return (
      <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '8px', fontStyle: 'italic' }}>
        Chưa có đánh giá khẩu vị
      </div>
    );
  }

  const flavorLabels = {
    salty: { icon: '🧂', name: 'Mặn' },
    sweet: { icon: '🍯', name: 'Ngọt' },
    sour:  { icon: '🍋', name: 'Chua' },
    bitter:{ icon: '🍵', name: 'Chát' }
  };

  const renderBars = (score) => {
    const filled = Math.round(score);
    let str = '';
    for(let i=0; i<5; i++) {
      str += i < filled ? '▓' : '░';
    }
    return str;
  };

  // Sort flavors by score descending and take top N
  const topFlavors = Object.entries(flavors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, showTop);

  return (
    <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#555', marginTop: '8px' }}>
      {topFlavors.map(([key, score]) => (
        <span key={key} title={`${score}/5`}>
          {flavorLabels[key].icon} {flavorLabels[key].name}: <span style={{letterSpacing: '2px', color: '#fc8019'}}>{renderBars(score)}</span>
        </span>
      ))}
    </div>
  );
};

export default FlavorPreviewBar;
