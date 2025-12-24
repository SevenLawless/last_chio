# Railway Deployment Guide for Beginners

This guide will walk you through deploying the Task Management App to Railway, step by step. We'll deploy the backend and frontend as separate services.

## Prerequisites

Before you begin, make sure you have:
- A GitHub account
- Your code pushed to a GitHub repository
- A Railway account (sign up at [railway.app](https://railway.app) - it's free!)

## Step 1: Create a Railway Account and Project

1. Go to [railway.app](https://railway.app) and sign up (you can use your GitHub account)
2. Once logged in, click the **"New Project"** button
3. Select **"Deploy from GitHub repo"**
4. Choose your repository from the list
5. Railway will create a new project for you

## Step 2: Add MySQL Database

1. In your Railway project dashboard, click the **"+ New"** button
2. Select **"Database"** → **"Add MySQL"**
3. Railway will automatically create a MySQL database service
4. **Important**: Note the service name (e.g., "MySQL") - you'll need it later

The database is now ready! Railway automatically provides connection details through environment variables.

### 2.1 Initialize Database Schema

**Important**: Before the backend can work, you need to create the database tables. Since this is a clean slate, you'll run the schema once:

**Option 1: Using Railway's MySQL Query Interface**
1. In your Railway project, find your **MySQL service**
2. Click on it → Go to **"Data"** or **"Connect"** tab
3. If available, click **"Query"** to open the SQL query interface
4. Copy the entire contents of `backend/src/migrations/001_initial_schema.sql` from your repository
5. Paste and execute the SQL script to create all tables

**Option 2: Using Migration Script (After Backend Deployment)**
1. After deploying the backend (Step 3), go to backend service → **"Deployments"** → Latest deployment
2. Click **"Run Command"** or open the terminal
3. Run: `npm run migrate`
4. This will execute the migration script to create all tables

**Option 3: Using Railway CLI (Advanced)**
If you have Railway CLI installed, you can connect and run the SQL directly.

## Step 3: Deploy the Backend Service

### 3.1 Create Backend Service

1. In your Railway project, click **"+ New"** again
2. Select **"GitHub Repo"** and choose your repository
3. Railway will detect it as a new service

### 3.2 Configure Backend Service

1. Click on the newly created service (it might be named after your repo)
2. Click on the **"Settings"** tab
3. Find **"Root Directory"** and set it to: `backend`
4. Find **"Build Command"** and set it to: `npm install && npm run build`
5. Find **"Start Command"** and set it to: `npm start`

### 3.3 Set Backend Environment Variables

1. Still in the backend service, go to the **"Variables"** tab
2. Click **"+ New Variable"** and add these variables one by one:

   **Required Variables:**
   - `JWT_SECRET` = `your-very-secret-key-here-change-this` (use a long random string)
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = (we'll set this after deploying the frontend - leave empty for now)

   **Database Connection (Automatic):**
   - Railway automatically provides `MYSQL_URL` from the MySQL service
   - You don't need to set this manually!

3. Click **"Deploy"** or wait for Railway to auto-deploy

### 3.4 Get Backend URL

1. Once deployed, go to the **"Settings"** tab
2. Find **"Generate Domain"** and click it
3. Copy the generated URL (e.g., `https://your-backend-name.up.railway.app`)
4. **Save this URL** - you'll need it for the frontend!

## Step 4: Deploy the Frontend Service

### 4.1 Create Frontend Service

1. In your Railway project, click **"+ New"** again
2. Select **"GitHub Repo"** and choose your repository (same repo as backend)
3. This creates a second service

### 4.2 Configure Frontend Service

1. Click on the newly created frontend service
2. Go to **"Settings"** tab
3. Set **"Root Directory"** to: `frontend`
4. Set **"Build Command"** to: `npm install && npm run build`
5. Set **"Start Command"** to: `npx serve -s dist -l $PORT`

### 4.3 Set Frontend Environment Variables

1. Go to the **"Variables"** tab
2. Add this variable:
   - `VITE_API_URL` = `https://your-backend-name.up.railway.app/api`
     (Replace with your actual backend URL from Step 3.4, and add `/api` at the end)

3. Click **"Deploy"** or wait for auto-deploy

### 4.4 Get Frontend URL

1. Once deployed, go to **"Settings"** tab
2. Click **"Generate Domain"**
3. Copy the frontend URL (e.g., `https://your-frontend-name.up.railway.app`)
4. **Save this URL** - this is your app!

## Step 5: Connect Backend and Frontend

Now we need to tell the backend where the frontend is located:

1. Go back to your **backend service**
2. Go to **"Variables"** tab
3. Find `FRONTEND_URL` and update it with your frontend URL from Step 4.4
4. Railway will automatically redeploy when you save

## Step 6: Test Your Deployment

1. Open your frontend URL in a browser
2. You should see the login page
3. Try creating an account and logging in
4. If everything works, congratulations! 🎉

## Troubleshooting

### Backend won't start

- **Check logs**: Click on your backend service → "Deployments" → Click latest deployment → "View Logs"
- **Common issues**:
  - Missing `JWT_SECRET` - make sure it's set in Variables
  - Database connection error - make sure MySQL service is running
  - Wrong root directory - should be `backend`

### Frontend shows errors or can't connect to backend

- **Check environment variables**: Make sure `VITE_API_URL` is set correctly
- **CORS errors**: Make sure `FRONTEND_URL` in backend matches your frontend URL exactly
- **Check browser console**: Open browser DevTools (F12) → Console tab to see errors

### Database connection issues

- **Check MySQL service**: Make sure the MySQL service is running (green status)
- **Check MYSQL_URL**: Railway should provide this automatically, but verify it exists in backend Variables
- **Tables don't exist**: If you see errors about missing tables, make sure you've run the database schema initialization (Step 2.1). The error will typically say "Table 'users' doesn't exist" or similar.

### Build fails

- **Check logs**: Always check the deployment logs for specific error messages
- **Node version**: Railway should auto-detect Node.js version, but you can specify it in `package.json` if needed
- **Dependencies**: Make sure all dependencies are listed in `package.json`

## Environment Variables Reference

### Backend Service Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `JWT_SECRET` | ✅ Yes | Secret key for JWT tokens | `my-super-secret-key-123` |
| `NODE_ENV` | ✅ Yes | Environment mode | `production` |
| `FRONTEND_URL` | ✅ Yes | Frontend service URL | `https://your-app.up.railway.app` |
| `MYSQL_URL` | ✅ Auto | Database connection (provided by Railway) | Auto-set |

### Frontend Service Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ Yes | Backend API URL | `https://your-backend.up.railway.app/api` |

## Important Notes

- **No migrations needed**: The database will be created fresh on first use
- **Separate services**: Backend and frontend are independent - you can update one without affecting the other
- **Auto-deploy**: Railway automatically deploys when you push to GitHub (if connected)
- **Free tier**: Railway's free tier is generous, but check their limits

## Next Steps

- Set up a custom domain (optional)
- Enable monitoring and alerts
- Set up CI/CD for automatic deployments
- Configure backups for your database

## Getting Help

If you run into issues:
1. Check the Railway documentation: [docs.railway.app](https://docs.railway.app)
2. Check the deployment logs in Railway dashboard
3. Verify all environment variables are set correctly
4. Make sure both services are running (green status)

Good luck with your deployment! 🚀

