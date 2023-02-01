import translators as ts
import numpy as np
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity

def translate(phrase):
    """
    Test function for language tranlsation with google translate!
    """
    ph_de = ts.translate_text(phrase, translator='google', from_language='auto', to_language='de')
    ph_fr = ts.translate_text(phrase, translator='google',from_language='auto', to_language='fr')
    ph_it = ts.translate_text(phrase, translator='google',from_language='auto', to_language='it')
    print(ph_de+'\n', ph_fr+'\n', ph_it+'\n')


# TODO: Create function to rank the results based on TITLE, ABSTRACT and KEYWORDS
def rank_results_TFIDF(text):
    # Tokenize the text into sentences
    sentences = sent_tokenize(text)

    # Tokenize each sentence into words
    words = [word_tokenize(sentence) for sentence in sentences]

    # Remove stop words and perform stemming (or lemmatization) to normalize the text
    stop_words = set(stopwords.words("english")) # or german / french / italian
    stemmer = PorterStemmer()
    words = [[stemmer.stem(word.lower()) for word in sentence if word.lower() not in stop_words] for sentence in words]

    # Calculate the TF-IDF (also BM25 possible) score for each word in order to rank them
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform([" ".join(sentence) for sentence in words])

    # Rank the words based on their TF-IDF scores
    scores = zip(vectorizer.get_feature_names_out(),
                 np.asarray(X.sum(axis=0)).ravel())
    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)

    return sorted_scores



def rank_results_LSI(documents, query):
    """
    Calculate LSI for the document and compare it to the query!

    """
    # Convert documents and query to a matrix representation using TF-IDF
    tfidf_vectorizer = TfidfVectorizer()
    documents_matrix = tfidf_vectorizer.fit_transform(documents)
    query_matrix = tfidf_vectorizer.transform([query])
    
    # Perform LSI on the document matrix
    svd = TruncatedSVD(n_components=100)
    lsi_matrix = svd.fit_transform(documents_matrix)
    
    # Compute cosine similarity between the query and each document in the LSI space
    similarity = cosine_similarity(query_matrix, lsi_matrix)
    
    # Rank the documents based on their similarity scores
    ranked_indices = similarity.argsort()[0][::-1]
    
    return [documents[i] for i in ranked_indices]
