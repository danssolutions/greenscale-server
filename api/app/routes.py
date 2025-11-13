from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime
from .db import get_session
from .repositories import telemtry_data_repository
from .models import *

router = APIRouter(prefix="/api")

@router.get("/telemetry-data/latest", response_model=TelemetryData)
def get_latest_telemetry_data(db: Session = Depends(get_session)):
    data = telemtry_data_repository.get_latest(db)
    if data == None:
        raise HTTPException(404)
    return data

@router.get("/telemetry-data/period", response_model=list[TelemetryData])
def get_telemetry_data_period(start: datetime, end: datetime | None = Query(None, description="Optional period end datetime"), db: Session = Depends(get_session)):
    data = telemtry_data_repository.get_period(db, start, end)
    return data
