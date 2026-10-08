import React from "react";
import { Star, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RatingStars from "./ratingStars";
import PropTypes from "prop-types";

function ReviewItem({ review, isOwnReview, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">
            {review.userId?.fullname || "Anonymous User"}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <RatingStars rating={review.rating} />
            <span className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>
        {isOwnReview && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(review)}
              className="h-8 w-8 p-0"
            >
              <Edit2 size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(review._id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>
      {review.comment && (
        <p className="text-gray-700 mt-2">{review.comment}</p>
      )}
    </div>
  );
}

ReviewItem.propTypes = {
  review: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    userId: PropTypes.shape({
      fullname: PropTypes.string,
      email: PropTypes.string,
    }),
    rating: PropTypes.number.isRequired,
    comment: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  isOwnReview: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

ReviewItem.defaultProps = {
  isOwnReview: false,
  onEdit: () => {},
  onDelete: () => {},
};

export default ReviewItem;
