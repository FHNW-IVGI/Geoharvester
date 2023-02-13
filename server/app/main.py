
import json
from typing import Union

import pandas as pd
import redis
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis import StrictRedis
from redis.commands.search.query import Query

from app.constants import REDIS_HOST, REDIS_PORT, url_geoservices_CH_csv
from app.processing.methods import (import_csv_into_dataframe,
                                    search_by_terms_dataframe,
                                    split_search_string)
from app.redis.methods import create_index, drop_redis_db, ingest_data
from app.redis.schemas import (SVC_INDEX_ID, SVC_KEY, SVC_PREFIX,
                               geoservices_schema)

cache = StrictRedis()

app = FastAPI()

dataframe=None
datajson=None
csv_row_limit= 5000
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)




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

    # To reduce traffic we load the file from ./tmp instead from Github. Remove this and the next line for prod / demo use:
    url_geoservices_CH_csv = "app/tmp/geoservices_CH.csv"
    dataframe =  import_csv_into_dataframe(url_geoservices_CH_csv)

    try:
        r.ping()
    except:
         raise Exception("ERROR: Cannot connect to redis, ping failed. Have you started redis?")
    else:
        global datajson
        datajson = json.loads(dataframe.to_json(orient='records'))

        try:
            # Flush DB on startup
            drop_redis_db(SVC_PREFIX)

            create_index(SVC_PREFIX, SVC_INDEX_ID, geoservices_schema)

            ingest_data(datajson, SVC_KEY)

        except:
             raise Exception("ERROR: Redis data import failed")
        finally:
            # Index Debugging:
            # print(r.ft(INDEX_KEY).info())

            # Verify database is up and running:
            total_keys = r.dbsize()
            print("--- Redis initialized with {} records".format(total_keys))



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
    print("panda")

    if (query == None):
        return {"data": ""}

    word_list = split_search_string(query)

    dataframe_some_cols = import_csv_into_dataframe(url_geoservices_CH_csv, csv_row_limit)
    search_result = search_by_terms_dataframe(word_list, dataframe_some_cols)

    payload = search_result

    return {"data": payload}


@app.get("/getDataFromRedis")
async def get_data_from_redis(query: Union[str, None] = None):
    """Route for the get_data request (search by terms) targeted at redis"""

    if (query == None):
        return {"data": ""}

    # word_list = split_search_string(query) # Needs proper handling - check if handled for other langs then ENG

    # Simple Search
    simple = r.ft(SVC_INDEX_ID).search(query)

    # Define return fields, search mutliple fields
    ## WIP: https://redis.io/docs/stack/search/reference/query_syntax/
    search_result = r.ft(SVC_INDEX_ID).search(Query('@TITLE|ABSTRACT:({})'.format(query))
        .return_field('NAME')
        .return_field('OWNER')
        .return_field('TITLE')
        .return_field('ABSTRACT'))


    return {"data": search_result}