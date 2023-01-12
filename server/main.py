
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from constants import url_geoservices_CH_csv
from routers import get_data

app = FastAPI()

origins = [
    # Adjust to your frontend localhost port if not default
    "http://localhost:3000"
]

app.include_router(get_data.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    '''Root endpoint'''
    return {"message": "running"}


@app.get("/getServerStatus")
async def get_server_status():
    '''Helper method for client'''
    return {"message": "running"}

