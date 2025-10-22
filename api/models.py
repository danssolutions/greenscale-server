from sqlmodel import Field, Relationship, SQLModel

class UserType(SQLModel, table=True):
    __tablename__="user_types"
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)

    users: list["User"] = Relationship(back_populates="user_type")


class User(SQLModel, table=True):
    __tablename__="users"
    id: int | None = Field(default=None, primary_key=True)
    type_id: int | None = Field(default=None, foreign_key="user_types.id")
    name: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)

    user_type: UserType | None = Relationship(back_populates="users")
