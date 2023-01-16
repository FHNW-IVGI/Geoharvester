"""Imports."""
from typing import Union

import pandas as pd
from fastapi import APIRouter, Depends

from ..constants import url_geoservices_CH_csv
from .methods import split_request_data

router = APIRouter()

@router.get("/getData")
async def get_data(query: Union[str, None] = None):
    """Route for the get_data request (search by terms)"""

    word_list = split_request_data(query)

    # Which columns of the csv to use (enhances performance):
    columns_to_use = ["OWNER","TITLE", "ABSTRACT"]
    df_geoservices = pd.read_csv(url_geoservices_CH_csv, usecols=columns_to_use)
    payload = word_list
    # payload = df_geoservices.head(20)


    print(payload)
    return {"data": payload}
