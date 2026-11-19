import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB, getDBStatus } from './config/db.js';
import {
    conciergeChat,
    dynamicReplan,
    generatePlan,
    optimizeBudget,
    regenerateSection
} from './controllers/aiController.js';
import { demoLogin, getMe, googleAuth, login, register } from './controllers/authController.js';
import {
    createEvent,
    deleteEvent,
    getEventById,
    getEvents,
    restorePlanVersion,
    updateEvent
} from './controllers/eventController.js';
import { createExpense, deleteExpense, getExpenses, updateExpense } from './controllers/expenseController.js';
import { batchImportGuests, createGuest, deleteGuest, getGuests, updateGuest } from './controllers/guestController.js';
import { applyMoodboardToEvent, createMoodboard, getMoodboards } from './controllers/moodboardController.js';
import { createTask, deleteTask, getTasks, updateTask } from './controllers/taskController.js';
import { bookVendor, getVendors } from './controllers/vendorController.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Non-browser clients may omit Origin; browser origins must be explicitly trusted.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health & Config Status Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'MOMENZA',
    tagline: 'Make Every Moment Matter.',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/config/status', (req, res) => {
  res.json({
    success: true,
    ...getDBStatus()
  });
});

// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/google', googleAuth);
app.post('/api/auth/demo', demoLogin);
app.get('/api/auth/me', authMiddleware, getMe);

// AI Planning Routes (can be accessed with or without auth for instant trial)
app.post('/api/ai/generate-plan', generatePlan);
app.post('/api/ai/dynamic-replan', dynamicReplan);
app.post('/api/ai/optimize-budget', optimizeBudget);
app.post('/api/ai/concierge-chat', conciergeChat);
app.post('/api/ai/regenerate-section', regenerateSection);

// Event Routes (Protected)
app.get('/api/events', authMiddleware, getEvents);
app.post('/api/events', authMiddleware, createEvent);
app.get('/api/events/:id', authMiddleware, getEventById);
app.put('/api/events/:id', authMiddleware, updateEvent);
app.delete('/api/events/:id', authMiddleware, deleteEvent);
app.post('/api/events/:id/restore-version', authMiddleware, restorePlanVersion);

// Expense Routes (Protected)
app.get('/api/expenses', authMiddleware, getExpenses);
app.post('/api/expenses', authMiddleware, createExpense);
app.put('/api/expenses/:id', authMiddleware, updateExpense);
app.delete('/api/expenses/:id', authMiddleware, deleteExpense);

// Task Routes (Protected)
app.get('/api/tasks', authMiddleware, getTasks);
app.post('/api/tasks', authMiddleware, createTask);
app.put('/api/tasks/:id', authMiddleware, updateTask);
app.delete('/api/tasks/:id', authMiddleware, deleteTask);

// Guest Routes (Protected)
app.get('/api/guests', authMiddleware, getGuests);
app.post('/api/guests', authMiddleware, createGuest);
app.put('/api/guests/:id', authMiddleware, updateGuest);
app.delete('/api/guests/:id', authMiddleware, deleteGuest);
app.post('/api/guests/batch', authMiddleware, batchImportGuests);

// Vendor Routes
app.get('/api/vendors', getVendors);
app.post('/api/vendors/book', authMiddleware, bookVendor);

// Moodboard Routes
app.get('/api/moodboards', getMoodboards);
app.post('/api/moodboards', authMiddleware, createMoodboard);
app.post('/api/moodboards/apply', authMiddleware, applyMoodboardToEvent);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'An unexpected error occurred on MOMENZA backend.'
  });
});

// Connect to DB and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✨ MOMENZA Server running on http://localhost:${PORT}`);
    console.log(`🏷️ Tagline: Make Every Moment Matter.`);
  });
});
