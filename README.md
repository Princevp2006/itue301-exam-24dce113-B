# Library Book Management System

An exam project for managing college library books, members, and borrowings.

---

## Technical Stack
- **Frontend**: React, Vite
- **Backend**: Express.js
- **Database**: MongoDB with Mongoose

---

## 1. MongoDB Setup
The application connects to a MongoDB database using Mongoose.
1. Ensure you have MongoDB installed and running on your system (defaulting to `mongodb://127.0.0.1:27017`).
2. Alternatively, you can use a remote MongoDB Atlas URI.
3. The server will auto-seed initial books, members, and borrowing transaction logs on startup if the database is empty.

---

## 2. Required Environment Variables
The backend configuration depends on environment variables. Create a `.env` file inside the `backend/` directory:
```ini
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/library_exam
```
- `PORT`: The port number the Express server runs on.
- `MONGO_URI`: The MongoDB connection string (Mongoose uses this to connect).

*Note: An `.env.example` file is committed to git as a template, but the `.env` containing your actual connection URI is ignored by git.*

---

## 3. Frontend Setup & Run Commands
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install the React and bundler dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *(Runs locally at `http://localhost:5173/`)*

---

## 4. Backend Setup & Run Commands
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Configure the `.env` variables as described in Section 2.
3. Install the Express and Mongoose dependencies:
   ```bash
   npm install
   ```
4. Start the Express server:
   ```bash
   npm start
   ```
   *(The server runs at `http://localhost:5000/`)*
