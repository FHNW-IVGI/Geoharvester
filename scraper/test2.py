import os
import sys

import configuration as config
import pandas as pd

sys.path.append('../')

if __name__ == "__main__":
    language = os.environ['LANG_FROM_PIPELINE']

    preprd_data = pd.read_csv(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER,f'{language}_preprd_data',f'{language}_preprd_data.csv'))

    print("1", os.path.join(config.WORKFLOW_ARTIFACT_FOLDER,f'{language}_preprd_data',f'{language}_preprd_data.pkl'))

    try:    
        dir_list = os.listdir(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER,f'{language}_preprd_data'))
        print("2", dir_list)
    finally: 
        print()
    try:
        dir_list = os.listdir(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER,f'{language}_preprd_data',f'{language}_preprd_data'))
        print("3", dir_list)
    finally: 
        print()
    try:
        dir_list = os.listdir(os.path.join(os.getcwd(), config.WORKFLOW_ARTIFACT_FOLDER,f'{language}_preprd_data',f'{language}_preprd_data'))
        print("4", dir_list)
    finally: 
        print()

    print("4", preprd_data)
