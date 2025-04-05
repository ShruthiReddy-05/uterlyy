Uterly - Period Tracking & PCOS Detection App
A comprehensive period tracking application with PCOS detection capabilities, built with React, Express, and TensorFlow.js.

Features
- 📅 Period & Cycle Tracking
- 🔍 PCOS Detection using Machine Learning
- 💬 AI Chatbot for Health Insights
- ⏰ Customizable Reminders
- 📊 Health Analytics & Insights
- 📱 Mobile-Responsive Design

Tech Stack
- Frontend: React + Vite + TypeScript
- Backend: Express.js
- Database: PostgreSQL with Drizzle ORM
- AI/ML: TensorFlow.js, Google Gemini API
- Styling: Tailwind CSS + shadcn/ui

Getting Started
1. Click the "Run" button to start the development server
2. The application will be available at port 5000
3. Hot reloading is enabled for development

Project Structure

```
├── client/        # React frontend
├── server/        # Express backend
├── shared/        # Shared types and schemas
├── models/        # ML models
└── uploads/       # Temporary file storage
```

Environment Variables

Required environment variables (set via Replit Secrets):
- GEMINI_API_KEY: For AI chatbot functionality
- DATABASE_URL: PostgreSQL connection string

API Routes

- `/api/period-logs`: Period logging endpoints
- `/api/cycles`: Menstrual cycle management
- `/api/reminders`: Reminder system
- `/api/chat`: AI chatbot interactions

Database Schema

- users: User management
- period_logs: Period tracking data
- cycles: Cycle calculations
- reminders: User reminders

