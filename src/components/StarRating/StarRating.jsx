import React from 'react';
import './StarRating.css';

const StarRating = ({ averageRating = 0, starSize = '1rem' }) => {
  // Làm tròn đến 0.5 sao
  const roundedRating = Math.round(averageRating * 2) / 2;
  
  return (
    <div className="average-rating-display" style={{ fontSize: starSize }}>
      {[1, 2, 3, 4, 5].map((star) => {
        let starClass = 'star';
        if (star <= roundedRating) {
          starClass += ' filled';
        } else if (star - 0.5 <= roundedRating) {
          starClass += ' half-filled';
        }
        
        return (
          <span key={star} className={starClass}>
            ★
          </span>
        );
      })}
      <span className="rating-value">({averageRating.toFixed(1)})</span>
    </div>
  );
};

export default StarRating;