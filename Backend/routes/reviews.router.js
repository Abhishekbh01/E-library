import express from 'express';
import { addReview, deleteReview, getReviews, getUserRatingForBook } from '../controllers/review.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route('/add/:id').post(isAuthenticated, addReview);
router.route('/getAll/:id').get(getReviews);
router.route('/my-rating/:id').get(isAuthenticated, getUserRatingForBook);
router.route('/delete/:id').delete(isAuthenticated, deleteReview);

export default router;