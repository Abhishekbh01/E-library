import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: "" },
}, { timestamps: true });

// Unique compound index to prevent duplicate reviews from same user for same book
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
