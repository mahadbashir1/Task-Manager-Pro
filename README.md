# Task Manager Pro

A sleek, responsive, and modern full-stack web application designed for effortless task management.

## 🚀 Features

- **Create Tasks:** Quickly jot down tasks with titles and detailed descriptions.
- **View Tasks:** Beautiful, responsive grid layout for browsing all tasks.
- **Edit Tasks:** Seamlessly modify tasks that need an update.
- **Sleek UI:** Smooth animations, glassmorphism aesthetics, and a modern custom color palette.
- **Toast Notifications:** Real-time feedback for all user actions.

## 🛠 Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (via Mongoose).

## 📁 Project Structure

```text
todoapp/
├── public/                 # Frontend static files (HTML, CSS, JS)
├── config/                 # Database connection configurations
├── controllers/            # Logic for handling API requests
├── models/                 # Mongoose database schemas
├── routes/                 # Express API routes
├── index.js                # Main server entrypoint
├── package.json            # Node.js dependencies
└── .gitignore              # Ignored files for source control
```

## ⚙️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/)
- MongoDB (Local or Atlas connection string)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd todoapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of your project and configure your variables:
   ```env
   PORT=3000
   DATABASE_URL=your_mongodb_connection_string
   ```

4. **Run the application:**
   - **Development mode** (with hot reloading):
     ```bash
     npm run dev
     ```
   - **Production mode:**
     ```bash
     npm start
     ```

5. **Access the application:**
   Open your preferred browser and navigate to `http://localhost:3000`.
