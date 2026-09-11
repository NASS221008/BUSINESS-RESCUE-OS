"""
Integration & Database — Shubh
--------------------------------
Creates the SQLite engine + session used by the backend.
"""

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker
from database.models import Base

DB_URL = "sqlite:///./business_rescue.db"

engine = create_engine(DB_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db():
    Base.metadata.create_all(bind=engine)
    try:
        with engine.connect() as conn:
            inspector = inspect(engine)
            if "recovery_reports" in inspector.get_table_names():
                columns = [c["name"] for c in inspector.get_columns("recovery_reports")]
                if "full_report_json" not in columns:
                    conn.execute(text("ALTER TABLE recovery_reports ADD COLUMN full_report_json TEXT"))
                    conn.commit()
    except Exception as e:
        print(f"[DB Migration Check] {e}")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

