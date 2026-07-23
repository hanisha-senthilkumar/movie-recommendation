import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 0, onRate, readonly = false, size = "md" }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7"
  };

  const handleStarClick = (starVal) => {
    if (!readonly && onRate) {
      onRate(starVal);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const activeRating = hoverRating || rating;
        const isFilled = activeRating >= starIndex;
        const isHalf = activeRating >= starIndex - 0.5 && activeRating < starIndex;

        return (
          <button
            key={starIndex}
            type="button"
            disabled={readonly}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => !readonly && setHoverRating(starIndex)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            className={`transition-transform duration-150 ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-125 focus:outline-none'
            }`}
          >
            <Star
              className={`${starSizes[size]} ${
                isFilled
                  ? 'text-[#F2B84B] fill-[#F2B84B] drop-shadow-[0_0_8px_rgba(242,184,75,0.6)]'
                  : isHalf
                  ? 'text-[#F2B84B] fill-[#F2B84B]/50'
                  : 'text-slate-600 fill-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
