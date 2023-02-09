import re
import shlex
from typing import List

import pandas as pd

from ..constants import fields_to_output


def import_csv_into_dataframe(url, usecols=None):
    """Load csv into data frame"""
    if(usecols):
        dataframe = pd.read_csv(url, usecols=usecols)
    else: 
        dataframe = pd.read_csv(url)
    return dataframe


def split_search_string(query: str) -> List[str]:
    """Split the incoming request by delimiter to create a list of terms"""
    # Do splitting
    word_list_with_delimiters = shlex.split(query)

    def split_delimiters(word_list_with_delimiters: List[str]) -> List[str]:
        """Take care of left over delimiters, split strings even if in qoutes
           Return a list of words """
        delimiters = [";", ","]

        new_word_list = []

        for word in word_list_with_delimiters:
            if (any(delimiter in word for delimiter in delimiters)):
                splitted_words = re.split(r',|;', word)
                for splitted_word_ in splitted_words:
                    new_word_list.append(splitted_word_)
            else:
                new_word_list.append(word)
        return new_word_list

    # Also split terms with delimiters
    word_list_without_delimiters = split_delimiters(word_list_with_delimiters)

    # Filter out blanks and other leftovers:
    strings_to_remove = [""]
    filtered_word_list = list(filter(lambda string: string not in strings_to_remove, word_list_without_delimiters))

    # Trim whitespaces of terms which may originate from splitting:
    trimmed_word_list = list(map(lambda string: string.strip(), filtered_word_list))

    return trimmed_word_list


def search_by_terms_dataframe(word_list: List[str], dataframe):
    """Search the geodata collection based on the search terms
       Return layers and count per term"""

    search_result = {
        "fields": [],
        "layers": [],
        "statistics": [],
    }


    for term in word_list:
        result = dataframe[dataframe.apply(lambda dataset: dataset.astype(str).str.contains(term, case=False).any(), axis=1)]

        result_without_nan = result.fillna("")
        truncated_dataframe = result_without_nan[fields_to_output]
        search_result["layers"] = truncated_dataframe.values.tolist()
        search_result["fields"] = truncated_dataframe.columns.tolist()

        search_result["statistics"].append({
            "term": term,
            "count": len(result_without_nan),
        })
    
    return search_result

def search_by_terms_database(word_list: List[str], redis):
    """Search the database based on the search terms
       Return layers and count per term"""
    return