# TODO - Run RentRide

## Step 1: Check prerequisites
- Verify Docker is installed and running (Docker Desktop)

## Step 2: Create server env file
- Create `server/.env` from `server/.env.example`
- Ensure required vars are set: `JWT_SECRET`, `CLOUDINARY_*`, `MONGO_URI`, `CLIENT_URL` (or rely on docker-compose env)

## Step 3: Run with Docker Compose
- `docker-compose up --build`

## Step 4: Verify services
- Health check: `GET http://localhost:5000/api/health`
- App: open `http://localhost:5173`

## Step 5: First-run admin/customer (if needed)
- Confirm auto-seed created demo users/vehicles; if not, run `npm run seed` inside server container or locally

