import {User }  from '../models/user.model.js'
import { Book } from '../models/book.model.js'
import { Review } from '../models/review.model.js';

// Helper function to update book's average rating
const updateBookRating = async (bookId) => {
    try {
        const reviews = await Review.find({ bookId });
        const totalRatings = reviews.length;

        if (totalRatings === 0) {
            await Book.findByIdAndUpdate(bookId, {
                rating: 0,
                totalRatings: 0
            });
            return;
        }

        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = sum / totalRatings;

        await Book.findByIdAndUpdate(bookId, {
            rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
            totalRatings
        });
    } catch (error) {
        console.error("Error updating book rating:", error);
    }
};

export const addReview = async (req, res) => {
    try {
        const {rating, comment} = req.body;
        const userId = req.id;
        const bookId = req.params.id;

        // Validate rating
        if (!rating || typeof rating !== 'number') {
            return res.status(400).json({
                message: "Rating is required and must be a number",
                success: false
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                message: "Book not found",
                success: false
            });
        }

        // Check if user has already reviewed the book
        const existingReview = await Review.findOne({ userId, bookId });
        if (existingReview) {
            existingReview.rating = rating;
            existingReview.comment = comment || "";
            await existingReview.save();
            await updateBookRating(bookId);

            const updatedBook = await Book.findById(bookId);
            return res.json({
                message: "Review updated successfully",
                success: true,
                review: existingReview,
                averageRating: updatedBook.rating,
                ratingCount: updatedBook.totalRatings
            });
        }

        const newReview = await Review.create({
            userId,
            bookId,
            rating,
            comment: comment || ""
        });

        await updateBookRating(bookId);

        const updatedBook = await Book.findById(bookId);

        return res.json({
            message: "Review added successfully",
            success: true,
            review: newReview,
            averageRating: updatedBook.rating,
            ratingCount: updatedBook.totalRatings
        });

    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already reviewed this book",
                success: false
            });
        }
        return res.status(500).json({
            message: "Failed to add review",
            success: false
        });
    }
}

export const getReviews = async (req, res) => {
    try {
        const bookId = req.params.id;
        const reviews = await Review.find({ bookId })
            .populate("userId", "fullname email")
            .sort({ createdAt: -1 });

        return res.json({
            message: "Reviews fetched successfully",
            success: true,
            reviews
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get reviews",
            success: false
        });
    }
}

export const getUserRatingForBook = async (req, res) => {
    try {
        const userId = req.id;
        const bookId = req.params.id;

        const review = await Review.findOne({ userId, bookId });

        if (!review) {
            return res.json({
                message: "No rating found",
                success: true,
                review: null
            });
        }

        return res.json({
            message: "User rating fetched successfully",
            success: true,
            review
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get user rating",
            success: false
        });
    }
}

export const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                message: "Review not found",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (review.userId.toString() !== userId.toString() && user.role !== "admin") {
            return res.status(403).json({
                message: "Unauthorized to delete this review",
                success: false
            });
        }

        const bookId = review.bookId;
        await Review.findByIdAndDelete(reviewId);
        await updateBookRating(bookId);

        const updatedBook = await Book.findById(bookId);

        return res.json({
            message: "Review deleted successfully",
            success: true,
            averageRating: updatedBook.rating,
            ratingCount: updatedBook.totalRatings
        });

    } catch (error) {
        console.error("Error in deleteReview:", error);
        return res.status(500).json({
            message: "Failed to delete review",
            success: false
        });
    }
};
