"""
title: The ultimate translator for GeoHarvester
Author: Elia Ferrari
Date: 2024-04-29

"""

import logging
import os
import sys
import warnings
import configuration as config
import utils
import pandas as pd
from time import time

warnings.filterwarnings('ignore')
sys.path.insert(0, config.SOURCE_SCRAPER_DIR)



def translate_new_data(db, translate_column, languages):
    """
    Translates the preprocessed data
    """
    tlang1 = time()
    db = db.fillna("nan")
    for lang in languages:
        tlang2 = time()
        logger.info(f"Start processsing new language {lang} {tlang2-tlang1} after process start")
        print(f"Start processsing new language {lang} {tlang2-tlang1} after process start")
        new_col = translate_column+'_'+lang
        if translate_column == 'title':
            db[new_col] = db.apply(lambda row: utils.translate_text(
                row[translate_column],to_lang=lang, from_lang=row['lang_3']), axis=1)
        elif translate_column == 'abstract':
            db[new_col] = db.apply(lambda row: utils.translate_abstract(
                row[translate_column], to_lang=lang, from_lang=row['lang_3']), axis=1)
        elif translate_column == 'keywords':
            db[new_col] = db.apply(lambda row: utils.translate_keywords(
                row[translate_column], to_lang=lang, from_lang=row['lang_3']), axis=1)
        elif translate_column == 'keywords_nlp':
            db[new_col] = db.apply(lambda row: utils.translate_keywords(
                row[translate_column].split(','), to_lang=lang, from_lang=row['lang_3']), axis=1)
        else:
            print(f"Column {translate_column} could not be translated")
    return db


if __name__ == "__main__":
    """
    this function makes cool things happen...

    """
    logger = logging.getLogger("Scraping log")
    logger.setLevel(logging.INFO)
    fh = logging.FileHandler(config.LOG_FILE, "w", "utf-8")
    fh.setLevel(logging.INFO)
    formatter = logging.Formatter("%(asctime)s - %(name)s - %(filename)s >"
                                  "%(funcName)17s(): Line %(lineno)s - "
                                  "%(levelname)s - %(message)s")
    fh.setFormatter(formatter)
    logger.addHandler(fh)

    preprd_data = pd.read_pickle(os.path.join(os.path.split(config.GEOSERVICES_CH_CSV)[0]),
                                 'preprocessed_data.pkl')
    data_to_keep = pd.read_pickle(os.path.join(os.path.split(config.GEOSERVICES_CH_CSV)[0]),
                                 'to_keep.pkl')

    for trns_col in ["title","abstract","keywords","keywords_nlp"]:
        preprd_data = translate_new_data(preprd_data, translate_column=trns_col, languages=['en','de','it','fr'])

    merged_database = pd.concat([data_to_keep, preprd_data], axis=1)
    print(f"Merged database has {len(merged_database.index)} rows, saving to pickle...")
    merged_database.to_pickle(os.path.join(os.path.split(config.GEOSERVICES_CH_CSV)[0],'merged_data.pkl'))

    print("\nNLP translation completed")
    logger.info("NLP translation completed")