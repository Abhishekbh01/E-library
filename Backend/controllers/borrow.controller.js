import { User } from "../models/user.model.js";
import { Book } from "../models/book.model.js";
import { Borrowing } from "../models/borrowing.model.js";

export const borrowBook = async (req, res) => {
    try {
        const userId = req.id;
        const { bookId, accessType } = req.body;

        if (!bookId || !accessType) {
            return res.status(400).json({
                message: "Book ID and access type are required",
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

        if (user.borrowedBooks.includes(bookId)) {
            return res.status(400).json({
                message: "User has already borrowed this book",
                success: false
            });
        }

        let accessExpiry = null;
        if (accessType === "Subscribe") {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 10);
            accessExpiry = expiryDate;
        }

        const borrowingRecord = new Borrowing({
            userId,
            bookId,
            accessType,
            accessExpiry
        });

        await borrowingRecord.save();

        user.borrowedBooks.push(bookId);
        await user.save();

        return res.status(200).json({
            message: "Book borrowed successfully",
            success: true,
            borrowingRecord
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to borrow book",
            success: false
        });
    }
};

export const getAllBorrowedBooks = async (req, res) => {
    try {
        const userId = req.id; 
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
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

        // Fetch borrowed books, populate book details if needed
        const borrowedBooks = await Borrowing.find({ userId }).populate("bookId"); 

        return res.status(200).json({
            message: borrowedBooks.length > 0 ? "All borrowed books" : "No borrowed books found",
            success: true,
            borrowedBooks
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get all borrowed books",
            success: false
        });
    }
};


