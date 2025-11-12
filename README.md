# Efficia - Activity Tracking Dashboard

Efficia is a comprehensive activity tracking system that monitors your application usage in real-time and provides an interactive dashboard to visualize your daily productivity metrics.

## 📋 Project Overview

Efficia consists of three main components:

1. **Backend API** - FastAPI server that handles activity logging and data retrieval
2. **Frontend Dashboard** - React application for visualizing activity metrics
3. **Activity Tracker** - Python service that monitors active window and application usage

## 🏗️ Project Structure

```
new_project_efficia/
├── backend/                      # FastAPI backend server
│   ├── main.py                  # Main API endpoints
│   ├── db/
│   │   ├── db.py               # Database configuration
│   │   └── models.py           # SQLModel data models
│   └── __pycache__/            # Python cache files
├── tracker/                      # Activity tracking service
│   └── tracker.py              # Windows activity monitor
├── efficia-frontend/            # React frontend application
│   ├── package.json            # Frontend dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── public/                 # Static public assets
│   └── src/
│       ├── App.tsx             # Main React component
│       ├── index.tsx           # React entry point
│       ├── App.css             # App styles
│       └── components/
│           ├── dashboard.tsx   # Main dashboard component
│           ├── DailySummary.tsx
│           └── summary_chart.tsx
└── README.md                    # This file
```

## 🔧 Backend API

**Location:** `backend/main.py`

### Technologies Used
- **Framework:** FastAPI
- **Database:** SQLite with SQLModel ORM
- **Language:** Python

### Database Models

The backend uses SQLModel to define data structures:

- **ActivityLog** - Records individual application usage events
  - `id`: Primary key
  - `app_name`: Name of the active application
  - `window_title`: Window title of the active window
  - `duration`: Time spent (in seconds)
  - `timestamp`: When the activity occurred

- **Task** - Task management system
  - `id`: Primary key
  - `title`: Task description
  - `completed`: Status flag
  - `due_date`: Optional deadline

- **ChatHistory** - Chat interaction records
  - `id`: Primary key
  - `user_message`: User input
  - `bot_response`: Bot response
  - `timestamp`: When interaction occurred
  - `parent_id`: Parent conversation reference

### API Endpoints

#### POST `/activity`
Logs a new activity record.

**Request Body:**
```json
{
  "app_name": "string",
  "window_title": "string",
  "duration": 5,
  "timestamp": "2025-11-12T10:30:00"
}
```

**Response:**
```json
{
  "message": "Activity logged successfully"
}
```

#### GET `/activity`
Retrieves all activity logs in descending order by timestamp.

**Response:**
```json
[
  {
    "id": 1,
    "app_name": "Chrome",
    "window_title": "GitHub - sholuanuj/efficia",
    "duration": 5,
    "timestamp": "2025-11-12T10:30:00"
  },
  ...
]
```

#### GET `/daily-summary`
Gets aggregated activity summary for the current day grouped by application.

**Response:**
```json
[
  {
    "app_name": "Chrome",
    "total_time": 3600
  },
  {
    "app_name": "VS Code",
    "total_time": 7200
  },
  ...
]
```

### CORS Configuration
Currently allows all origins (`*`). **TODO:** Change to `["http://localhost:3000"]` for production.

## 📊 Frontend Dashboard

**Location:** `efficia-frontend/`

### Technologies Used
- **Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Build Tool:** React Scripts

### Components

#### Dashboard (`dashboard.tsx`)
The main dashboard component that:
- Fetches activity logs from the backend API
- Displays a daily summary table showing total time per application
- Shows a detailed activity logs table with all tracked activities
- Formats time display (e.g., "2 hrs 30 mins")

**Key Features:**
- Real-time data fetching from `/activity` endpoint
- Automatic aggregation of activities by application
- Responsive table layout with Tailwind CSS
- Formatted timestamps and duration calculations

### Available Scripts

```bash
# Start the development server (runs on localhost:3000)
npm start

# Build production bundle
npm build

# Run tests
npm test

# Eject configuration (one-way operation)
npm eject
```

## 🔍 Activity Tracker

**Location:** `tracker/tracker.py`

### Technologies Used
- **Libraries:** psutil, win32gui, win32process, requests
- **Platform:** Windows only

### Functionality

The tracker monitors:
1. **Active Window:** Continuously checks the foreground window
2. **Active Application:** Identifies the running process name
3. **Idle Time:** Detects user inactivity (60-second threshold)
4. **Activity Logging:** Sends data to the FastAPI backend every 5 seconds

### How It Works

```python
# Runs in an infinite loop every 5 seconds:
while True:
    app_name, window_title = get_active_window_app_name()
    idle_time = get_idle_duration()
    
    if idle_time < 60:  # Only log if user is active
        # Send activity data to backend
        requests.post(API_URL, json=data)
    
    time.sleep(5)
```

### Configuration
- **API Endpoint:** `http://127.0.0.1:8000/activity` (change in production)
- **Polling Interval:** 5 seconds
- **Idle Threshold:** 60 seconds
- **Duration Per Log:** 5 seconds

## 🚀 Getting Started

### Prerequisites
- Python 3.7+
- Node.js 14+
- npm or yarn

### Installation & Setup

#### 1. Backend Setup

```bash
# Navigate to project root
cd new_project_efficia

# Install Python dependencies
pip install fastapi uvicorn sqlmodel

# Start the FastAPI server
cd backend
uvicorn main:app --reload
```

The backend will run on `http://127.0.0.1:8000`

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd efficia-frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000`

#### 3. Activity Tracker Setup

```bash
# Install tracker dependencies
pip install psutil pywin32 requests

# Run the tracker
cd tracker
python tracker.py
```

## 📝 Dependencies

### Backend Dependencies
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `sqlmodel` - ORM for database
- `pydantic` - Data validation

### Frontend Dependencies
- `react` - UI library
- `react-dom` - React renderer
- `typescript` - Type safety
- `tailwindcss` - CSS framework
- `recharts` - Charting library

### Tracker Dependencies
- `psutil` - Process utilities
- `pywin32` - Windows API access
- `requests` - HTTP client

## 🔄 Data Flow

```
Activity Tracker (tracker.py)
    ↓ (polls every 5 seconds)
FastAPI Backend (main.py)
    ↓ (stores in SQLite)
Database (efficia.db)
    ↓ (fetches via API)
React Frontend (dashboard.tsx)
    ↓ (renders)
User Dashboard
```

## 📌 TODO / Future Improvements

1. **Security:** Change CORS to specific origin `["http://localhost:3000"]`
2. **Error Handling:** Improve error handling in tracker
3. **Persistence:** Ensure database persistence across restarts
4. **Charts:** Implement visualization charts using Recharts
5. **Authentication:** Add user authentication and authorization
6. **Categories:** Add application categorization
7. **Reports:** Generate weekly/monthly reports
8. **Alerts:** Alert on idle time or specific app usage

## 🐛 Known Issues

- API endpoint URL is hardcoded in both frontend and tracker (should use environment variables)
- CORS is open to all origins (security risk)
- No error handling for API failures in frontend

## 💡 Notes

- The project uses SQLite for simplicity; consider PostgreSQL for production
- Windows-specific tracker requires `pywin32` (only works on Windows)
- Cross-platform support would require alternative idle detection

## 📄 License

This project is part of the Efficia productivity tracking suite.

## 👤 Author

Created by: sholuanuj
Repository: [efficia](https://github.com/sholuanuj/efficia)
