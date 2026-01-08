# Bus Ticket Booking System - MERN Stack

A full-stack bus ticket booking application built with MongoDB, Express, React, and Node.js. Features separate user and admin interfaces with role-based access control.

## Features

### User Features
- User registration and authentication
- Browse available buses
- View bus details with seat map
- Book available seats
- View booking history (My Tickets)
- Cancel bookings

### Admin Features
- Admin authentication
- Create new buses with custom seat layouts
- View all bookings (Sales Report)
- Reset buses (clear all bookings)

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- **Frontend**: React, React Router, Axios
- **Database**: MongoDB

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory with the following variables:
```env
MONGO_URI=mongodb://localhost:27017/bus-ticket-booking
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d
PORT=5001
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_BASE_URL=http://localhost:5001/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Creating an Admin Account

To create an admin account, you can use one of the following methods:

### Method 1: Using MongoDB Compass or MongoDB Shell

1. Connect to your MongoDB database
2. Navigate to the `users` collection
3. Insert a new document with admin role:
```javascript
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "$2a$10$...", // Use bcrypt to hash your password
  "role": "admin"
}
```

### Method 2: Using Postman or API Client

Make a POST request to `http://localhost:5001/api/auth/admin/signup`:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Note**: In production, admin signup should be restricted. For now, it's available for testing purposes.

## API Routes

### Authentication
- `POST /api/auth/user/signup` - User registration
- `POST /api/auth/user/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/admin/signup` - Admin registration (for testing)

### User Routes (Protected)
- `GET /api/user/buses` - Get all buses
- `GET /api/user/buses/:busId` - Get bus details with seat map
- `POST /api/user/bookings/book` - Book a seat
- `GET /api/user/bookings/my` - Get user's bookings
- `PATCH /api/user/bookings/cancel/:bookingId` - Cancel a booking

### Admin Routes (Protected)
- `POST /api/admin/buses` - Create a new bus
- `PATCH /api/admin/buses/reset/:busId` - Reset a bus (clear all bookings)
- `GET /api/admin/reports/bookings` - Get all bookings

## Project Structure

```
bus-ticket-booking/
├── backend/
│   ├── config/          # Database, JWT, roles configuration
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Auth, role, error middlewares
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── frontend/
│   ├── src/
│   │   ├── api/         # API service functions
│   │   ├── auth/        # Route protection components
│   │   ├── context/     # React context (AuthContext)
│   │   ├── pages/       # Page components
│   │   └── App.js       # Main app component
│   └── public/          # Static files
└── README.md
```

## Key Features Implementation

- **Authentication**: JWT-based authentication with separate flows for users and admins
- **Authorization**: Role-based access control (RBAC) using middleware
- **Password Security**: bcrypt password hashing
- **Error Handling**: Centralized error handling middleware
- **Data Models**: User, Bus, and Booking models with proper relationships

## Testing the Application

1. **User Flow**:
   - Sign up as a user
   - Login
   - Browse buses
   - View bus details and seat map
   - Book a seat
   - View "My Tickets"
   - Cancel a booking

2. **Admin Flow**:
   - Login as admin
   - Create a new bus
   - View sales report (all bookings)
   - Reset a bus

## Notes

- Ensure MongoDB is running before starting the backend
- All API routes require authentication except auth endpoints
- Admin routes require admin role
- User routes require user role
- Tokens are stored in localStorage
- Passwords are hashed using bcrypt

## License

This project is created for evaluation purposes.
