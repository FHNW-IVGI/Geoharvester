import re
from typing import List, Union


def split_request_data(query: Union[str, None] = None) -> List[str]:
    """Split the incoming request by delimiter to create a list of terms"""
    word_list = re.split(r',|\s|;', str(query))
    strings_to_remove = [""]

    filtered_word_list = list(filter(lambda string: string not in strings_to_remove, word_list))
    return filtered_word_list