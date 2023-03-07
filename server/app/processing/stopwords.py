## Manage stopwords
# Stopwords are excludeded from indexing and ignored in searching. Redis only supplies ENG stopwords by default
# Documentation: https://redis.io/docs/stack/search/reference/stopwords/

STOPWORDS_ENG = ["a", "is", "the", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", "into", "it", "no", "not", "of", "on", "or", "such", "that", "their", "then", "there", "these", "they", "this", "to", "was", "will", "with"]
STOPWORDS_GER = [""]
STOPWORDS_FR = [""]
STOPWORDS_IT = [""]


def get_stopwords():
    return list([*STOPWORDS_ENG, *STOPWORDS_GER, *STOPWORDS_FR, *STOPWORDS_IT])

