from sqlmodel import Session, select
from datetime import datetime, timedelta
from .models import TelemetryData
from .db import get_session_local

class TelemetryDataRepository:
    def get_latest(self, db: Session):
        data = db.exec(select(TelemetryData).order_by(TelemetryData.timestamp.desc())).first()
        return data

    def get_period(self, db: Session, start: datetime, end: datetime):
        if end == None:
            end = datetime.now() + timedelta(days=1)
            print(end)
        data = db.exec(select(TelemetryData).where((TelemetryData.timestamp >= start) & (TelemetryData.timestamp <= end)).order_by(TelemetryData.timestamp.asc())).all()
        return data

telemtry_data_repository = TelemetryDataRepository()
