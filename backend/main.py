from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine, Session
from db.models import ActivityLog, Task, ChatHistory
from pydantic import BaseModel
from datetime import datetime
from contextlib import asynccontextmanager

sqlite_file_name = "efficia.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url, echo=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan)

# 1️⃣ Define input schema for activity
class ActivityLogCreate(BaseModel):
    app_name: str
    window_title: str
    duration: int
    timestamp: datetime

# 2️⃣ POST /activity route
@app.post("/activity")
def log_activity(activity: ActivityLogCreate):
    new_log = ActivityLog(
        app_name=activity.app_name,
        window_title=activity.window_title,
        duration=activity.duration,
        timestamp=activity.timestamp
    )

    with Session(engine) as session:
        session.add(new_log)
        session.commit()

    return {"message": "Activity logged successfully"}


from typing import List
from fastapi.middleware.cors import CORSMiddleware

# Add CORS so frontend can access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Change to ["http://localhost:3000"] later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/activity", response_model=List[ActivityLog])
def get_activities():
    with Session(engine) as session:
        logs = session.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).all()
        return logs


from datetime import datetime, date
from sqlmodel import select
from db.models import ActivityLog
from db.db import engine
from typing import List

@app.get("/daily-summary")
def get_daily_summary():
    today = date.today()
    start_of_day = datetime(today.year, today.month, today.day)

    with Session(engine) as session:
        statement = select(ActivityLog).where(ActivityLog.timestamp >= start_of_day)
        logs = session.exec(statement).all()

        summary = {}
        for log in logs:
            app_name = log.app_name
            duration = log.duration
            summary[app_name] = summary.get(app_name, 0) + duration

        return [
            {"app_name": name, "total_time": total}
            for name, total in summary.items()
        ]
