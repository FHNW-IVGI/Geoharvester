
import json
import logging
from typing import List, Union

from app.constants import EnumServiceType
from app.processing.methods import (import_csv_into_dataframe,
                                    import_pkl_into_dataframe,
                                    split_search_string)
from app.redis.methods import (create_index, drop_redis_db, ingest_data,
                               redis_query_from_parameters, results_ranking,
                               transform_wordlist_to_query)
# from app.redis.redis import r
from app.redis.schemas import (SVC_INDEX_ID, SVC_KEY, SVC_PREFIX,
                               GeoserviceModel, geoservices_schema)
from fastapi import FastAPI
from fastapi.logger import logger as fastapi_logger
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import Page, add_pagination, paginate
from redis.commands.search.query import Query

from server.app.redis.redis_manager import r

app = FastAPI(
    debug=True,
    version="0.2.0",
    docs_url='/api/docs',
    redoc_url='/api/redoc',
    openapi_url='/api/openapi.json'
)

dataframe=None
datajson=None

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
    # url_geoservices_CH_csv = "app/tmp/geoservices_CH.csv"
    # dataframe =  import_csv_into_dataframe(url_geoservices_CH_csv)
    url_geoservices_CH_pkl = "app/tmp/rawdata_scraper.pkl" # preprocessed data with NLP!
    dataframe = import_pkl_into_dataframe(url_geoservices_CH_pkl)
    
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


@app.get("/api/getData", response_model=Page[GeoserviceModel])
async def get_data(query: Union[str, None] = None,  service: EnumServiceType = EnumServiceType.none, owner:str = "", lang: str = "german", offset: int = 0, limit: int = 1000):
    """Route for the get_data request
        query: The query string used for searching
        service: Service filter - wms, wmts, wfs
        owner: Owner filter
        lang: Language parameter to optimize search
        limit: Redis returns 10 results by default, allow more results to be returned
        service: Service enum, either WMS, WMTS, WFS
    """

    query_string = ""

    if (query != None):
        word_list = split_search_string(query)
        query_string = transform_wordlist_to_query(word_list)

    redis_query = redis_query_from_parameters(query_string, service, owner)
    fastapi_logger.info("Redis queried with: {}".format(redis_query))

    ### See: https://redis.io/commands/ft.search/ : limit to count the number of results, maybe split into offsets? Maybe sort by Metaquality?
    ### 10000: 3 sec with pagination



    redis_data = r.ft(SVC_INDEX_ID).search(Query(redis_query)
        .language(lang)                                   
        .paging(offset, 99)
        .return_field('TITLE')
        .return_field('ABSTRACT')
        .return_field('OWNER')
        .return_field('SERVICETYPE')
        .return_field('NAME')
        .return_field('MAPGEO')
        .return_field('TREE')
        .return_field('GROUP')
        .return_field('KEYWORDS')
        .return_field('KEYWORDS_NLP')
        .return_field('LEGEND')
        .return_field('CONTACT')
        .return_field('SERVICELINK')
        .return_field('METADATA')
        .return_field('MAX_ZOOM')
        .return_field('CENTER_LAT')
        .return_field('CENTER_LON')
        .return_field('BBOX')
        .return_field('SUMMARY')
        .return_field('LANG_3')
        .return_field('METAQUALITY')
        )
    

    ############################################################################################################################
    # Testing ranking function from the ranking functions in methods.py
    # If you want the results from redis you can just set this section as comment

    if (query != None and len(redis_data.docs) > 0):
        ranked_results = results_ranking(redis_data.docs)
        return paginate(ranked_results)
    else:
        pass
    ############################################################################################################################ 
    return paginate(redis_data.docs)

add_pagination(app)
