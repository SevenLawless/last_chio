# Daily Task Management App

A two-panel daily task management application with mission/sub-task hierarchy, categories, and selected tasks system.

## Features

- **Authentication**: Username/password registration and login with JWT tokens
- **Task Hierarchy**: Missions (top-level tasks) with sub-tasks
- **Categories**: User-defined categories with custom names and colors
- **Task States**: NOT_STARTED (default) and COMPLETED
- **Auto-completion**: When all sub-tasks are completed, parent mission auto-completes
- **Selected Tasks**: Focus on specific sub-tasks in the right panel
- **Daily Reset**: All selected tasks reset to NOT_STARTED at 5am UTC
- **Drag-and-drop**: Reorder tasks and selected tasks
- **Soft Delete**: Tasks can be cancelled but not permanently deleted for DAILY tasks

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Styled Components
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL
- **Authentication**: JWT tokens

## Setup

### Prerequisites

- Node.js 18+
- MySQL 8+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_manager
JWT_SECRET=your-secret-key-change-this-in-production
PORT=3001
```

4. Create the database and run migrations:
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS task_manager;"

# Run migration
mysql -u root -p task_manager < src/migrations/001_initial_schema.sql
```

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` and will proxy API requests to the backend at `http://localhost:3001`.

## Project Structure

```
chio3/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── migrations/      # Database migrations
│   │   ├── models/          # Data models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── utils/          # Utilities (JWT, cron jobs)
│   │   └── server.ts       # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/        # React contexts
│   │   ├── services/       # API services
│   │   ├── styles/         # Theme and global styles
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Design System

The app uses the Luxterra branding design system:
- **Colors**: Dark theme with #0000EE accent color
- **Typography**: Inter Variable font family
- **Spacing**: 4px base unit
- **Border Radius**: 2px

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Categories
- `GET /api/categories` - Get user's categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Missions
- `GET /api/missions` - Get all missions with tasks
- `POST /api/missions` - Create mission
- `PUT /api/missions/:id` - Update mission
- `DELETE /api/missions/:id` - Cancel mission

### Tasks
- `POST /api/missions/:missionId/tasks` - Create sub-task
- `PUT /api/missions/tasks/:id` - Update task
- `DELETE /api/missions/tasks/:id` - Cancel task

### Selected Tasks
- `GET /api/selected-tasks` - Get selected tasks
- `POST /api/selected-tasks` - Add task to selected
- `DELETE /api/selected-tasks/:id` - Remove from selected
- `PUT /api/selected-tasks/reorder` - Reorder selected tasks

## Daily Reset

The system automatically resets all selected tasks to NOT_STARTED state at 5am UTC every day using a cron job.

## Railway Deployment

This app is configured for deployment on Railway as **separate services** (backend and frontend deployed independently).

### Quick Start

For detailed step-by-step instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)** - a beginner-friendly guide with screenshots and troubleshooting.

### Architecture

- **Backend Service**: Node.js/Express API server
- **Frontend Service**: React static site served via `serve`
- **Database Service**: Railway MySQL (automatically connected)

### Environment Variables

**Backend Service:**
- `JWT_SECRET` (required) - Secret key for JWT tokens
- `NODE_ENV` (required) - Set to `production`
- `FRONTEND_URL` (required) - Your frontend service URL
- `MYSQL_URL` (automatic) - Provided by Railway MySQL service

**Frontend Service:**
- `VITE_API_URL` (required) - Your backend API URL (e.g., `https://your-backend.up.railway.app/api`)

### Health Check

The backend includes a health check endpoint at `/health` that:
- Returns server status
- Checks database connectivity
- Returns appropriate HTTP status codes

Railway uses this for service health monitoring.

### No Migrations Needed

The database schema is created automatically on first use. No manual migrations required!

## Color Palette

base background —  (#C4DDE0) chibi
primary color —  (#5A9AA8) blu
surface/cards —  (#F5E6D3) light orange
accent —  (#D4A574) less light orange