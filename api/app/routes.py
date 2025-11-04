from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from .db import get_session
from .models import *

router = APIRouter(prefix="/api")

@router.get("/users", response_model=list[User])
def get_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users

@router.get("/telemetry-data", response_model=list[TelemetryData])
def get_all_telemtry_data(session: Session = Depends(get_session)):
    data = session.exec(select(TelemetryData)).all()
    return data
