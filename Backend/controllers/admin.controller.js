import { Book } from "../models/book.model.js";
import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";

export const dashBoard = async (req, res) => {
    try {
        const adminId = req.id;
        const admin = await User.findById(adminId);

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({
                message: "Unauthorized access",
                success: false
            });
        }

        const totalUploadedBooks = await Book.countDocuments({ adminId });

        const booksByAdmin = await Book.find({ adminId }).select('_id');
        const bookIds = booksByAdmin.map(book => book._id);

        const totalReviews = await Review.countDocuments({ bookId: { $in: bookIds } });

        const avgRatingData = await Review.aggregate([
            { $match: { bookId: { $in: bookIds } } },
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        const avgRating = avgRatingData.length > 0 ? avgRatingData[0].avgRating.toFixed(2) : "N/A";

        return res.json({
            success: true,
            data: {
                totalUploadedBooks,
                totalReviews,
                avgRating
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get dashboard data",
            success: false
        });
    }
};

export const getAllBooksWrittenByAdmin = async (req, res) => {
    try {
        const user = req.id;
        const admin = await User.findById(user);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({
                message: "Unauthorized access",
                success: false
            });
        }
        const adminId = admin._id;
        const books = await Book.find({ adminId }).populate('title').sort({ createdAt: -1 });
        return res.json({
            success: true,
            books: books || [],
            message: "Books fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching books written by admin:", error);
        return res.status(500).json({
            message: "Failed to fetch books",
            success: false
        });
        
    }
}
