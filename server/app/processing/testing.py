import shlex
import re
import pandas as pd
from typing import List


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

fields_to_include = ["OWNER","TITLE", "ABSTRACT", "SERVICETYPE", "SERVICELINK", "KEYWORDS"]
fields_to_output = ["OWNER","TITLE", "SERVICETYPE", "SERVICELINK"]
url_github_repo = "https://github.com/davidoesch/geoservice_harvester_poc/blob/main/data/"
url_github_repo_suffix = "?raw=true"
url_geoservices_CH_csv = "{}geoservices_CH.csv{}".format(url_github_repo,url_github_repo_suffix)

def load_data():
    dataframe = pd.read_csv(url_geoservices_CH_csv, usecols=fields_to_include)
    return dataframe

a = 'road assessment menagment system'
res = split_delimiters(shlex.split(a))

dataframe_some_cols = load_data()
result = dataframe_some_cols[dataframe_some_cols.apply(lambda dataset: dataset.astype(str).str.contains(res[0], case=False).any(), axis=1)]
result =result.fillna("")
search_res = {
    "fields": [],
    "layers": [],
    "statistics": [],}
search_res["layers"] = result.values.tolist()

print(search_res)