
import uuid
from time import time
from typing import Union

import pandas as pd
from app.constants import EnumServiceType
from app.redis.schemas import SVC_INDEX_ID
from fastapi.logger import logger as fastapi_logger
from redis.commands.search.indexDefinition import IndexDefinition, IndexType
from redis.commands.search.query import Query

from server.app.redis.redis_manager import r


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
    r.ft(INDEX_ID).create_index(schema, definition = index_def)
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
    

def search_redis(redis_query, lang, offset, limit):
    return r.ft(SVC_INDEX_ID).search(Query(redis_query)
            .language(lang)                                   
            .paging(offset, 50000)
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

######################################################################################################################################

def json_to_pandas(redis_output):
    """
    Transforms the json-like output from redis into a pandas df.
    # TODO: This function will be integrated into a class with different ranking methods

    Parameters
    ----------
    redis_output : list[str]
        Output from the redis search
    Returns
    -------
    _ : pandas.DataFrame
    """
    query_results = pd.DataFrame()
    for output in redis_output:
        # Cleaning the string
        doc = str(output).replace("'", '"')
        doc = doc.replace("None", '"None"')
        doc = doc.replace('xa0', "")
        doc = doc.replace("\\", "")
        # Append results to a pandas df
        df = pd.read_json(doc.replace("Document ", ""), orient='index', encoding='utf-16').T
        query_results = pd.concat([query_results, df], axis=0)
        # print(len(redis_output)-i)
    return query_results

def pandas_to_dict(ranked_results_df):
    """
    Transform the pandas dataframe into a json-like 
    output to be passed to the front-end.
    # TODO: This function will be integrated into a class with different ranking methods
    Parameters
    ----------
    ranked_results_df : pandas.DataFrame
        ranked results in a data frame

    Returns
    -------
    _ : dict
        json-like output for the front-end
    """
 
    ranked_results_dict = ranked_results_df.to_dict(orient='records') # after ranking we will have an index -> orient='index' https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_json.html

    return ranked_results_dict

def contains_match_scoring(df, cols, word, score):
    """
    Calculate the ranking score if a word is contained
    in a pandas data frame
    # TODO: This function will be integrated into a class with different ranking methods
    Parameters
    ----------
    df : pandas.DataFrame
        Data frame in which we want to search
    cols : list[str]
        columns of the df in which we want to search
    word : str
        single query word
    score : int
        score we add to the row if word contained

    Returns
    -------
    _ : pd.DataFrame
        dataframe with additional score column
    """
    df_red = df[cols]
    mask = df_red.apply(lambda x: x.str.contains(word, regex=False, case=False)).any(axis=1)
    df.loc[mask, 'score'] += score
    return df

def exact_match_scoring(df, cols, word, score):
    """
    Calculate the ranking score for an exact match of
    a word in a pandas data frame
    # TODO: This function will be integrated into a class with different ranking methods
    Parameters
    ----------
    df : pandas.DataFrame
        Data frame in which we want to search
    cols : list[str]
        columns of the df in which we want to search
    word : str
        single query word
    score : int
        score we add to the row if word exact matched

    Returns
    -------
    _ : pd.DataFrame
        dataframe with additional score column
    """
    df_red = df[cols]
    mask = df_red.apply(lambda x: x.str.match(word, case=False)).any(axis=1)
    df.loc[mask, 'score'] += score
    return df

def results_ranking(redis_output, query_words_list):
    """
    Ranks the results according to the assigned scores
    # TODO: This function will be integrated into a class with different ranking methods
    Parameters
    ----------
    redis_output : pd.DataFrame
        output from redis search
    redis_et : float
        elapsed time for the redis search
    query_words_list : list[str]
        query words splitted into a list

    Returns
    -------
    _ : pd.DataFrame
        ranked data frame (descending)
    """
    t0 = time() # Start time
    query_results_df = json_to_pandas(redis_output)
    print('ranking...')
    # initialize ranking score and the length counter
    query_results_df['score'] = 0
    query_results_df['inv_title_length'] = query_results_df['TITLE'].apply(lambda x: 200 - len(x))
    query_results_df['METAQUALITY'] = query_results_df['METAQUALITY'].astype('int')
    # Calculate the scores
    for query_word in query_words_list:
        print(query_word)
        query_results_df = contains_match_scoring(query_results_df, ['TITLE', 'KEYWORDS'], query_word, 7)
        query_results_df = contains_match_scoring(query_results_df, ['KEYWORDS_NLP', 'SUMMARY'], query_word, 2)
        query_results_df = exact_match_scoring(query_results_df, ['TITLE', 'KEYWORDS'], query_word, 10)
        query_results_df = exact_match_scoring(query_results_df, ['KEYWORDS_NLP', 'SUMMARY'], query_word, 5)

    query_results_df.sort_values(by=['score', 'inv_title_length', 'TITLE'], axis=0, inplace=True, ascending=False)
    # replace nans with empty str
    query_results_df = query_results_df.replace(to_replace='nan', value="", regex=True)
    t1 = time() # end time
    # output the elapsed times for testing purposes
    ranked_results = pandas_to_dict(query_results_df)
    return ranked_results
