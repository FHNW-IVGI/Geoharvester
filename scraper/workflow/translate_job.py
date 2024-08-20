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


def translate_new_data(db, translate_column, languages, one_shot=True):
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
    one_shot : bool
        if true, it will translate all the data in one shot

    Output 
    ----------
    <language_abbr>_translated.pkl : pickle
        Outputs a pickle file of the translation which is uploaded as artifact to github
    """

    # TODO: process the one shot translation in language chunks (datasets can have different languages)

    db = db.fillna("nan")
    for lang in languages:
        new_col = translate_column+'_'+lang
        if not one_shot:
            if translate_column == 'title':
                tlang1 = time()
                db[new_col] = db.apply(lambda row: utils.translate_text(
                    row[translate_column],to_lang=lang, from_lang=row['lang_3']), axis=1)
                tlang2 = time()
                print(f"Processed 'Title' in {lang} {round(tlang2-tlang1)} s'")
            elif translate_column == 'abstract':
                tlang1 = time()
                db[new_col] = db.apply(lambda row: utils.translate_abstract(
                    row[translate_column], to_lang=lang, from_lang=row['lang_3']), axis=1)
                tlang2 = time()
                print(f"Processed 'Abstract' in {lang} {round(tlang2-tlang1)} s'")
            elif translate_column == 'keywords':
                tlang1 = time()
                db[new_col] = db.apply(lambda row: utils.translate_keywords(
                    row[translate_column], to_lang=lang, from_lang=row['lang_3']), axis=1)
                tlang2 = time()
                print(f"Processed 'Keywords' in {lang} {round(tlang2-tlang1)} s'")
            elif translate_column == 'keywords_nlp':
                tlang1 = time()
                db[new_col] = db.apply(lambda row: utils.translate_keywords(
                    row[translate_column].split(','), to_lang=lang, from_lang=row['lang_3']), axis=1)
                tlang2 = time()
                print(f"Processed 'Keywords_NLP' in {lang} {round(tlang2-tlang1)} s'")
            else:
                print(f"Column {translate_column} could not be translated")
        else:
            separator = ' | '
            chunk_size = 200
            for i in range(int(len(db)/chunk_size)+1):
                while utils.check_length_text(separator.join(db[i*chunk_size:chunk_size*(i+1)][translate_column].to_list())):
                    chunk_size = int(chunk_size/2)
            print(f"Set chunk size to {chunk_size}")

            translated_chunks = []
            for i in range(int(len(db)/chunk_size)+1):
                if db[i*chunk_size:chunk_size*(i+1)][translate_column].empty:
                    continue
                col_oncie = separator.join(db[i*chunk_size:chunk_size*(i+1)][translate_column].to_list())
                if translate_column == 'title':
                    tlang1 = time()
                    title_oncie_trnsd = utils.translate_text(col_oncie.replace('_',' '), to_lang=lang, from_lang='NAN')

                    if len(col_oncie.split(separator)) != len(title_oncie_trnsd.split(separator)):
                        print(col_oncie)
                        print(title_oncie_trnsd)
                        print('--')
                    
                    translated_chunks.extend(title_oncie_trnsd.split(separator))
                    tlang2 = time()
                    # print(f"Processed 'Title' in {lang} {round(tlang2-tlang1)} s'")
                elif translate_column == 'abstract':
                    tlang1 = time()
                    db[new_col] = db.apply(lambda row: utils.translate_abstract(
                        row[translate_column], to_lang=lang, from_lang=row['lang_3']), axis=1)
                    tlang2 = time()
                    # print(f"Processed 'Abstract' in {lang} {round(tlang2-tlang1)} s'")
                elif translate_column == 'keywords':
                    tlang1 = time()
                    keywords_oncie_trnsd = utils.translate_keywords(col_oncie, to_lang=lang, from_lang='NAN')
                    translated_chunks.extend(keywords_oncie_trnsd.split(separator))
                    tlang2 = time()
                    # print(f"Processed 'Keywords' in {lang} {round(tlang2-tlang1)} s'")
                elif translate_column == 'keywords_nlp':
                    tlang1 = time()
                    keywords_nlp_oncie_trnsd = utils.translate_keywords(col_oncie, to_lang=lang, from_lang='NAN')
                    translated_chunks.extend(keywords_nlp_oncie_trnsd.split(separator))
                    tlang2 = time()
                    # print(f"Processed 'Keywords_NLP' in {lang} {round(tlang2-tlang1)} s'")
                else:
                    print(f"Column {translate_column} could not be translated")
            if not translate_column == 'abstract':
                db[new_col] = translated_chunks
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

    preprd_data = pd.read_pickle(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER,f'{language}_preprd_data.pkl'))

    for trns_col in config.WORKFLOW_TRANSLATE_COLUMNS:
        print(f"Start translating {trns_col} {round(time()-tstart)}s after process start")
        preprd_data = translate_new_data(preprd_data, translate_column=trns_col, languages=[language], one_shot=True)
    preprd_data.to_pickle(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER, '{}_translated.pkl'.format(language)))
    preprd_data.to_csv(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER, '{}_translated.csv'.format(language)))

    print("\nNLP translation completed for {}".format(language))

