from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime
from fastapi_users_db_sqlmodel import SQLModelBaseUserDB


class UserType(SQLModel, table=True):
    __tablename__ = "user_types"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)

    users: list["User"] = Relationship(back_populates="user_type")


class User(SQLModelBaseUserDB, table=True):
    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    type_id: int | None = Field(default=None, foreign_key="user_types.id")
    name: str
    farm_id: int | None = Field(default=None, foreign_key="farms.id")

    user_type: UserType | None = Relationship(back_populates="users")


class UserInfo(SQLModel):
    id: int
    name: str
    email: str
    farm_id: int | None

class Farm(SQLModel, table=True):
    __tablename__ = "farms"

    id: int | None = Field(default=None, primary_key=True)
    name: str
    temperature_min: float
    temperature_max: float
    ph_min: float
    ph_max: float
    do_min: float
    do_max: float
    turbidity_min : float
    turbidity_max : float

class Device(SQLModel, table=True):
    __tablename__ = "devices"

    id: str | None = Field(default=None, primary_key=True)
    farm_id: int | None = Field(default=None, foreign_key="farms.id")


class TelemetryData(SQLModel, table=True):
    __tablename__ = "telemetry_data"

    id: int | None = Field(default=None, primary_key=True)
    version: int
    device_id: str = Field(index=True)
    timestamp: datetime

    # Status fields
    online: bool
    uptime_sec: int

    # Sensor fields
    temperature_c: float
    ph: float
    do_mg_per_l: float
    turbidity_sensor_v: float

    # Camera fields
    turbidity_index: float
    avg_color_hex: str

    @classmethod
    def from_json(cls, data: dict):
        return cls(
            version=data["version"],
            device_id=data["device_id"],
            timestamp=datetime.fromisoformat(data["timestamp"].replace("Z", "+00:00")),
            online=data["status"]["online"],
            uptime_sec=data["status"]["uptime_sec"],
            temperature_c=data["sensors"]["temperature_c"],
            ph=data["sensors"]["ph"],
            do_mg_per_l=data["sensors"]["do_mg_per_l"],
            turbidity_sensor_v=data["sensors"]["turbidity_sensor_v"],
            turbidity_index=data["camera"]["turbidity_index"],
            avg_color_hex=data["camera"]["avg_color_hex"],
        )
