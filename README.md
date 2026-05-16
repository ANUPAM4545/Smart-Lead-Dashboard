# Smart Leads Dashboard

A high-performance, full-stack Lead Management Dashboard built using the **MERN stack** (MongoDB, Express, React, Node.js) with clean architecture, scalable code practices, and a professional user experience. This project was developed as a MERN Internship Assignment.

## 🚀 Key Features

*   **Advanced Authentication**: 
    *   Secure JWT-based login and registration.
    *   **Google OAuth 2.0 Integration**: One-tap sign-in with Google.
    *   Role-Based Access Control (RBAC): Differentiates between **Admin** and **Sales User**.
*   **Lead Management (CRUD)**: 
    *   Complete lifecycle management of leads (Create, Read, Update, Delete).
    *   Admin-only delete privileges.
*   **Intelligent Data Handling**:
    *   **Server-side Pagination**: Efficiently handles large datasets (10 per page).
    *   **Debounced Search**: Real-time search by name or email with optimized API calls.
    *   **Multi-column Filtering**: Filter leads by Status (New, Contacted, etc.) and Source.
    *   **Dynamic Sorting**: Toggle between Latest and Oldest records.
*   **CSV Export**: Admin-exclusive feature to export filtered data to CSV using `@fast-csv/format`.
*   **Premium UI/UX**: 
    *   Designed with **Tailwind CSS v4**.
    *   Glassmorphic aesthetics with smooth transitions.
    *   Full **Dark Mode** support.
    *   **Collapsible Sidebar** for optimized workspace view.
    *   Mobile-responsive layouts.

## 🛠️ Tech Stack

*   **Frontend**: React.js (v19), TypeScript, Vite, Tailwind CSS v4, React Query, Zustand, React Hook Form, Zod.
*   **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose, Zod, Google Auth Library.
*   **Infrastructure**: Docker, Docker Compose.

## 📦 Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   MongoDB (v6.0+)
*   Docker (Optional for containerized run)

### 1. Environment Configuration

Create a `.env` file in the `backend` directory:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/smart-leads
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 2. Running Locally

**Backend**:
```bash
cd backend
npm install
npm run dev
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```
Visit: `http://localhost:5173`

### 3. Running with Docker
```bash
docker-compose up --build -d
```
*   **Frontend**: `http://localhost:80`
*   **Backend API**: `http://localhost:5001/api`

## 🛣️ API Endpoints

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | Public | Register a new account |
| `/api/auth/login` | POST | Public | Standard login |
| `/api/auth/google` | POST | Public | Google OAuth login/register |
| `/api/auth/me` | GET | Private | Get authenticated user info |
| `/api/leads` | GET | Private | List leads (Pagination/Filter/Search) |
| `/api/leads/:id` | GET | Private | Get specific lead details |
| `/api/leads` | POST | Private | Create a new lead |
| `/api/leads/:id` | PUT | Private | Update lead status/info |
| `/api/leads/:id` | DELETE | Admin | Remove a lead from system |
| `/api/leads/export/csv` | GET | Admin | Download current leads as CSV |

## ✨ Design Principles Followed
*   **Type Safety**: End-to-end TypeScript implementation with zero `any` usage in core logic.
*   **Validation**: Unified validation schemas using **Zod** shared across the stack.
*   **State Management**: Lightweight state with **Zustand** and robust server-state with **React Query**.
*   **Performance**: Implemented debouncing for search and server-side pagination to ensure scalability.

---

