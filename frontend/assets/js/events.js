// Move user check to the top
const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
    window.location.href = 'login.html';
}

// Add this at the beginning of your events.js
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const view = this.dataset.view;
        if (view) {
            showView(view);
            // Update active state
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(view => {
        view.style.display = 'none';
    });
    
    // Show selected view
    document.getElementById(`${viewName}View`).style.display = 'block';
    
    // Load view-specific content
    if (viewName === 'events') {
        fetchEvents();
    } else if (viewName === 'calendar') {
        updateCalendar();
    } else if (viewName === 'profile') {
        loadProfile();
    }
}

// Add this function to load profile data
async function loadProfile() {
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    
    // Fetch user's RSVP'd events
    try {
        const response = await fetch('http://localhost:5000/api/events', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const events = await response.json();
        const myEvents = events.filter(event => event.registeredUsers.includes(user._id));
        displayEvents(myEvents, 'myEventsList');
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Update logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

// Set welcome message
document.getElementById('userWelcome').textContent = `Welcome, ${user.username}!`;

// Fetch and display events
async function fetchEvents() {
    try {
        const response = await fetch('http://localhost:5000/api/events', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

function displayEvents(events) {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';

    events.forEach(event => {
        const isRegistered = event.registeredUsers.includes(user._id);
        const isAdmin = user.isAdmin;
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <img src="${event.image}" alt="${event.title}" class="event-image">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Available Spots:</strong> ${event.capacity - event.registeredUsers.length}</p>
            ${isRegistered ? 
                `<button onclick="cancelRSVP('${event._id}')" class="btn-danger">Cancel RSVP</button>` :
                `<button onclick="rsvpEvent('${event._id}')" class="btn-primary">RSVP</button>`
            }
            ${isAdmin ? `
                <div class="event-actions">
                    <button onclick="editEvent('${event._id}')" class="btn-secondary">Edit</button>
                    <button onclick="deleteEvent('${event._id}')" class="btn-danger">Delete</button>
                </div>
            ` : ''}
        `;
        eventsList.appendChild(eventCard);
    });
}

// RSVP for an event
async function rsvpEvent(eventId) {
    try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}/rsvp`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            alert('Successfully registered for event!');
            fetchEvents(); // Refresh the events list
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        alert('Error registering for event');
    }
}

// Cancel RSVP for an event
async function cancelRSVP(eventId) {
    try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}/rsvp`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            alert('Successfully cancelled RSVP');
            fetchEvents(); // Refresh the events list
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        alert('Error cancelling RSVP');
    }
}

// Initial load
fetchEvents();

// Event type filter
document.getElementById('eventTypeFilter').addEventListener('change', (e) => {
    const filterValue = e.target.value;
    fetchEvents(filterValue);
});

// Add these functions for admin actions
async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            alert('Event deleted successfully');
            fetchEvents();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        alert('Error deleting event');
    }
}

function editEvent(eventId) {
    window.location.href = `admin/edit-event.html?id=${eventId}`;
}

// Update redirect if not logged in
if (!user) {
    window.location.href = 'login.html';
} 