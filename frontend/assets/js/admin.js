// Check if user is admin
const user = JSON.parse(localStorage.getItem('user'));
if (!user || !user.isAdmin) {
    window.location.href = '../login.html';
}

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '../dashboard.html';
});

// Add image preview functionality
document.getElementById('image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        }
        reader.readAsDataURL(file);
    }
});

// Update the form submission to include image
document.getElementById('createEventForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('date', document.getElementById('date').value);
    formData.append('time', document.getElementById('time').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('capacity', document.getElementById('capacity').value);
    formData.append('eventType', document.getElementById('eventType').value);
    formData.append('image', document.getElementById('image').files[0]);

    try {
        const response = await fetch('https://campuseventmanagement-backend.onrender.com/api/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`
            },
            body: formData
        });

        if (response.ok) {
            alert('Event created successfully!');
            window.location.href = '../dashboard.html';
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        alert('Error creating event');
    }
}); 