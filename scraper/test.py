
import os

import configuration as config
import pandas as pd

if __name__ == "__main__":
    sources = pd.read_csv(config.SOURCE_COLLECTION_CSV)
    for lang in ['de', 'en', 'it', 'fr']:
        sources.to_csv(os.path.join(config.WORKFLOW_ARTIFACT_FOLDER,'{}_preprd_data.csv'.format(lang)))


