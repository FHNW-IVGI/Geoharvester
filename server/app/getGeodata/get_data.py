"""Imports."""
import re
from typing import Union

import pandas as pd
from fastapi import APIRouter, Depends

from ..constants import url_geoservices_CH_csv

# url_github_repo = "https://github.com/davidoesch/geoservice_harvester_poc/blob/main/data/"
# url_github_repo_suffix = "?raw=true"

# url_geoservices_CH_csv = "{}geoservices_CH.csv{}".format(url_github_repo, url_github_repo_suffix)

router = APIRouter(
        # dependencies=[Depends(url_geoservices_CH_csv)],

)

@router.get("/getData")
async def get_data(query: Union[str, None] = None):
    """Get Data route"""

    # Which columns of the csv to use (enhances performance):
    columns_to_use = ["OWNER","TITLE", "ABSTRACT"]
    df_geoservices = pd.read_csv(url_geoservices_CH_csv, usecols=columns_to_use)
    payload = df_geoservices.head(20)

    regex = re.split(r',|!|;', str(query))

    print(payload)
    return {"data": payload}
