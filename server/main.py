import re
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    # Adjust to your frontend localhost port if not default
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "running"}


@app.get("/getServerStatus")
async def getServerStatus():
    return {"message": "running"}


@app.get("/getData")
async def getData(query: Union[str, None] = None):
    payload = re.split(r',|!|;', str(query))

    print(payload)
    return {"data": payload}
