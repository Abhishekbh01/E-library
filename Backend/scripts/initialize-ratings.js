import dotenv from 'dotenv';
import connectDB from '../utils/db.js';
import { Book } from '../models/book.model.js';
import { Review } from '../models/review.model.js';

dotenv.config();

const initializeRatings = async () => {
    try {
        await connectDB();
        console.log('Connected to database');

        const books = await Book.find();

        console.log(`Found ${books.length} books`);

        for (const book of books) {
            const reviews = await Review.find({ bookId: book._id });
            const totalRatings = reviews.length;

            if (totalRatings === 0) {
                book.rating = 0;
                book.totalRatings = 0;
            } else {
                const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
                book.rating = Math.round((sum / totalRatings) * 10) / 10;
                book.totalRatings = totalRatings;
            }

            await book.save();
            console.log(`Updated rating for book: ${book.title} - ${book.rating} (${totalRatings} reviews)`);
        }

        console.log('✅ Ratings initialized successfully for all books');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing ratings:', error);
        process.exit(1);
    }
};

initializeRatings();
