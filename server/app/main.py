
import json
from typing import Union

import pandas as pd
import redis
import requests
from app.constants import (REDIS_HOST, REDIS_PORT, fields_to_include,
                           url_geoservices_CH_csv)
from app.processing.methods import (import_into_dataframe,
                                    search_by_terms_database,
                                    search_by_terms_dataframe,
                                    split_search_string)
from app.redis.methods import check_if_index_exists
from app.redis.schemas import geoservices_schema
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis.commands.search.indexDefinition import IndexDefinition, IndexType
from redis.commands.search.query import Query

app = FastAPI()

dataframe=None
datajson=None
csv_row_limit= 50
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

    dataframe = pd.read_csv(url_geoservices_CH_csv, usecols=fields_to_include, nrows=csv_row_limit)

    try:
        r.ping()
    except:
         raise Exception("ERROR: Cannot connect to redis, ping failed. Have you started redis?")
    else:
        global datajson
        datajson = dataframe.to_json()


        try:

            # Data ingest:

            with open('app/tmp/test.json', encoding='utf-8') as f:
                services = json.loads(f.read())

            PREFIX = "svc:"    
            SERVICE_KEY = PREFIX + '{}'

            index_def = IndexDefinition(
                index_type=IndexType.JSON,
                prefix = [PREFIX],
                score = 0.5,
                score_field = 'doc_score')

            index_key = "py_svc_idx"
            if(check_if_index_exists(index_key)):
                # Drop index in case it is cached
                r.ft(index_key).dropindex()
            r.ft(index_key).create_index(geoservices_schema, definition = index_def)
            
            pipeline = r.pipeline(transaction=False)

            # Load json data into redis:
            for service in services:
                key = SERVICE_KEY.format(service['TITLE']) # Keys need to be unique
                pipeline.json().set(key, "$", service)   
            pipeline.execute()

            test = r.json().get(SERVICE_KEY.format("Abwasser Werkplan Gde"))
            print(test)

            print(r.ft(index_key).info())

            search_result = r.ft(index_key).search(Query('@TITLE:(Gde)')
                .return_field('NAME')
                .return_field('OWNER'))

            print(search_result)

            # test = Geoservice(services[0])   
            # print(test)

            # print(Geoservice.all_pks())
        except:
             raise Exception("ERROR: Redis data import failed")



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

    # word_list = split_search_string(query)

    # dataframe_some_cols = import_into_dataframe()
    # search_result = search_by_terms_dataframe(word_list, dataframe_some_cols)

    # payload = search_result

    # payload =  {"customers": Geoservice.all_pks()}


    # print(payload)
    # return {"data": payload}
    return