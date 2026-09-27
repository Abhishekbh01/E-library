import React from "react";
import PropTypes from 'prop-types';
import { Star } from "lucide-react";

function RatingStars({ rating = 0 }) {
  // Validate rating prop
  if (typeof rating !== 'number' || isNaN(rating)) {
    console.error('Invalid rating prop:', rating);
    return null; // Or return a default star display
  }
  // Ensure rating is a number between 0 and 5
  const normalizedRating = Math.min(5, Math.max(0, Number(rating) || 0));
  
  const stars = Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      size={16}
      className={index < normalizedRating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
      aria-hidden="true"
    />
  ));

  return (
    <div className="flex" aria-label={`Rating: ${normalizedRating} out of 5 stars`}>
      {stars}
    </div>
  );
}

RatingStars.propTypes = {
  rating: PropTypes.number
};

RatingStars.defaultProps = {
  rating: 0
};

export default RatingStars;
