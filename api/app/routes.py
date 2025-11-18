from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
from .db import get_session
from .repositories import telemetry_data_repository, farm_repository, device_repository, user_repository
from .models import *

router = APIRouter(prefix="/api")


### TelemetryData
@router.get("/telemetry-data/all", response_model=list[TelemetryData])
def get_all_telemetry_data(db: Session = Depends(get_session)):
    data = telemetry_data_repository.get_all(db)
    if data == None:
        raise HTTPException(404)
    return data

@router.get("/telemetry-data/{device_id}/latest", response_model=TelemetryData)
def get_latest_telemetry_data(device_id: str, db: Session = Depends(get_session)):
    data = telemetry_data_repository.get_latest_by_device_id(db, device_id)
    if data is None:
        raise HTTPException(404)
    return data

@router.get("/telemetry-data/{device_id}/period", response_model=list[TelemetryData])
def get_telemetry_data_period(device_id: str, start: datetime, end: datetime | None = Query(None, description="Optional period end datetime"), db: Session = Depends(get_session)):
    data = telemetry_data_repository.get_period_by_device_id(db, device_id, start, end)
    return data


### Farms
@router.get("/farms/{farm_id}", response_model=Farm)
def get_farm_by_id(farm_id: int, db: Session = Depends(get_session)):
    farm = farm_repository.get_by_id(db, farm_id)
    if farm is None:
        raise HTTPException(404)
    return farm

@router.put("/farms/{farm_id}/edit", response_model=Farm)
def edit_farm_by_id(farm_id: int, updated_farm: Farm, db: Session = Depends(get_session)):
    farm = farm_repository.edit_by_id(db, farm_id, updated_farm)
    if farm is None:
        raise HTTPException(404)
    return farm

@router.post("/farms", response_model=Farm)
def add_farm(farm: Farm, db: Session = Depends(get_session)):
    new_farm = farm_repository.add(db, farm)
    return new_farm

@router.delete("/farms/{farm_id}/delete")
def delete_farm_by_id(farm_id: int, db: Session = Depends(get_session)):
    farm_repository.delete_by_id(db, farm_id)
    return {"message": "Farm deleted"}


### Devices
@router.get("/farms/{farm_id}/devices", response_model=list[Device])
def get_devices_by_farm_id(farm_id: int, db: Session = Depends(get_session)):
    devices = device_repository.get_by_farm_id(db, farm_id)
    return devices

@router.post("/devices", response_model=Device)
def add_device(device: Device, db: Session = Depends(get_session)):
    new_device = device_repository.add(db, device)
    return new_device

@router.delete("/devices/{device_id}/delete")
def delete_device_by_id(device_id: str, db: Session = Depends(get_session)):
    device_repository.delete_by_id(db, device_id)
    return {"message": "Device deleted"}
