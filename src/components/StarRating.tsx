// Got help from a Bing search for "represent a number in stars as in a product rating react next.js typescript"

import { StarRatingProps } from "@/lib/definitions";

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    max = 5,
    size = 24,
    color = "#FFD700",
  }) => {
    const safeRating = Math.max(0, Math.min(rating, max));
    const stars = Array.from({ length: max }, (_, i) => {
      const starValue = i + 1;
      if (safeRating >= starValue) {
        return "full";
      } else if (safeRating >= starValue - 0.5) {
        return "half";
      } else {
        return "empty";
      }
    });
    return (
      <div>
        {stars.map((type, index) => (
          <span key={index} style={{ fontSize: size, color }}>
            {type === "full" && "★"}
            {type === "half" && "⯪"}
            {type === "empty" && "☆"}
          </span>
        ))}
      </div>
    );
  };

  export default StarRating;