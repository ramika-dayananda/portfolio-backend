# MyPortfolio Backend (COMP229 Assignment 2)

## Quick Start
1. Copy `.env.example` to `.env` and set your `MONGO_URI` (Atlas) and `JWT_SECRET`.
2. Install deps:
   ```bash
   npm i
   npm run dev
   ```
3. Health check: open http://localhost:5000 — you should see **"COMP229 Portfolio Backend is running ✅"**.
4. Test APIs using **Thunder Client** (collection included) or `backend/tests/requests.http`.

## Endpoints
- Contacts: `/api/contacts` (GET, POST, DELETE all) and `/api/contacts/:id` (GET, PUT, DELETE)
- Projects: `/api/projects` and `/api/projects/:id`
- Qualifications: `/api/qualifications` and `/api/qualifications/:id`
- Users CRUD: `/api/users` and `/api/users/:id`
- Auth (JWT): `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` (protected)

## Screenshots to Capture (for submission)
- **MongoDB Atlas**: DB **Portfolio**, collections (contacts, projects, qualifications, users) + your **connection string** (mask password).
- **Console**: "MongoDB connected: ..." message.
- **Browser**: `http://localhost:5000` showing the running message.
- **Thunder/Postman**: Successful CRUD for each resource + Auth workflow.

## Run client & server together (optional)
In `client/package.json`:
```json
"dev": "concurrently 'vite' \"nodemon ../server.js\""
```
Run from `client/`: `npm run dev`
