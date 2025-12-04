from fastapi_users import schemas


class UserRead(schemas.BaseUser[int]):
    name: str
    farm_id: int | None
    type_id: int | None


class UserCreate(schemas.BaseUserCreate):
    name: str
    farm_id: int | None = None
    type_id: int | None = None


class UserUpdate(schemas.BaseUserUpdate):
    name: str | None = None
    farm_id: int | None = None
    type_id: int | None = None
