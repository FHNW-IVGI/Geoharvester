
import json
import logging
from typing import Union

import pandas as pd
import redis
from app.constants import REDIS_HOST, REDIS_PORT, EnumServiceType
from app.processing.methods import (import_csv_into_dataframe,
                                    split_search_string)
from app.redis.methods import (create_index, drop_redis_db, ingest_data,
                               redis_query_from_parameters,
                               transform_wordlist_to_query)
from app.redis.schemas import (SVC_INDEX_ID, SVC_KEY, SVC_PREFIX,
                               geoservices_schema)
from fastapi import FastAPI
from fastapi.logger import logger as fastapi_logger
from fastapi.middleware.cors import CORSMiddleware
from redis import StrictRedis
from redis.commands.search.query import Query

app = FastAPI(
    debug=True,
    version="0.2.0",
    docs_url='/api/docs',
    redoc_url='/api/redoc',
    openapi_url='/api/openapi.json'
)

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

    # To reduce traffic we load the file from ./tmp instead from Github. Remove this and the next line for prod / demo use:
    url_geoservices_CH_csv = "app/tmp/geoservices_CH.csv"
    dataframe =  import_csv_into_dataframe(url_geoservices_CH_csv)
    
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
        fastapi_logger.info("Redis initialized with {} records".format(total_keys))



@app.get("/api")
async def root():
    '''Root endpoint'''

    return {"message": "running"}

@app.get("/api/getDataById/{id}")
async def get_data_by_id(id: str):
    """Get a single dataset by its id
    """
    if(id == None):
        return
    dataset_id = id.strip().removeprefix('"').removesuffix('"')
    redis_data = r.json().get(dataset_id)
    return redis_data


@app.get("/api/getData")
async def get_data(query: Union[str, None] = None,  service: EnumServiceType = EnumServiceType.none, owner:str = "", lang: str = "german", limit: int = 100):
    """Route for the get_data request
        query: The query string used for searching
        service: Service filter - wms, wmts, wfs
        owner: Owner filter
        lang: Language parameter to optimize search
        limit: Redis returns 10 results by default, allow more results to be returned
        service: Service enum, either WMS, WMTS, WFS
    """
    search_result = {
        "total": 0,
        "docs": None,
        "fields": [],
        "duration": 0,
    }

    # Until pagination is implemented we need to safeguard against extensive limits to avoid server crashes:
    if (limit > 1000):
        limit = 1000

    query_string = ""

    if (query != None):
        word_list = split_search_string(query)
        query_string = transform_wordlist_to_query(word_list)

    redis_query = redis_query_from_parameters(query_string, service, owner)
    fastapi_logger.info("Redis queried with: {}".format(redis_query))

    redis_data = r.ft(SVC_INDEX_ID).search(Query(redis_query)
        .language(lang)                                   
        .paging(0, limit) # offset, limit
        .return_field('provider')
        .return_field('title')
        .return_field('name')
        .return_field('preview')
        .return_field('tree')
        .return_field('group')
        .return_field('abstract')
        .return_field('keywords')
        .return_field('legend')
        .return_field('contact')
        .return_field('endpoint')
        .return_field('metadata')
        .return_field('service')
        .return_field('maxZoom')
        .return_field('centerLat')
        .return_field('centerLon')
        .return_field('bbox')
        )

    search_result["docs"] = redis_data.docs
    search_result["fields"] = []
    search_result["duration"] = redis_data.duration
    search_result["total"] = len(redis_data.docs)

    return {"data": search_result}