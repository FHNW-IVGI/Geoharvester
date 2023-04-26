import numpy as np
import pandas as pd
from langdetect import detect
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity

def detect_language(phrase):
    """
    Test function for language detection!
    """
    language_dict = {'en': 'english', 'fr': 'french', 'de': 'german', 'it': 'italian'}
    try:
        lang = language_dict[detect(phrase)]
    except:
        lang = 'english'
    return lang


# TODO: Test the functions to rank the results based on TITLE, ABSTRACT and KEYWORDS
def ranking_tfidf(text, out_dataframe=False):
    """
    Testing fuction to create a TFIDF score (requires to download the nltk data packages!)
    ** Formula: score(D, T) = termFrequency(D, T) * log(N / docFrequency(T))
    ** Automatic detection of the language
    ** Return momentarily a touple [(word, TFIDF score)],   or a pandas dataframe
    """
    # Detect the language of the text
    lang = detect_language(text)
    # Tokenize the text into sentences
    sentences = sent_tokenize(text, language=lang)

    # Tokenize each sentence into words
    words = [word_tokenize(sentence, language=lang) for sentence in sentences]

    # Remove stop words and perform stemming to normalize the text
    stop_words = set(stopwords.words(lang))
    stemmer = PorterStemmer()
    words = [[stemmer.stem(word.lower())
        for word in sentence if word.lower() not in stop_words] for sentence in words]

    # Calculate the TF-IDF (improvement with BM25 possible) score for each word to rank them
    vectorizer = TfidfVectorizer()
    vect = vectorizer.fit_transform([" ".join(sentence) for sentence in words])

    # Rank the words based on their TF-IDF scores
    scores = zip(vectorizer.get_feature_names_out(),
                 np.around(np.asarray(vect.sum(axis=0)).ravel(), decimals=2))
    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
    df_ranking = pd.DataFrame(sorted_scores, columns=['word', 'tfidf'])

    if out_dataframe:
        return df_ranking
    else:
        return (sorted_scores, lang)



def rank_results_lsi(document, query):
    """
    Calculate LSI for the document and compare it to the query!

    """
    # Convert documents and query to a matrix representation using TF-IDF
    tfidf_vectorizer = TfidfVectorizer()
    sentences = sent_tokenize(document, language = 'german')
    words = [word_tokenize(sentence, language='german') for sentence in sentences]
    documents_matrix = tfidf_vectorizer.fit_transform(words)
    query_matrix = tfidf_vectorizer.fit_transform(query)
    # Perform LSI on the document matrix
    svd = TruncatedSVD(n_components=len(words))
    lsi_matrix = svd.fit_transform(documents_matrix)
    # Compute cosine similarity between the query and each document in the LSI space
    similarity = cosine_similarity(query_matrix, lsi_matrix)
    # Rank the documents based on their similarity scores
    ranked_indices = similarity.argsort()[0][::-1]
    return [document[i] for i in ranked_indices]
