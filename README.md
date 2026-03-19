# Task Manager Pro

A breathtaking, ultra-premium full-stack web application meticulously crafted for seamless task management. Features a fully immersive acrylic glassmorphism UI, real-time responsive animations, and a powerful Node.js + MongoDB backend.

## 🚀 Features

- **Full CRUD Capabilities:** Create, Read, Update, and Delete your tasks instantly.
- **Mark as Done:** Native task completion tracking via custom animated glowing checkboxes that update the database in real-time.
- **Staggered View:** Beautiful, responsive glass-card grid layout that stagger-loads seamlessly upon fetching.
- **Ultra-Premium UI/UX:** 
  - Surreal, animated ambient background gradient orbs.
  - Deep dark frosted glass containers (`backdrop-filter`) and elegant `Plus Jakarta Sans` typography.
  - Interactive hover states, neon glowing buttons, and dynamic floating form labels.
  - Smooth scale and fade animations when rendering or erasing tasks.
- **Toast Notifications:** Elegant, non-intrusive feedback toasts summarizing every API action.

## 🛠 Tech Stack

- **Frontend:** HTML5, Advanced CSS3 (Custom Variables, Transforms & Transitions), Vanilla JavaScript (Fetch API, DOM Injection).
- **Assets:** Plus Jakarta Sans Font Family & Phosphor Icons.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (via Mongoose).

## 📁 Project Structure

```text
todoapp/
├── public/                 # Ultra-premium Frontend static files (HTML, CSS, JS)
├── config/                 # Database connection configurations
├── controllers/            # Logic for handling API requests (Create, Read, Update, Delete)
├── models/                 # Mongoose database schemas (Todo Model with completed checks)
├── routes/                 # Express API routes
├── index.js                # Main server entrypoint (Serves API + Static Frontend)
├── package.json            # Node.js dependencies
└── .gitignore              # Ignored files for source control
```

## ⚙️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- MongoDB connection string (Local or via MongoDB Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mahadbashir1/Task-Manager-Pro.git
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
   - **Development mode** (with node monitor / hot reloading):
     ```bash
     npm run dev
     ```
   - **Production mode:**
     ```bash
     npm start
     ```

5. **Access the application:**
   Open your preferred browser and navigate to `http://localhost:3000` to interact with your stunning new workspace.
