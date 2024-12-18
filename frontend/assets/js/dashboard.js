// Load events
async function loadEvents() {
    try {
        const response = await fetch('https://campuseventmanagement-backend.onrender.com/api/events', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        
        const events = await response.json();
        console.log('Fetched events:', events); // Debug log
        
        displayEvents(events);
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// Display events
function displayEvents(events) {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';

    if (events.length === 0) {
        eventsList.innerHTML = '<p class="no-events">No events available</p>';
        return;
    }

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        const imageUrl = event.image.startsWith('/') 
            ? `https://campuseventmanagement-backend.onrender.com${event.image}`
            : event.image;
            
        eventCard.innerHTML = `
            <img src="${imageUrl}" 
                alt="${event.title}" 
                class="event-image" 
                onerror="this.src='../assets/images/default-event.jpg'">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Available Spots:</strong> ${event.capacity - event.registeredUsers.length}/${event.capacity}</p>
            ${user.isAdmin ? `
                <div class="event-actions">
                    <button onclick="editEvent('${event._id}')" class="btn-secondary">Edit</button>
                    <button onclick="deleteEvent('${event._id}')" class="btn-danger">Delete</button>
                </div>
            ` : `
                <button onclick="rsvpEvent('${event._id}')" class="btn-primary"
                    ${event.registeredUsers.includes(user._id) ? 'disabled' : ''}>
                    ${event.registeredUsers.includes(user._id) ? 'Already Registered' : 'RSVP'}
                </button>
            `}
        `;
        eventsList.appendChild(eventCard);
    });
}

// Load profile
async function loadProfile() {
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;

    try {
        const response = await fetch('https://campuseventmanagement-backend.onrender.com/api/users/events', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const registeredEvents = await response.json();
        displayRegisteredEvents(registeredEvents);
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Event actions
async function rsvpEvent(eventId) {
    try {
        const response = await fetch(`https://campuseventmanagement-backend.onrender.com/api/events/${eventId}/rsvp`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        if (response.ok) {
            alert('Successfully registered for event');
            loadEvents();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        alert('Error registering for event');
    }
}

// Add delete event function
async function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        try {
            const response = await fetch(`https://campuseventmanagement-backend.onrender.com/api/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                alert('Event deleted successfully');
                loadEvents(); // Refresh the events list
            } else {
                const data = await response.json();
                alert(data.message || 'Error deleting event');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting event');
        }
    }
}

// Display registered events
function displayRegisteredEvents(events) {
    const eventsList = document.getElementById('registeredEventsList');
    eventsList.innerHTML = '';

    if (!events || events.length === 0) {
        eventsList.innerHTML = '<p>No registered events</p>';
        return;
    }

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        const imageUrl = event.image.startsWith('/') 
            ? `https://campuseventmanagement-backend.onrender.com${event.image}`
            : event.image;

        eventCard.innerHTML = `
            <img src="${imageUrl}" 
                alt="${event.title}" 
                class="event-image" 
                onerror="this.src='../assets/images/default-event.jpg'">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <button onclick="cancelRSVP('${event._id}')" class="btn-danger">Cancel RSVP</button>
        `;
        eventsList.appendChild(eventCard);
    });
}

// Add this function to dashboard.js
async function cancelRSVP(eventId) {
    try {
        const response = await fetch(`https://campuseventmanagement-backend.onrender.com/api/events/${eventId}/rsvp`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        
        if (response.ok) {
            alert('Successfully cancelled RSVP');
            // Refresh both the events list and profile view
            loadEvents();
            loadProfile();
        } else {
            const data = await response.json();
            alert(data.message || 'Error cancelling RSVP');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error cancelling RSVP');
    }
}
  