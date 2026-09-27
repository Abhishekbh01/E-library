import { User } from '../models/user.model.js';
import { Book } from '../models/book.model.js';
import { Borrowing } from '../models/borrowing.model.js';
import cloudinary from 'cloudinary';
import getDataUri from '../utils/getDataUri.js';
import mongoose from 'mongoose';

export const addBook = async (req, res) => {
    try {
        const { title, author, category, isbn, description, bookPrice } = req.body;
        const userId = req.id;

        // Check if the user exists and is an admin
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "User does not have permission to add books", success: false });
        }

        // Validate required fields
        if (!title || !author || !category || !isbn || !description || !bookPrice) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const file = req.files;
        let coverUrl = null;
        let bookUrl = null;

        const uploadPromises = [];

        // Upload Cover Image
        if (file?.cover?.[0]) {
            const coverFile = file.cover[0];
            const fileUri = getDataUri(coverFile);
            uploadPromises.push(
                cloudinary.uploader.upload(fileUri.content).then(response => coverUrl = response.secure_url)
            );
        }

        // Upload Book File
        // In the book file upload section of addBook controller
        if (file?.book?.[0]) {
            const bookFile = file.book[0];
            const fileUri = getDataUri(bookFile);
            uploadPromises.push(
                cloudinary.uploader.upload(fileUri.content, {
                    resource_type: "raw",
                    folder: "books",
                    type: "upload",
                    overwrite: true
                })
                    .then(response => {
                        // Manually construct the URL to use raw/upload
                        const publicId = response.public_id;
                        const version = response.version;
                        bookUrl = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/raw/upload/v${version}/${publicId}.pdf`;
                    })
                    .catch(error => {
                        console.error("Error uploading to Cloudinary:", error);
                        throw error;
                    })
            );
        }

        // Wait for both uploads to complete
        await Promise.all(uploadPromises);

        // // Create new book entry
        const newBook = new Book({
            title,
            adminId: userId,
            author,
            category,
            isbn,
            bookPrice,
            description,
            coverUrl,
            bookUrl
        });

        await newBook.save(); // Save the book data to MongoDB

        return res.status(201).json({
            message: "Book added successfully",
            book: newBook,
            success: true
        });

    } catch (error) {
        console.error(error);
        if (error.code === 11000 && error.keyPattern?.isbn) {
            return res.status(400).json({
                message: "A book with this ISBN already exists",
                success: false
            });
        }
        return res.status(500).json({
            message: "Failed to add book: " + error.message,
            success: false
        });
    }
};




export const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        const user = req.id;
        if (!user) {
            return res.status(400).json({
                message: "Not authanticated",
                success: false
            })
        }
        if (!books.length) {
            return res.status(200).json({
                message: "No books available",
                success: true,
                books: []
            });
        }

        return res.status(200).json({
            message: "List of all books",
            success: true,
            books
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get all books",
            success: false
        });
    }
};

export const getBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                message: "Book not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Book retrieved successfully",
            success: true,
            book
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get book by ID",
            success: false
        })
    }
}

export const updateBook = async (req, res) => {
    try {
        const { title, author, category, isbn, description } = req.body;
        const userId = req.id;
        const { bookId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                message: "User does not have permission to update books",
                success: false
            });
        }

        let book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                message: "Book not found",
                success: false
            });
        }

        let bookUrl = book.bookUrl;
        let coverImage = book.coverImage;

        if (req.files) {
            if (req.files['cover']) {
                try {
                    const coverUri = getDataUri(req.files['cover'][0]);
                    const cloudResponse = await cloudinary.uploader.upload(coverUri.content);
                    coverImage = cloudResponse.secure_url;
                } catch (error) {
                    console.error("Cloudinary Cover Image Upload Error:", error);
                    return res.status(500).json({
                        message: "Error uploading new cover image",
                        success: false
                    });
                }
            }

            if (req.files['book']) {
                try {
                    const bookUri = getDataUri(req.files['book'][0]);
                    const cloudResponse = await cloudinary.uploader.upload(bookUri.content, {
                        resource_type: "raw"
                    });
                    bookUrl = cloudResponse.secure_url;
                } catch (error) {
                    console.error("Cloudinary PDF Upload Error:", error);
                    return res.status(500).json({
                        message: "Error uploading new book PDF",
                        success: false
                    });
                }
            }
        }

        book.title = title || book.title;
        book.author = author || book.author;
        book.category = category || book.category;
        book.isbn = isbn || book.isbn;
        book.description = description || book.description;
        book.coverImage = coverImage;
        book.bookUrl = bookUrl;

        await book.save();

        return res.status(200).json({
            message: "Book updated successfully",
            book,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to update book",
            success: false
        });
    }
};

export const deleteBook = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const bookId = req.params.bookId;
        const userId = req.id;
        
        // Verify user exists and is admin
        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        
        if (user.role !== 'admin') {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({
                message: "User does not have permission to delete books",
                success: false
            });
        }
        
        // Find and delete the book
        const book = await Book.findByIdAndDelete(bookId).session(session);
        if (!book) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                message: "Book not found",
                success: false
            });
        }
        
        // Remove the book from all users' borrowedBooks arrays
        await User.updateMany(
            { borrowedBooks: bookId },
            { $pull: { borrowedBooks: bookId } },
            { session }
        );
        
        // Delete all borrowing records for this book
        await Borrowing.deleteMany(
            { bookId },
            { session }
        );
        
        await session.commitTransaction();
        session.endSession();
        
        return res.status(200).json({
            message: "Book deleted successfully",
            book,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to delete book",
            success: false
        });
    }
}

export const searchBook = async (req, res) => {
    try {
        const { keyword } = req.query;
        if (!keyword) {
            return res.status(400).json({
                message: "Search keyword is required",
                success: false
            });
        }

        const books = await Book.find({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { author: { $regex: keyword, $options: "i" } },
                { category: { $regex: keyword, $options: "i" } },
                { isbn: { $regex: keyword, $options: "i" } }
            ]
        });

        if (!books.length) {
            return res.status(200).json({
                message: "No books found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Search results",
            books,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error in searchBook Controller",
            success: false
        });
    }
};

