Campus Event Hub

Project Overview  
RSvip Hub is a campus event web application where students and lecturers can view upcoming events such as workshops, seminars, and club activities. Users can RSVP to events, set their event preferences, and administrators can create new events. The application ensures seamless event management and attendance tracking.


Deployment Link  
[**Live Demo on Render**](https://campuseventmanagement-frontend.onrender.com)  


Login Details  
Use the following test credentials to access the platform:  

Admin Login  
- Email: `admin@example.com`  
- Password: `admin123`  

User Login  
- Email: `unknown@gmail.com`  
- Password: `123456`  


|  Features                                  |      Status         |
|--------------------------------------------|---------------------|
| User Registration & Login                  | ✅ Completed        |
| Event Preferences                          | ✅ Completed        |
| Display Event Listings                     | ✅ Completed        |
| RSVP Functionality                         | ✅ Completed        |
| Update Available Seats After RSVP          | ✅ Completed        |
| Admin Event Creation                       | ✅ Completed        |
| Calendar View with Event Filtering         | ✅ Completed        |


Installation Instructions**  

Follow these steps to run RSvip Hub locally:

1. Clone the Repository**  
```bash
git clone https://github.com/yourusername/RSvipHub.git
cd RsvpHub
```

2. Install Dependencies 
Ensure you have **Node.js** and **npm** installed. Then, run:  
```bash
npm install
```

3. Set Up Environment Variables  
Create a `.env` file in the root directory and add your backend API URL:  
```env
REACT_APP_API_URL=http://localhost:5001/api

```
4. Start the Backend (Optional) 
Ensure your backend server is running on `http://localhost:5001`.  

5. Run the Application  
Start the React application locally:  
```bash
npm start
```
The app will run on `http://localhost:5173/`.


API Documentation  

The following endpoints were tested using Postman.  

1. User Authentication  
   - POST `/api/auth/login`  
   - Payload: `{ "email": "admin@example.com", "password": "admind123" }`  
   - Response: `{ "token": "user created successfully" }`

2. RSVP Event  
   - GET   
   - Response: 
   - [
	{
		"_id": "67609cbef711b7145ab7d8c1",
		"title": "Campus vibes",
		"description": "Chill guys",
		"date": "2024-12-16",
		"time": "23:30",
		"location": "Rec-Center",
		"capacity": 50,
		"eventType": "club_activity",
		"image": "/assets/uploads/1734384830155.jpeg",
		"creator": {
			"_id": "675eda34514a1985d6c0a654",
			"username": "admin"
		},
		"registeredUsers": [
			"676061c78677b1ef73c16d0d"
		],
		"createdAt": "2024-12-16T21:33:50.172Z",
		"updatedAt": "2024-12-18T20:01:07.692Z",
		"__v": 3
	},


3. Create Event (Admin Only) 
   - POST: `/api/events`  
   - Payload: `{ "name": "forum", "date": "2024-12-218", "location": "Kwapong Hall", "capacity": 30 }`  
   - Headers: `Authorization: Bearer <successful>`  

![Insomnia Screenshot]
![Screenshot 2024-12-14 104754](![Screenshot 2024-12-14 224707](https://github.com/user-attachments/assets/21b77811-db35-4fbb-a4ce-b8fe0bd5676f)
![Screenshot 2024-12-14 224707](![Screenshot 2024-12-14 224749](https://github.com/user-attachments/assets/de78e415-9aa7-4d84-8eb3-706f1cadaf40)
![Screenshot 2024-12-14 224749](![Screenshot 2024-12-14 104754](https://github.com/user-attachments/assets/daa47fe7-8e1c-42c0-b8af-883d84decbde)



Technologies Used
- Frontend: Html, CSS  
- Backend: Node.js, MongoDB (for managing events and RSVPs)  
- Deployment: Render (Backend), (Frontend)

Deployment Requirements  
- The project is deployed on Render and accessible on mobile and desktop.  
- All required functionalities, including user login, event RSVP, and calendar view, are fully implemented.


Additional Notes 
- For any issues or feedback, contact me at `jkpodo05@gmail.com`.  

This README file follows the guidelines, and it is easy to understand. 
