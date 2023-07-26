import os
import json
import logging
from typing import Union

from app.constants import DEFAULTSIZE, EnumProviderType, EnumServiceType
from app.processing.methods import (import_csv_into_dataframe,
                                    import_pkl_into_dataframe,
                                    split_search_string)
from app.redis.methods import (create_index, drop_redis_db, ingest_data,
                               redis_query_from_parameters, results_ranking,
                               search_redis, transform_wordlist_to_query)
from app.redis.schemas import (SVC_INDEX_ID, SVC_KEY, SVC_PREFIX,
                               GeoserviceModel, geoservices_schema)
from fastapi import FastAPI
from fastapi.logger import logger as fastapi_logger
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import Page, add_pagination, paginate
from pydantic import Field

from server.app.redis.redis_manager import r

origins = [
    # Adjust to your frontend localhost port if not default
    "http://localhost:3000"
]
app = FastAPI(
    debug=True,
    version="0.2.0",
    docs_url='/api/docs',
    redoc_url='/api/redoc',
    openapi_url='/api/openapi.json'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging:
gunicorn_logger = logging.getLogger('gunicorn.error')
fastapi_logger.handlers = gunicorn_logger.handlers
if __name__ != "main":
    fastapi_logger.setLevel("DEBUG")
else:
    fastapi_logger.setLevel(logging.DEBUG)


# Pagination settings. Adjust FE table calculations accordingly when changing these!
Page = Page.with_custom_options(
    size=Field(DEFAULTSIZE, ge=1, le=DEFAULTSIZE),
)

dataframe=None
datajson=None

@app.on_event("startup")
async def startup_event():
    """Startup Event: Load csv into data frame"""
    # Overwrite config limit for a maximum of 10000 search results:
    r.ft().config_set("MAXSEARCHRESULTS", "-1" )

    global dataframe
    #WARNING: the path to repo must be adjusted
    url_github_repo = "https://raw.githubusercontent.com/FHNW-IVGI/Geoharvester/main_preprocessing/scraper/data/"
    url_geoservices_CH_pkl = os.path.join(url_github_repo, "preprocessed_data.pkl")
    dataframe = import_pkl_into_dataframe(url_geoservices_CH_pkl)
    # url_geoservices_CH_csv = "app/tmp/geoservices_CH.csv"
    # dataframe =  import_csv_into_dataframe(url_geoservices_CH_csv)
    
    global datajson
    datajson = json.loads(dataframe.to_json(orient='records'))

    try:
        # Flush DB on startup
        drop_redis_db()

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
async def get_data(query_string: Union[str, None] = None,  service: EnumServiceType = EnumServiceType.none, provider:EnumProviderType = EnumProviderType.none, lang: str = "german", page: int = 0, limit: int = 1000):
    """Route for the get_data request
        query: The query string used for searching
        service: Service filter - wms, wmts, wfs
        provider: Provider filter
        lang: Language parameter to optimize search
        limit: Redis returns 10 results by default, allow more results to be returned
        service: Service enum, either WMS, WMTS, WFS
    """

    if (query_string == None or query_string == ""):
        redis_query = redis_query_from_parameters("", service, provider)
        fastapi_logger.info("Redis queried without query_text: {}".format(redis_query))

        redis_data = search_redis(redis_query, lang, 0, 40000)
        return paginate(redis_data.docs)


    if (query_string != None and len(query_string) > 1):
        word_list = split_search_string(query_string)
        text_query = transform_wordlist_to_query(word_list)

        redis_query = redis_query_from_parameters(text_query, service, provider)
        fastapi_logger.info("Redis queried with: {}".format(redis_query))

        redis_data = search_redis(redis_query, lang, 0, 40000)

        ############################################################################################################################
        if (query_string != None and len(redis_data.docs) > 0):
            ranked_results = results_ranking(redis_data.docs, word_list)
            return paginate(ranked_results)
        else:
            pass
        ############################################################################################################################ 
    return paginate([])

add_pagination(app)
