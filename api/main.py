from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
from app.mqtt_client import start_mqtt_listener


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_mqtt_listener()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return FileResponse('app/static/fsh-spin.gif', media_type="image/gif")
