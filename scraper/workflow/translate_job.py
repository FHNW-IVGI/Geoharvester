import logging
import os
import sys
import warnings
from time import time

import pandas as pd

sys.path.append('../')


import scraper.configuration as config
import scraper.utils as utils

# globals
# warnings.filterwarnings('ignore')
# sys.path.insert(0, config.SOURCE_SCRAPER_DIR)



def translate_new_data(db, translate_column, languages):
    """
    Translates the preprocessed data
    """
    tlang1 = time()
    db = db.fillna("nan")
    for lang in languages:
        tlang2 = time()
        # logger.info(f"Start processsing new language {lang} {tlang2-tlang1} after process start")
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
    current_working_directory = os.getcwd()

    print(f"dir{current_working_directory}")

    preprd_data = pd.read_pickle(os.path.join("data",'preprd_data.pkl'))

    # Load preprd data from artifact

    for trns_col in ["title","abstract","keywords","keywords_nlp"]:
        preprd_data = translate_new_data(preprd_data, translate_column=trns_col, languages=['en','de','it','fr'])


    print("\nNLP translation completed1")
    logger.info("NLP translation completed")