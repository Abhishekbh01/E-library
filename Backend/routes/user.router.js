import express from 'express';
import { login, logout, numberOfBorrowedBooks, register, updateProfile, addBorrowedBook, addToWishlist, removeFromWishlist, getWishlist } from '../controllers/user.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { multipleUpload } from '../middleware/multer.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/profile/update').post(isAuthenticated, multipleUpload,  updateProfile);
router.route('/borrowedBooks')
    .get(isAuthenticated, numberOfBorrowedBooks)
    .post(isAuthenticated, addBorrowedBook);

// Wishlist routes
router.route('/wishlist')
    .get(isAuthenticated, getWishlist)
    .post(isAuthenticated, addToWishlist);
router.route('/wishlist/:bookId')
    .delete(isAuthenticated, removeFromWishlist);


export default router;


