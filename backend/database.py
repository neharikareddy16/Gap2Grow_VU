import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "gap2grow.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def ensure_db_schema():
    import sqlite3
    try:
        if os.path.exists(DB_PATH):
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("PRAGMA table_info(faculty_pdfs)")
            columns = [info[1] for info in cursor.fetchall()]
            if columns and "resource_type" not in columns:
                cursor.execute("ALTER TABLE faculty_pdfs ADD COLUMN resource_type VARCHAR(50) DEFAULT 'PDF'")
                conn.commit()
            conn.close()
    except Exception as e:
        print("ensure_db_schema notice:", e)

ensure_db_schema()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
