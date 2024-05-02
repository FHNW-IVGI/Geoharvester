

    # merged_database = pd.concat([data_to_keep, preprd_data], axis=1)
    # print(f"Merged database has {len(merged_database.index)} rows, saving to pickle...")
    # logger.info(f"Merged database has {len(merged_database.index)} rows, saving to pickle...")

import logging
import os
import sys
import warnings
from time import time

import pandas as pd

sys.path.append('../')

import scraper.configuration as config
import scraper.utils as utils


def merge_with_data_to_keep(translated_data):
    data_to_keep = pd.read_pickle(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER,'data_to_keep.pkl'))
    merged_database = pd.concat([data_to_keep, translated_data], axis=1)
    print(f"Merged database has {len(merged_database.index)} rows, saving to pickle...")
    merged_database.to_pickle(os.path.join(os.path.split(config.GEOSERVICES_CH_CSV)[0],'merged_data.pkl'))
    print("\nNLP translation completed")
    logger.info("NLP translation completed")



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
    print(f"current dir: {current_working_directory}")

    lang_found = []
    # Detect pickle files for languages dynamically
    for lang in config.WORKFLOW_TRANSLATE_LANGUAGES:
        file_path = os.path.join(config.WORKFLOW_ARTIFACT_FOLDER, '{}_translated.pkl'.format(lang))
        if os.path.exists(file_path):
            lang_found.append(lang)

    # Process and merge files
    if len(lang_found) < 1:
        print(f"Merge not possible, {lang_found} languages found" )

    if len(lang_found) == 1:
        df1 = pd.read_pickle(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER,  '{}_translated.pkl'.format(lang)))
        merge_with_data_to_keep(df1)

    if len(lang_found) > 1:
        df1 = pd.read_pickle(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER,  '{}_translated.pkl'.format(lang_found[0])))
        for lang in lang_found[1:]: # start from the second language
            translated_columns_to_add = [col_name + "_" + lang for col_name in config.WORKFLOW_TRANSLATE_COLUMNS]
            df2 = pd.read_pickle(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER,  '{}_translated.pkl'.format(lang)))
            df1 = df1.merge(df2[translated_columns_to_add], on=config.WORKFLOW_MERGE_COLUMNS)
        merge_with_data_to_keep(df1)
