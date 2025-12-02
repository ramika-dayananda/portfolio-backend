import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { connectDB } from './backend/config/db.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import contactsRouter from './backend/routes/contacts.js';
import projectsRouter from './backend/routes/projects.js';
import qualificationsRouter from './backend/routes/qualifications.js';
import usersRouter from './backend/routes/users.js';
import authRouter from './backend/routes/auth.js';
import adminRouter from './backend/routes/admin.js';

import { notFound, errorHandler } from './backend/middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ESM __dirname helper
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ensure uploads folder exists and serve it
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// connect to DB
await connectDB();

// middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// health check
app.get('/', (req, res) => {
  res.send('COMP229 Portfolio Backend is running ✅');
});

// routes
app.use('/api/contacts', contactsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/qualifications', qualificationsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
