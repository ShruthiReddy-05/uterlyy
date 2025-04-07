# 🌸 Uterly – Period Tracking & PCOS Detection App

**Uterly** is a comprehensive period tracking application designed to empower users with advanced cycle tracking, PCOS detection, AI-powered health insights, and a beautiful mobile-responsive interface.

---

## ✨ Features

- 📅 **Period & Cycle Tracking**  
- 🔍 **PCOS Detection** using Machine Learning  
- 💬 **AI Chatbot** for Personalized Health Insights  
- ⏰ **Customizable Reminders**  
- 📊 **Health Analytics & Insights**  
- 📱 **Mobile-Responsive Design**

---

## 🧰 Tech Stack

- **Frontend:** React + Vite + TypeScript  
- **Backend:** Express.js  
- **Database:** PostgreSQL + Drizzle ORM  
- **AI/ML:** TensorFlow.js, Google Gemini API  
- **Styling:** Tailwind CSS + shadcn/ui  

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/uterly.git
cd uterly
```

### 2. Install dependencies

```bash
# For the client
cd client
npm install

# For the server
cd ../server
npm install
```

### 3. Set up environment variables

Create a `.env` file in the `server/` directory or use Replit Secrets with the following:

```
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=your_postgresql_connection_string_here
```

### 4. Run the development server

```bash
# From the project root
npm run dev
```

The application will be available at **http://localhost:5000**  
Hot reloading is enabled for development.

---

## 📁 Project Structure

```
uterly/
├── client/        # React frontend
├── server/        # Express backend
├── shared/        # Shared types and schemas
├── models/        # ML models
└── uploads/       # Temporary file storage
```

---

## 🔗 API Endpoints

- `POST /api/period-logs` – Create and manage period logs  
- `GET /api/cycles` – Retrieve calculated cycle data  
- `POST /api/reminders` – Create and manage reminders  
- `POST /api/chat` – Get responses from the AI chatbot  

---

## 🗄️ Database Schema

- **users** – User information and authentication  
- **period_logs** – Period dates and symptoms  
- **cycles** – Calculated cycle patterns  
- **reminders** – Reminder settings and schedules  

---
