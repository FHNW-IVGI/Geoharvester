
import uuid
import pandas as pd
import re
from time import time
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
        query_string += "{} | ".format(word+'*') if index < (len(wordlist)-1) else "{}".format(word+'*') # the * allows the contain opt
    return query_string


def redis_query_from_parameters(query_string: Union[str, None] = None,  service: EnumServiceType = EnumServiceType.none, owner:str = ""):
    """Build a query string based on the parameters provided.
    """
    queryable_parameters = []

    if (bool(query_string)):
        queryable_parameters.append(
            '@TITLE|ABSTRACT|KEYWORDS|KEYWORDS_NLP|SUMMARY:({})'.format(query_string)
        )

    if (bool(service)):
        queryable_parameters.append(
            '@SERVICETYPE:({})'.format(service)
        )

    if (bool(owner)):
        queryable_parameters.append(
            '@OWNER:({})'.format(owner)
        )

    if (len(queryable_parameters) < 1):
        # In this case all available datasets should be returned:
        return '@SERVICETYPE:(WMS | WMTS | WFS)'
    elif (len(queryable_parameters) == 1):
        return queryable_parameters[0]
    else:
       return "&".join(queryable_parameters)

######################################################################################################################################

def json_to_pandas(redis_output):
    """
    Transforms the json-like output from redis into a pandas df.
    # TODO: This function will be integrated into a class with different ranking methods

    Parameters
    redis_output

    Output
    """
    query_results = pd.DataFrame()
    for output in redis_output:
        # Cleaning the string
        doc = str(output).replace("'", '"')
        doc = doc.replace("None", '"None"')
        # Append results to a pandas df
        df = pd.read_json(doc.replace("Document ", ""), orient='index').T
        query_results = pd.concat([query_results, df], axis=0)
        # print(len(redis_output)-i)
    return query_results

def pandas_to_dict(ranked_results_df, timing):
    """
    # TODO: This function will be integrated into a class with different ranking methods
    """
    ranked_results = {
        "total": 0,
        "docs": None,
        "duration": 0, }
    
    ranked_results_dict = ranked_results_df.to_dict(orient='records') # after ranking we will have an index -> orient='index' https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_json.html
    #parsed_results = js.loads(ranked_results_js)
    #js.dumps(parsed_results, indent=4)
    ranked_results["docs"] = ranked_results_dict
    ranked_results["total"] = len(ranked_results_df)
    ranked_results["duration"] = timing # it will be calculated from the ranking function
    return ranked_results

def contains_match_scoring(df, cols, word, score):
    """
    tbd
    """
    df_red = df[cols]
    mask = df_red.apply(lambda x: x.str.contains(word, regex=False, case=False)).any(axis=1)
    df.loc[mask, 'score'] += score
    return df

def exact_match_scoring(df, cols, word, score):
    """
    tbd
    """
    df_red = df[cols]
    mask = df_red.apply(lambda x: x.str.match(word, case=False)).any(axis=1)
    df.loc[mask, 'score'] += score
    return df

def results_ranking(redis_output, redis_et, query_words_list):
    """
    Ranks the results according to different methods.
    # TODO: This function will be integrated into a class with different ranking methods

    Parameters
    query_results_df

    Output
    """
    t0 = time() # Start time
    query_words_list = query_words_list[0] # BUG: expand the function for multiple words search
    query_results_df = json_to_pandas(redis_output)
    print('ranking...')
    # initialize ranking score
    query_results_df['score'] = 0
    # Calculate the scores
    query_results_df = contains_match_scoring(query_results_df, ['TITLE', 'KEYWORDS'], query_words_list, 80)
    query_results_df = contains_match_scoring(query_results_df, ['ABSTRACT', 'KEYWORDS_NLP', 'SUMMARY'], query_words_list, 25)
    query_results_df = exact_match_scoring(query_results_df, ['TITLE', 'KEYWORDS'], query_words_list, 100)
    query_results_df = exact_match_scoring(query_results_df, ['ABSTRACT', 'KEYWORDS_NLP', 'SUMMARY'], query_words_list, 50)
    query_results_df.sort_values(by=['score', 'TITLE'], axis=0, inplace=True, ascending=False)
    t1 = time() # end time
    # output the elapsed times for testing purposes
    ranked_results = pandas_to_dict(query_results_df, round(redis_et + (t1-t0), 4))
    print(f'Redis query executed in {round(redis_et, 4)} seconds while pandas ranking executed in {round(t1-t0, 4)} seconds')
    return ranked_results
