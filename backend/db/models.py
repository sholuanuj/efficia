from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class ActivityLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    app_name: str
    window_title: str
    duration: int  # in seconds
    timestamp: datetime

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    completed: bool = False
    due_date: Optional[datetime] = None

class ChatHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_message: str
    bot_response: str
    timestamp: datetime
    parent_id: Optional[int] = None
