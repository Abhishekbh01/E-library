import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { addBook, deleteBook, getAllBooks, getBookById, searchBook, updateBook } from '../controllers/book.controller.js';
import { borrowBook, getAllBorrowedBooks } from '../controllers/borrow.controller.js';
import { multipleUpload } from '../middleware/multer.js';

const router = express.Router();

router.route('/add').post(isAuthenticated,multipleUpload, addBook);
router.route('/getAll').get(isAuthenticated, getAllBooks);
router.route('/get/:id').get(isAuthenticated, getBookById);
router.route('/update/:bookId').post(isAuthenticated,multipleUpload, updateBook);
router.route('/delete/:bookId').get(isAuthenticated, deleteBook);
router.route("/search").get(searchBook);

router.route('/borrow').post(isAuthenticated, borrowBook);
router.route('/getAllborrowedBooks').get(isAuthenticated, getAllBorrowedBooks);
export default router;