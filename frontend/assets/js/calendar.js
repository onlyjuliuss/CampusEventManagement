import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    
    const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        events: fetchEvents,
        eventClick: function(info) {
            // Handle event click
            showEventDetails(info.event);
        },
        select: function(info) {
            // Handle date selection
            if (isAdmin()) {
                showCreateEventModal(info);
            }
        }
    });

    calendar.render();
});

async function fetchEvents() {
    try {
        const response = await fetch('https://campuseventmanagement-backend.onrender.com/api/events');
        const events = await response.json();
        
        return events.map(event => ({
            id: event._id,
            title: event.title,
            start: event.date + 'T' + event.time,
            description: event.description,
            location: event.location,
            extendedProps: {
                capacity: event.capacity,
                registeredUsers: event.registeredUsers,
                eventType: event.eventType,
                image: event.image
            }
        }));
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

function showEventDetails(event) {
    // Implement modal for event details
}

function showCreateEventModal(info) {
    // Implement modal for creating events
}

function isAdmin() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.isAdmin;
} 