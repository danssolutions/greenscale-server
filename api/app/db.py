from sqlmodel import create_engine, Session
from dotenv import load_dotenv
import os

load_dotenv('../.env')

db_url = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"

engine = create_engine(db_url, echo=True)


def get_session():
    with Session(engine) as session:
        yield session


def get_session_local():
    return Session(engine)
