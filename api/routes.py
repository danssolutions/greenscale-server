from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from .db import get_session
from .models import *

router = APIRouter(prefix="/api")

@router.get("/users", response_model=list[User])
def get_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users
