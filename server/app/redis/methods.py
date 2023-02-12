
import uuid

import redis
from redis.commands.search.indexDefinition import IndexDefinition, IndexType

from app.constants import REDIS_HOST, REDIS_PORT
from app.processing.stopwords import get_stopwords

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
    print("--- Redis dropped with {} records remaining".format(remaining_records))

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
        print("--- Redis received {} additional records".format(redis_size_after_ingest - redis_size_before_ingest))
    
    return redis_size_after_ingest
