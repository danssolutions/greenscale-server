from fastapi_users import FastAPIUsers
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from sqlmodel import Session
from .models import User
from .db import get_session
from fastapi import Depends
import os

SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)


bearer_transport = BearerTransport(tokenUrl="api/auth/jwt/login")

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)


async def get_user_db(session: Session = Depends(get_session)):
    from fastapi_users_db_sqlmodel import SQLModelUserDatabase
    yield SQLModelUserDatabase(session, User)


async def get_user_manager(user_db=Depends(get_user_db)):
    from fastapi_users import BaseUserManager
    from fastapi_users import exceptions

    class UserManager(BaseUserManager[User, int]):
        reset_password_token_secret = SECRET
        verification_token_secret = SECRET

        async def on_after_register(self, user: User, request: None = None):
            print(f"User {user.id} has registered.")

        async def on_after_forgot_password(
            self, user: User, token: str, request: None = None
        ):
            print(f"User {user.id} has forgot their password. Reset token: {token}")

        async def on_after_request_verify(
            self, user: User, token: str, request: None = None
        ):
            print(f"Verification requested for user {user.id}. Verification token: {token}")

        def parse_id(self, value: str) -> int:
            try:
                return int(value)
            except ValueError:
                raise exceptions.InvalidID()

    yield UserManager(user_db)


fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

current_active_user = fastapi_users.current_user(active=True)
