from sqlmodel import SQLModel, create_engine

DATABASE_URL = "sqlite:///efficia.db"
engine = create_engine(DATABASE_URL, echo=True)
