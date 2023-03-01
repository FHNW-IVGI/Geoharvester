
import logging
from typing import Union

import pandas as pd
from app.processing.methods import (import_csv_into_dataframe,
                                    search_by_terms_dataframe,
                                    split_search_string)
from fastapi import FastAPI
from fastapi.logger import logger as fastapi_logger
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(debug=True)

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

gunicorn_logger = logging.getLogger('gunicorn.error')
fastapi_logger.handlers = gunicorn_logger.handlers
if __name__ != "main":
    fastapi_logger.setLevel("DEBUG")
else:
    fastapi_logger.setLevel(logging.DEBUG)

@app.on_event("startup")
async def startup_event():
    """Startup Event: Load csv into data frame"""
    global dataframe

    # To reduce traffic we load the file from ./tmp instead from Github.
    url_geoservices_CH_csv = "app/tmp/geoservices_CH.csv"

    csv_row_limit= 5000 # Subset, to increase performance
    dataframe =  import_csv_into_dataframe(url_geoservices_CH_csv, csv_row_limit)
    
    fastapi_logger.warning("INFO:     Dataframe initialized with {} records".format(len(dataframe)))



@app.get("/")
async def root():
    '''Root endpoint'''
    return {"message": "running"}

@app.get("/getServerStatus")
async def get_server_status():
    '''Helper method for client'''
    return {"message": "running"}

@app.get("/getDataFromPandas")
async def get_data_from_pandas(query: Union[str, None] = None):
    """Route for the get_data request (search by terms) targeted at pandas dataframe"""

    if (query == None):
        return {"data": ""}

    word_list = split_search_string(query)
    search_result = search_by_terms_dataframe(word_list, dataframe)
    payload = search_result

    return {"data": payload}