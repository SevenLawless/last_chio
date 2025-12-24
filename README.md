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

This app is configured for deployment on Railway as a monorepo (backend and frontend in a single service).

### Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- GitHub repository with your code

### Deployment Steps

1. **Create a new Railway project**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Add MySQL Database**
   - In your Railway project, click "New"
   - Select "Database" → "MySQL"
   - Railway will automatically create a MySQL service and provide connection details

3. **Configure Environment Variables**
   - In your Railway service, go to "Variables" tab
   - Add the following environment variables:
     ```
     JWT_SECRET=your-strong-secret-key-here
     NODE_ENV=production
     ```
   - Railway automatically provides:
     - `MYSQL_URL` or `DATABASE_URL` (from MySQL service)
     - `PORT` (automatically set)

4. **Run Database Migrations**
   - After first deployment, run migrations manually:
     - Go to Railway service → "Deployments" → Click on latest deployment
     - Open "Deploy Logs" → Click "Run Command"
     - Run: `cd backend && npm run migrate`
   - Or set up a deploy hook in Railway to run migrations automatically

5. **Deploy**
   - Railway will automatically detect the `railway.json` configuration
   - It will build both backend and frontend
   - The backend will serve the frontend static files
   - Your app will be available at the Railway-provided URL

### Railway Configuration

The `railway.json` file configures:
- **Build**: Installs dependencies and builds both backend and frontend
- **Start**: Runs the backend server which serves the frontend
- **Health Check**: Uses `/health` endpoint

### Environment Variables Reference

See `backend/.env.example` for all available environment variables.

**Required:**
- `JWT_SECRET` - Secret key for JWT token signing (must be set)
- `MYSQL_URL` or `DATABASE_URL` - Provided by Railway MySQL service
- `PORT` - Provided automatically by Railway

**Optional:**
- `FRONTEND_URL` - Frontend URL for CORS (only needed if deploying separately)
- `NODE_ENV` - Set to `production` for production deployment

### Separate Frontend/Backend Deployment (Optional)

If you want to deploy frontend and backend separately:

1. **Backend Service:**
   - Set `FRONTEND_URL` to your frontend URL
   - CORS will allow requests from that URL

2. **Frontend Service:**
   - Set `VITE_API_URL` to your backend API URL
   - Build will use that URL for API calls

### Troubleshooting

- **Database connection issues**: Verify `MYSQL_URL` is set correctly from MySQL service
- **Migrations not running**: Run manually via Railway CLI or deploy hook
- **Static files not serving**: Ensure `NODE_ENV=production` is set
- **CORS errors**: Set `FRONTEND_URL` if deploying separately

### Health Check

The app includes a health check endpoint at `/health` that:
- Returns server status
- Checks database connectivity
- Returns appropriate HTTP status codes

Railway uses this for service health monitoring.

## Color Palette

base background —  (#C4DDE0) chibi
primary color —  (#5A9AA8) blu
surface/cards —  (#F5E6D3) light orange
accent —  (#D4A574) less light orange