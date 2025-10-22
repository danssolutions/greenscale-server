from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import FileResponse
from sqlmodel import SQLModel
from .db import engine
from .routes import router
import uvicorn, json

app = FastAPI()

app.include_router(router)

@app.get("/")
def root():
    return FileResponse('static/fsh-spin.gif', media_type="image/gif")
