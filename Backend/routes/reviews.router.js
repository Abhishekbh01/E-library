import express from 'express';
import { addReview, deleteReview, getReviews } from '../controllers/review.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route('/add/:id').post(isAuthenticated, addReview);
router.route('/getAll/:id').get(getReviews);
router.route('/delete/:id').get(isAuthenticated, deleteReview);

export default router;