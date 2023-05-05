
import uuid
from typing import Union

import redis
from app.constants import REDIS_HOST, REDIS_PORT, EnumServiceType
from app.processing.stopwords import get_stopwords
from fastapi.logger import logger as fastapi_logger
from redis.commands.search.indexDefinition import IndexDefinition, IndexType

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)


def check_if_index_exists(INDEX_ID):
    """Helper method as Redis does not allow for checking if an index exists, except for .info(). This however throws an exception instead of a boolean."""

    try:
         r.ft(INDEX_ID).info()
    except:
        # Return boolean instead of exception
        return False
    else:
        # Return boolean instead of info object
        return True


def create_index(PREFIX, INDEX_ID, schema):
    "Create index based on stopword, schema and index definition"
    index_def = IndexDefinition(
        index_type=IndexType.JSON,
        prefix = [PREFIX],
    )

    if(check_if_index_exists(INDEX_ID)):
        # Drop index in case it is cached by Docker
        r.ft(INDEX_ID).dropindex()
    r.ft(INDEX_ID).create_index(schema, definition = index_def, stopwords=get_stopwords())
    return


def drop_redis_db(PREFIX):
    "Drop redis records with given prefix. Return database size"

    for key in r.keys('{}*'.format(PREFIX)):
        r.delete(key)

    remaining_records = r.dbsize()
    fastapi_logger.info("Redis dropped with {} records remaining".format(remaining_records))

    return remaining_records


def ingest_data(json, KEY):
    "Ingest data from a json array and assign uuid. Return database size"

    pipeline = r.pipeline(transaction=False)

    redis_size_before_ingest = r.dbsize()

    try:
        for element in json:
            key = KEY.format(uuid.uuid4()) # Keys need to be unique
            pipeline.json().set(key, "$", element)
        pipeline.execute()

    except:
        raise Exception("ERROR: Ingestion failed")


    finally:    
        redis_size_after_ingest = r.dbsize()
        fastapi_logger.info("Redis received {} additional records".format(redis_size_after_ingest - redis_size_before_ingest))
    
    return redis_size_after_ingest


def transform_wordlist_to_query(wordlist: list[str]):
    """Whitespaces in redis queries are parsed as AND, thus this method adds pipes (|) to force OR logic.
       See: https://redis.io/docs/stack/search/reference/query_syntax/
    """
    query_string = ""
    for index, word in enumerate(wordlist):
        query_string += "{} | ".format(word) if index < (len(wordlist)-1) else "{}".format(word)
    return query_string


def redis_query_from_parameters(query_string: Union[str, None] = None,  service: EnumServiceType = EnumServiceType.none, owner:str = ""):
    """Build a query string based on the parameters provided.
    """
    queryable_parameters = []

    if (bool(query_string)):
        queryable_parameters.append(
            '@title|abstract:({})'.format(query_string)
        )

    if (bool(service)):
        queryable_parameters.append(
            '@service:({})'.format(service)
        )

    if (bool(owner)):
        queryable_parameters.append(
            '@provider:({})'.format(owner)
        )

    if (len(queryable_parameters) < 1):
        # In this case all available datasets should be returned:
        return '@service:(WMS | WMTS | WFS)'
    elif (len(queryable_parameters) == 1):
        return queryable_parameters[0]
    else:
       return "&".join(queryable_parameters)
