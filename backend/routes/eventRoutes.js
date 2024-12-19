import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    createEvent, 
    getEvents, 
    updateEvent, 
    deleteEvent,
    rsvpEvent,
    cancelRSVP,
} from '../controllers/eventController.js';

const router = express.Router();

router.route('/')
    .get(getEvents)
    .post(protect, createEvent);

router.route('/:id')
    .put(protect, updateEvent)
    .delete(protect, deleteEvent);

router.route('/:id/rsvp')
    .post(protect, rsvpEvent)
    .delete(protect, cancelRSVP);

export default router; 