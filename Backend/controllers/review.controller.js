import {User }  from '../models/user.model.js'
import { Book } from '../models/book.model.js'
import { Review } from '../models/review.model.js';
export const addReview = async (req, res) => {
    try {
        const {rating, comment} = req.body;
        const userId = req.id;
        const bookId = req.params.id;
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
            existingReview.comment = comment;
            await existingReview.save();
            return res.json({
                message: "Review updated successfully",
                success: true,
                review: existingReview
            });
        }
        const newReview = Review.create({
            userId,
            bookId,
            rating,
            comment
        });
        return res.json({
            message: "Review added successfully",
            success: true,
            review: newReview
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to add review",
            success: false
        });
    }
}

export const getReviews = async (req, res) => {
    try {
        const bookId = req.params.id;
        const reviews = await Review.find({ bookId }).populate("userId", "name email");
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

        await Review.findByIdAndDelete(reviewId);

        return res.json({
            message: "Review deleted successfully",
            success: true
        });

    } catch (error) {
        console.error("Error in deleteReview:", error);
        return res.status(500).json({
            message: "Failed to delete review",
            success: false
        });
    }
};
