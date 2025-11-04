from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import FileResponse
from sqlmodel import SQLModel
from app.db import engine
from app.routes import router
from app.mqtt_client import start_mqtt_listener
import uvicorn, json

app = FastAPI()

@app.on_event("startup")
def startup_event():
    start_mqtt_listener()

app.include_router(router)

@app.get("/")
def root():
    return FileResponse('app/static/fsh-spin.gif', media_type="image/gif")
