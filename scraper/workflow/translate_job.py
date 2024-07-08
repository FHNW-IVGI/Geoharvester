"""
title: The ultimate translator for GeoHarvester
Author: Elia Ferrari
Date: 2024-04-29
"""

import logging
import os
import sys
from time import time

import pandas as pd

sys.path.append('../')



import scraper.configuration as config
import scraper.utils as utils


def translate_new_data(db, translate_column, languages):
    """
    Translates the preprocessed data

    Parameters
    ----------
    db : df
        Dataframe to be translated
    translate_column : string
        Column name from the list of columns to translate as defined in WORKFLOW_TRANSLATE_COLUMNS
    languages : list
        Language to translate into, defined by LANG_FROM_PIPELINE

    Output 
    ----------
    <language_abbr>_translated.pkl : pickle
        Outputs a pickle file of the translation which is uploaded as artifact to github
    """
    db = db.fillna("nan")
    for lang in languages:
        new_col = translate_column+'_'+lang
        if translate_column == 'title':
            tlang1 = time()
            db[new_col] = db.apply(lambda row: utils.translate_text(
                row[translate_column],to_lang=lang, from_lang=row['lang_3']), axis=1)
            tlang2 = time()
            print(f"Processed 'Title' for {lang} {tlang2-tlang1} after process start")
        elif translate_column == 'abstract':
            tlang1 = time()
            db[new_col] = db.apply(lambda row: utils.translate_abstract(
                row[translate_column], to_lang=lang, from_lang=row['lang_3']), axis=1)
            tlang2 = time()
            print(f"Processed 'Abstract' for {lang} {tlang2-tlang1} after process start")
        elif translate_column == 'keywords':
            tlang1 = time()
            db[new_col] = db.apply(lambda row: utils.translate_keywords(
                row[translate_column], to_lang=lang, from_lang=row['lang_3']), axis=1)
            tlang2 = time()
            print(f"Processed 'Keywords' for {lang} {tlang2-tlang1} after process start")
        elif translate_column == 'keywords_nlp':
            tlang1 = time()
            db[new_col] = db.apply(lambda row: utils.translate_keywords(
                row[translate_column].split(','), to_lang=lang, from_lang=row['lang_3']), axis=1)
            tlang2 = time()
            print(f"Processed 'Keywords_NLP' for {lang} {tlang2-tlang1} after process start")
        else:
            print(f"Column {translate_column} could not be translated")
    return db

if __name__ == "__main__":
    """
    Is triggered by github action pipeline which runs this script once per language.

    Parameters
    ----------
    LANG_FROM_PIPELINE : string
        Passes in the language abbr. to translate (e.g. de for german)
    """
    tstart = time()
    # Initialize and configure the logger
    logger = logging.getLogger("Scraping log")
    logger.setLevel(logging.INFO)
    fh = logging.FileHandler(config.LOG_FILE, "w", "utf-8")
    fh.setLevel(logging.INFO)
    formatter = logging.Formatter("%(asctime)s - %(name)s - %(filename)s >"
                                  "%(funcName)17s(): Line %(lineno)s - "
                                  "%(levelname)s - %(message)s")
    fh.setFormatter(formatter)
    logger.addHandler(fh)
    # Read language from pipeline variable
    language = os.environ['LANG_FROM_PIPELINE']
    print(f"Translating for ${language}")

    print(f"T1 {time()-tstart} after process start")
    # Load artifact
    preprd_data = pd.read_pickle(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER,'{}_preprd_data/{}_preprd_data.pkl'.format(language)))
    print(preprd_data)
    print(f"T2 {time()-tstart} after process start")


    for trns_col in config.WORKFLOW_TRANSLATE_COLUMNS:
        print(f"TX {time()-tstart} after process start")
        preprd_data = translate_new_data(preprd_data, translate_column=trns_col, languages=[language])
    preprd_data.to_pickle(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER, '{}_translated.pkl'.format(language)))
    preprd_data.to_csv(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER, '{}_translated.csv'.format(language)))

    print("\nNLP translation completed for {}".format(language))
    logger.info("NLP translation completed for {}".format(language))

