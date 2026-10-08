import React from "react";
import { Star } from "lucide-react";
import PropTypes from "prop-types";

function RatingSummary({ averageRating, ratingCount, reviews }) {
  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews?.filter((r) => r.rating === star).length || 0;
    const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center gap-6">
        {/* Average Rating Display */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-4xl font-bold text-gray-900">
              {averageRating || 0}
            </span>
            <Star className="fill-yellow-400 text-yellow-400 h-8 w-8" />
          </div>
          <p className="text-sm text-gray-500">{ratingCount || 0} ratings</p>
        </div>

        {/* Rating Distribution Bars */}
        <div className="flex-1 space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-sm text-gray-600 w-8">{star}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

RatingSummary.propTypes = {
  averageRating: PropTypes.number,
  ratingCount: PropTypes.number,
  reviews: PropTypes.array,
};

RatingSummary.defaultProps = {
  averageRating: 0,
  ratingCount: 0,
  reviews: [],
};

export default RatingSummary;
