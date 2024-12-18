import Event from '../models/Event.js';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'frontend/assets/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: Images only!');
    }
}).single('image');

// Get all events
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('creator', 'username')
            .sort({ date: 1 });
        console.log('Sending events:', events); // Debug log
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create event
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, capacity, eventType } = req.body;
        
        const event = await Event.create({
            title,
            description,
            date,
            time,
            location,
            capacity: parseInt(capacity),
            eventType,
            // image: req.file ? `/assets/uploads/${req.file.filename}` : '/assets/images/default-event.jpg',
            creator: req.user._id,
            registeredUsers: []
        });

        res.status(201).json(event);
    } catch (error) {
        console.error('Event creation error:', error);
        res.status(400).json({ message: error.message });
    }
};

// Update event
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is admin or event creator
        if (req.user.isAdmin || event.creator.toString() === req.user._id.toString()) {
            const updatedEvent = await Event.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(updatedEvent);
        } else {
            res.status(403).json({ message: 'Not authorized to update this event' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete event
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is admin or event creator
        if (req.user.isAdmin || event.creator.toString() === req.user._id.toString()) {
            await event.deleteOne();
            res.json({ message: 'Event removed' });
        } else {
            res.status(403).json({ message: 'Not authorized to delete this event' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// RSVP to event
export const rsvpEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if event is full
        if (event.registeredUsers.length >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' });
        }

        // Check if user is already registered
        if (event.registeredUsers.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        // Add user to event's registeredUsers
        event.registeredUsers.push(req.user._id);
        await event.save();

        // Add event to user's registeredEvents
        await User.findByIdAndUpdate(req.user._id, {
            $push: { registeredEvents: event._id }
        });

        res.json({ message: 'Successfully registered for event' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cancel RSVP
export const cancelRSVP = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Remove user from event's registeredUsers
        event.registeredUsers = event.registeredUsers.filter(
            userId => userId.toString() !== req.user._id.toString()
        );
        await event.save();

        // Remove event from user's registeredEvents
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { registeredEvents: event._id }
        });

        res.json({ message: 'Successfully cancelled registration' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get user's registered events
export const getUserEvents = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'registeredEvents',
                populate: {
                    path: 'creator',
                    select: 'username'
                }
            });
        
        console.log('User registered events:', user.registeredEvents);
        res.json(user.registeredEvents);
    } catch (error) {
        console.error('Error getting user events:', error);
        res.status(500).json({ message: error.message });
    }
}; 