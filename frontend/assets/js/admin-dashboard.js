// Check admin status
const user = JSON.parse(localStorage.getItem('user'));
if (!user || !user.isAdmin) {
    window.location.href = '../login.html';
}

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const view = this.dataset.view;
        if (view) {
            // Store current view in localStorage
            localStorage.setItem('view', view);
            showView(view);
            // Update active state
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Check for stored view on page load
const storedView = localStorage.getItem('view');
if (storedView) {
    showView(storedView);
    document.querySelector(`[data-view="${storedView}"]`).classList.add('active');
    localStorage.removeItem('view'); // Clear stored view
}

// View management
function showView(viewName) {
    document.querySelectorAll('.view-section').forEach(view => {
        view.style.display = 'none';
    });
    document.getElementById(`${viewName}View`).style.display = 'block';
    
    if (viewName === 'events') {
        fetchEvents();
    } else if (viewName === 'calendar') {
        updateCalendar();
    } else if (viewName === 'profile') {
        loadAdminProfile();
    }
}

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
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <img src="${event.image}" alt="${event.title}" class="event-image">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Capacity:</strong> ${event.registeredUsers.length}/${event.capacity}</p>
            <div class="event-actions">
                <button onclick="editEvent('${event._id}')" class="btn-secondary">Edit</button>
                <button onclick="deleteEvent('${event._id}')" class="btn-danger">Delete</button>
            </div>
        `;
        eventsList.appendChild(eventCard);
    });
}

// Calendar view
async function updateCalendar() {
    try {
        const response = await fetch('http://localhost:5000/api/events', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const events = await response.json();
        
        // Clear existing calendar
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        // Create calendar grid
        const currentDate = new Date();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        
        // Create calendar header
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const calendarHeader = document.createElement('h3');
        calendarHeader.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        calendar.appendChild(calendarHeader);

        // Create days grid
        const daysGrid = document.createElement('div');
        daysGrid.className = 'calendar-grid';
        
        // Add day headers
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            daysGrid.appendChild(dayHeader);
        });

        // Add days
        for (let i = 1; i <= daysInMonth; i++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            const dayEvents = events.filter(event => event.date.startsWith(dateStr));
            
            dayCell.innerHTML = `
                <div class="day-number">${i}</div>
                ${dayEvents.map(event => `
                    <div class="calendar-event" title="${event.title}">
                        ${event.title} (${event.time})
                    </div>
                `).join('')}
            `;
            
            daysGrid.appendChild(dayCell);
        }
        
        calendar.appendChild(daysGrid);
    } catch (error) {
        console.error('Error updating calendar:', error);
    }
}

// Admin profile
async function loadAdminProfile() {
    // Display admin info
    document.getElementById('profileUsername').textContent = `Username: ${user.username}`;
    document.getElementById('profileEmail').textContent = `Email: ${user.email}`;
    
    try {
        // Fetch all events
        const response = await fetch('http://localhost:5000/api/events', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const events = await response.json();
        
        // Filter events where admin has RSVP'd
        const rsvpdEvents = events.filter(event => event.registeredUsers.includes(user._id));
        
        // Display stats
        const statsGrid = document.getElementById('eventsStats');
        statsGrid.innerHTML = `
            <div class="stats-card">
                <h4>Total Events Created</h4>
                <p>${events.length}</p>
            </div>
            <div class="stats-card">
                <h4>Events RSVP'd</h4>
                <p>${rsvpdEvents.length}</p>
            </div>
            <div class="stats-card">
                <h4>Upcoming Events</h4>
                <p>${events.filter(event => new Date(event.date) > new Date()).length}</p>
            </div>
        `;

        // Display RSVP'd events
        const rsvpSection = document.createElement('div');
        rsvpSection.className = 'rsvp-events';
        rsvpSection.innerHTML = `
            <h3>My RSVP'd Events</h3>
            <div class="events-grid">
                ${rsvpdEvents.map(event => `
                    <div class="event-card">
                        <img src="${event.image}" alt="${event.title}" class="event-image">
                        <h3>${event.title}</h3>
                        <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${event.time}</p>
                        <p><strong>Location:</strong> ${event.location}</p>
                        <button onclick="cancelRSVP('${event._id}')" class="btn-danger">Cancel RSVP</button>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.getElementById('profileView').appendChild(rsvpSection);
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Add RSVP functionality
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
            loadAdminProfile(); // Refresh profile
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        alert('Error cancelling RSVP');
    }
}

// Event management functions
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
    window.location.href = `edit-event.html?id=${eventId}`;
}

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '../login.html';
});

// Set welcome message
document.getElementById('userWelcome').textContent = `Welcome, Admin ${user.username}!`;

// Initial load
fetchEvents(); 