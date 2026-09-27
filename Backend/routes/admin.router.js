import express from 'express';
import { dashBoard, getAllBooksWrittenByAdmin } from '../controllers/admin.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route('/dashboard').get(isAuthenticated, dashBoard);
router.route('/books').get(isAuthenticated, getAllBooksWrittenByAdmin);

export default router;