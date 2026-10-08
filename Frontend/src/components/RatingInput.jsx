import React from "react";
import { Star } from "lucide-react";
import PropTypes from "prop-types";

function RatingInput({ rating, setRating, interactive = true, size = 24 }) {
  const stars = [1, 2, 3, 4, 5];

  const handleStarClick = (starValue) => {
    console.log("Star clicked:", starValue);
    console.log("Current rating:", rating);
    console.log("setRating function:", typeof setRating);
    if (interactive && setRating) {
      setRating(starValue);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => handleStarClick(star)}
          className={`transition-colors ${
            interactive ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default"
          }`}
          aria-label={`Rate ${star} stars`}
          style={{ pointerEvents: interactive ? 'auto' : 'none' }}
        >
          <Star
            size={size}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

RatingInput.propTypes = {
  rating: PropTypes.number.isRequired,
  setRating: PropTypes.func,
  interactive: PropTypes.bool,
  size: PropTypes.number,
};

RatingInput.defaultProps = {
  interactive: true,
  size: 24,
};

export default RatingInput;
