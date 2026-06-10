import { ClickableStarRatingProps } from '@/lib/definitions';
import { useState } from 'react';

const ClickableStarRating: React.FC<ClickableStarRatingProps> = ({
  rating,
  max = 5,
  size = 24,
  color = 'black',
  onChange,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayRating = hoverValue ?? rating;
  const effectiveRating = Math.max(0, Math.min(displayRating, max));
  const stars = Array.from({ length: max }, (_, i) => {
    const starValue = i + 1;
    if (effectiveRating >= starValue) {
      return 'full';
    } else if (effectiveRating >= starValue - 0.5) {
      return 'half';
    } else {
      return 'empty';
    }
  });

  return (
    <div>
      {stars.map((type, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            onClick={() => {
              if (rating === starValue) {
                onChange?.(0);
              } else {
                onChange?.(starValue);
              }
            }}
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(null)}
            style={{ cursor: 'pointer', fontSize: size, color }}
          >
            {type === 'full' && '★'}
            {type === 'half' && '⯪'}
            {type === 'empty' && '☆'}
          </span>
        );
      })}
    </div>
  );
};

export default ClickableStarRating;
