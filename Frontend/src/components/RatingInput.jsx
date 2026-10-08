import React from "react";
import { Star } from "lucide-react";
import PropTypes from "prop-types";

function RatingInput({ rating, setRating, interactive = true, size = 24 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(star)}
          className={`transition-colors ${
            interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
          }`}
          aria-label={`Rate ${star} stars`}
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
