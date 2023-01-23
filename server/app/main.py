
from typing import Union

import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.constants import fields_to_include, url_geoservices_CH_csv
from app.processing.methods import (load_data, search_by_terms,
                                    split_search_string)

app = FastAPI()

dataframe=None

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

@app.on_event("startup")
async def startup_event():
    """Startup Event: Load csv into data frame"""
    global dataframe
    dataframe = pd.read_csv(url_geoservices_CH_csv, usecols=fields_to_include)


@app.get("/")
async def root():
    '''Root endpoint'''
    return {"message": "running"}


@app.get("/getServerStatus")
async def get_server_status():
    '''Helper method for client'''
    return {"message": "running"}


@app.get("/getData")
async def get_data(query: Union[str, None] = None):
    """Route for the get_data request (search by terms)"""

    if (query == None):
        return {"data": ""}

    word_list = split_search_string(query)

    dataframe_some_cols = load_data()

    search_result = search_by_terms(word_list, dataframe_some_cols)

    payload = search_result

    print(payload)
    return {"data": payload}