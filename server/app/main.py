
import json
import uuid
from typing import Union

import pandas as pd
import redis
from app.constants import (INDEX_KEY, REDIS_HOST, REDIS_PORT,
                           url_geoservices_CH_csv)
from app.processing.methods import (import_csv_into_dataframe,
                                    search_by_terms_dataframe,
                                    split_search_string)
from app.redis.methods import check_if_index_exists
from app.redis.schemas import geoservices_schema
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis import StrictRedis
from redis.commands.search.indexDefinition import IndexDefinition, IndexType
from redis.commands.search.query import Query

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
            PREFIX = "svc:"    
            SERVICE_KEY = PREFIX + '{}'

            # Flush DB on startup
            for key in r.keys('{}*'.format(PREFIX)):
                r.delete(key)

            index_def = IndexDefinition(
                index_type=IndexType.JSON,
                prefix = [PREFIX],
            )

            if(check_if_index_exists(INDEX_KEY)):
                # Drop index in case it is cached
                r.ft(INDEX_KEY).dropindex()
            r.ft(INDEX_KEY).create_index(geoservices_schema, definition = index_def)
            
            pipeline = r.pipeline(transaction=False)

            # Load json data into redis:
            for service in datajson:
                key = SERVICE_KEY.format(uuid.uuid4()) # Keys need to be unique
                pipeline.json().set(key, "$", service)
            pipeline.execute()

        except:
             raise Exception("ERROR: Redis data import failed")
        finally:
            # Index Debugging:
            # print(r.ft(INDEX_KEY).info())

            # Verify data loading:
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

    # word_list = split_search_string(query) # Needs proper handling

    # Simple Search
    simple = r.ft(INDEX_KEY).search(query)

    # Define return fields, search mutliple fields
    ## WIP: https://redis.io/docs/stack/search/reference/query_syntax/
    search_result = r.ft(INDEX_KEY).search(Query('@TITLE|ABSTRACT:({})'.format(query))
        .return_field('NAME')
        .return_field('OWNER')
        .return_field('TITLE')
        .return_field('ABSTRACT'))

    ## todo: Implement stemming and better indexing

    return {"data": search_result}