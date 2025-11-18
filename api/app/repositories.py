from sqlmodel import Session, select
from datetime import datetime, timedelta
from .models import TelemetryData, Farm, User, UserInfo, Device

class TelemetryDataRepository:
    @staticmethod
    def add(db: Session, telemetry_data: TelemetryData):
        if not device_repository.exists(db, telemetry_data.device_id):
            raise ValueError(f"Device with ID {telemetry_data.device_id} does not exist.")
        telemetry_data.id = None
        db.add(telemetry_data)
        db.commit()
        db.refresh(telemetry_data)
        return telemetry_data

    @staticmethod
    def get_all(db: Session):
        data = db.exec(select(TelemetryData)).all()
        return data

    @staticmethod
    def get_latest_by_device_id(db: Session, device_id: str):
        data = db.exec(select(TelemetryData).where(TelemetryData.device_id == device_id).order_by(TelemetryData.timestamp.desc())).first()
        return data

    @staticmethod
    def get_period_by_device_id(db: Session, device_id: str, start: datetime, end: datetime):
        if end == None:
            end = datetime.now() + timedelta(days=1)
            print(end)
        data = db.exec(select(TelemetryData).where((TelemetryData.device_id == device_id) & (TelemetryData.timestamp >= start) & (TelemetryData.timestamp <= end)).order_by(TelemetryData.timestamp.asc())).all()
        return data


class FarmRepository:
    @staticmethod
    def get_by_id(db: Session, farm_id: int):
        farm = db.exec(select(Farm).where(Farm.id == farm_id)).first()
        return farm

    @staticmethod
    def add(db: Session, farm: Farm):
        farm.id = None
        db.add(farm)
        db.commit()
        db.refresh(farm)
        return farm

    @staticmethod
    def edit_by_id(db: Session, farm_id: int, updated_farm: Farm):
        farm = db.exec(select(Farm).where(Farm.id == farm_id)).first()
        if farm:
            farm.name = updated_farm.name
            farm.temperature_min = updated_farm.temperature_min
            farm.temperature_max = updated_farm.temperature_max
            farm.ph_min = updated_farm.ph_min
            farm.ph_max = updated_farm.ph_max
            farm.do_min = updated_farm.do_min
            farm.do_max = updated_farm.do_max
            farm.turbidity_min = updated_farm.turbidity_min
            farm.turbidity_max = updated_farm.turbidity_max
            db.add(farm)
            db.commit()
            db.refresh(farm)
        return farm

    @staticmethod
    def delete_by_id(db: Session, farm_id: int):
        farm = db.exec(select(Farm).where(Farm.id == farm_id)).first()
        if farm:
            db.delete(farm)
            db.commit()

class DeviceRepository:
    @staticmethod
    def get_by_id(db: Session, device_id: str):
        device = db.exec(select(Device).where(Device.id == device_id)).first()
        return device

    @staticmethod
    def exists(db: Session, device_id: str):
        device = db.exec(select(Device).where(Device.id == device_id)).first()
        return device is not None

    @staticmethod
    def get_by_farm_id(db: Session, farm_id: int):
        devices = db.exec(select(Device).where(Device.farm_id == farm_id)).all()
        return devices

    @staticmethod
    def add(db: Session, device: Device):
        db.add(device)
        db.commit()
        db.refresh(device)
        return device

    @staticmethod
    def delete_by_id(db: Session, device_id: str):
        device = db.exec(select(Device).where(Device.id == device_id)).first()
        if device:
            db.delete(device)
            db.commit()


class UserRepository:
    @staticmethod
    def add(db: Session, user: User):
        user.id = None
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        user = db.exec(select(User).where(User.email == email)).first()
        return user

    @staticmethod
    def get_user_info_by_id(db: Session, user_id: int):
        user = db.exec(select(User).where(User.id == user_id)).first()
        if user:
            return UserInfo(id=user.id, name=user.name, email=user.email, farm_id=user.farm_id)
        return None


telemetry_data_repository = TelemetryDataRepository()
farm_repository = FarmRepository()
device_repository = DeviceRepository()
user_repository = UserRepository()
