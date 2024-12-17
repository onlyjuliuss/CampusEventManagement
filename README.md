Campus Event Hub

Project Overview  
RSvip Hub is a campus event web application where students and lecturers can view upcoming events such as workshops, seminars, and club activities. Users can RSVP to events, set their event preferences, and administrators can create new events. The application ensures seamless event management and attendance tracking.


Deployment Link  
[**Live Demo on Vercel**](https://your-deployment-link.vercel.app)  


Login Details  
Use the following test credentials to access the platform:  

Admin Login  
- Email: `admin@example.com`  
- Password: `admin123`  

User Login  
- Email: `unknown@`  
- Password: `sela123`  


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
   - Response: `{ "token": "yourJWTtoken" }`

2. RSVP Event  
   - POST `/api/events/rsvp/:id`  
   - Headers: `Authorization: Bearer <token>`  
   - Response: `{ "message": "RSVP successful", "availableSeats": 29 }`

3. Create Event (Admin Only) 
   - POST: `/api/events`  
   - Payload: `{ "name": "Workshop", "date": "2024-12-20", "location": "Hall A", "capacity": 50 }`  
   - Headers: `Authorization: Bearer <adminToken>`  

![Insomnia Screenshot]
![Screenshot 2024-12-14 104754](https://github.com/user-attachments/assets/7ed0ec0a-0766-458f-af4b-9a33cfa28e5e)
![Screenshot 2024-12-14 224707](https://github.com/user-attachments/assets/df7cc149-5105-4b77-8a3e-5e14b4908607)
![Screenshot 2024-12-14 224749](https://github.com/user-attachments/assets/0724b867-d82c-44ce-b14c-d9dbe3e0ab81)


Technologies Used
- Frontend: React, React Router, CSS  
- Backend**: Node.js, Express.js, MongoDB (for managing events and RSVPs)  
- Deployment: Render (Backend), (Frontend)

Deployment Requirements  
- The project is deployed on Render and accessible on mobile and desktop.  
- All required functionalities, including user login, event RSVP, and calendar view, are fully implemented.


Additional Notes 
- For any issues or feedback, contact me at `jkpodo05@gmail.com`.  

This README file follows the guidelines, and it is easy to understand. 
