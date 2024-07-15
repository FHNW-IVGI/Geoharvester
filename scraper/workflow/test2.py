import os
import sys

import pandas as pd

sys.path.append('../')
import scraper.configuration as config

if __name__ == "__main__":
    language = os.environ['LANG_FROM_PIPELINE']



    try:    
        dir_list = os.listdir(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER))
        print("2", dir_list)
    finally: 
        print()

    try:
        dir_list = os.listdir(os.path.join(os.getcwd(), config.WORKFLOW_ARTIFACT_FOLDER,f'{language}_preprd_data'))
        print("4", dir_list)
    finally: 
        print()

    print("1", os.path.join(config.WORKFLOW_ARTIFACT_FOLDER,f'{language}_preprd_data.csv'))
    preprd_data = pd.read_csv(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER,f'{language}_preprd_data.csv'))
    print("4", preprd_data)
