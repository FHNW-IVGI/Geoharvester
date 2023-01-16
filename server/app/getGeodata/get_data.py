"""Imports."""
from typing import Union

from fastapi import APIRouter, Depends

from .methods import load_data, search_by_terms, split_search_string

router = APIRouter()

@router.get("/getData")
async def get_data(query: Union[str, None] = None):
    """Route for the get_data request (search by terms)"""

    if (query == None):
        return {"data": ""}

    word_list = split_search_string(query)

    dataframe_some_cols = load_data()

    search_result = search_by_terms(word_list, dataframe_some_cols)


    payload = search_result

    print(payload)
    return {"data": payload}
