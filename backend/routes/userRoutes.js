import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Get user's registered events
router.get('/events', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('registeredEvents');
        res.json(user.registeredEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 