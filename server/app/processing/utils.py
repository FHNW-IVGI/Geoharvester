"""
Work in progress
"""

from string import punctuation
import numpy as np
import pandas as pd
import spacy
import re
import matplotlib.pyplot as plt
from langdetect import detect
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize, RegexpTokenizer
from nltk.stem import SnowballStemmer, PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from rake_nltk import Rake
from scipy import sparse
from gensim import corpora
from gensim.models import LsiModel
from gensim.models.coherencemodel import CoherenceModel




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

def stemming_sentence(sentence, output_list=True):
    # WARNING The stemming and cleansing process is computationally expensive! (1421 lines in 36 s)
    """
    sentences is a list of sentences [str, str]
    """
    lang = detect_language(sentence)
    stemmer = SnowballStemmer(lang)
    words = (word_tokenize(sentence, language= lang))
    stop_words = stopwords.words(lang)
    words_cleaned_list = [stemmer.stem(word.lower()) for word in words if word.lower() not in stop_words
                    and word.lower() not in list(punctuation)]
    if output_list:
        return words_cleaned_list
    else:
        return [' '.join(word) for word in [words_cleaned_list]][0]

def tokenize_abstract(text, output_scores=True):
    """
    text is a str, which is tokenized and stemmed,
    returning a pandas with the words and the scores
    """
    ranker = TfidfVectorizer(norm='l2')
    sentences = sent_tokenize(text, language=detect_language(text))
    negative_sentences = {'english':'not contained', 'german':'nicht enthalten',
                        'italian':'non contenuti', 'french':'non contenu'}
    # WARNING: The removal needs to be tested on the whole dataset, possible further negative forms could be contained!
    sentences_cleaned = [stemming_sentence(sentence, output_list=True) for sentence in sentences
                        if negative_sentences[detect_language(sentence)] not in sentence.lower()]
    if output_scores:
        vector = ranker.fit_transform(' '.join(words) for words in sentences_cleaned)
        scores = zip(ranker.get_feature_names_out(),
                    np.around(np.asarray(vector.sum(axis=0)).ravel(), decimals=2))
        output = pd.DataFrame(sorted(scores, key=lambda x: x[1], reverse=True), columns=['word', 'tfidf'])
    else:
        output = [stemming_sentence(sentence, output_list=False) for sentence in sentences
                        if negative_sentences[detect_language(sentence)] not in sentence.lower()]
    return output



class TFIDF_BM25():
    """
    Class for the extraction ranking of keywords in a text,
    with an additional function to search a query in the database.
    """
    def __init__(self, b=0.75, k1=1.6, avd1=0.1) -> None:
        self.vectorizer = TfidfVectorizer(norm=None, smooth_idf=False)
        self.b = b
        self.k1 = k1
        self.avd1 = avd1
        self.abstracts, self.results = [], []
        self.index = np.array([])

    def cleansing_ranking(self, texts, column='ABSTRACT') -> None:
        # TODO: We could integrate the cleaned results into the database with an additional column "keywords+"
        """
        texts is a pandas DF with at least a non empty "ABSTRACT" column
        """
        self.index = texts.index.values
        self.results = [tokenize_abstract(text) for text in texts[column].values.tolist()]
    
    def fit(self) -> None:
        """
        Texts is a list of pandas from cleansing_ranking.
        """
        self.abstracts = [' '.join(abstract['word'].tolist()) for abstract in self.results]
        self.vectorizer.fit(self.abstracts)
        score = super(TfidfVectorizer, self.vectorizer).transform(self.abstracts)
        self.avd1 = score.sum(1).mean()
    
    def search(self, q):
        """
        q is a str with a query (single word or multiple words)
        """
        # FIXME: If the query contains more than one word, the abstract must contain all the words to be considered! (bug or feature)
        document = super(TfidfVectorizer, self.vectorizer).transform(self.abstracts)
        doc_lenght = document.sum(1).A1
        query_cleaned = stemming_sentence(q)
        query, = super(TfidfVectorizer, self.vectorizer).transform([' '.join(word) for word in [query_cleaned]])
        assert sparse.isspmatrix_csr(query)

        document = document.tocsc()[:, query.indices]
        # denom = document + (self.k1 * (1 - self.b + self.b * doc_lenght / self.avd1))[:, None]
        idf = self.vectorizer._tfidf.idf_[None, query.indices] - 1.
        # numer = document.multiply(np.broadcast_to(idf, document.shape)) * (self.k1 + 1)
        scores = (document.multiply(np.broadcast_to(idf, document.shape)) * (self.k1 + 1)/
                document + (self.k1 * (1 - self.b + self.b * doc_lenght / self.avd1))[:, None]).sum(1).A1
        scores_idx = [self.index[i] for i in range(0, len(scores)) if scores[i] > 0]
        return scores_idx


class KeywordsRake():
    """
    Keywords ranking with Rake
    """
    def __init__(self) -> None:
        self.keywords = []

    def rake_keywords(self, text, score=False, keyword_length = 3):
        text = re.sub(str([punctuation]), ' ', text) # Remove the punctuation
        rake_nltk = Rake(language=detect_language(text), include_repeated_phrases=False, max_length=keyword_length)
        rake_nltk.extract_keywords_from_text(text)
        if score:
            keywords = rake_nltk.get_ranked_phrases_with_scores()# limit by score (not normalized) using TFIDF
        else:
            keywords = rake_nltk.get_ranked_phrases()# limit by number of results [:5]
        return keywords
        
    def extract_keywords(self, texts, column='ABSTRACT', keyword_length=3, score=False):
        self.index = texts.index.values
        self.keywords = [self.rake_keywords(text, score=score, keyword_length=keyword_length)
                        for text in texts[column].values.tolist()]
        return self.keywords


class NLP_spacy():
    """
    Keywords ranking with NLP models of spacy.
    Do not remove punctuation, it is needed for the context extraction in NLP.
    """
    def __init__(self) -> None:
        """
        Diverese models are available on https://spacy.io/models/en
        sm = small 15MB, md = middle 45MB, lg = large 500MB
        """
        self.nlp_en = spacy.load("en_core_web_sm")
        self.nlp_fr = spacy.load("fr_core_news_sm")
        self.nlp_de = spacy.load("de_core_news_sm")
        self.nlp_it = spacy.load("it_core_news_sm")

    def fit_nlp(self, text) -> list:
        lang = detect_language(text)
        if lang == 'english':
            keywords = self.nlp_en(text).ents
        elif lang == 'german':
            keywords = self.nlp_de(text).ents
        elif lang == 'french':
            keywords = self.nlp_fr(text).ents
        elif lang == 'italian':
            keywords = self.nlp_it(text).ents
        else:
            print("The language model is not implemented for " + lang)
            keywords = []
        return list(keywords)


    def extract_keywords(self, texts, column='ABSTRACT') -> list:
        self.index = texts.index.values
        keywords = [self.fit_nlp(text) for text in texts[column].values.tolist()]
        return keywords


# TODO implement NLP with clustering to divide the abstracts into topics


# FIXME: The text input must be a list of words not a list of sentences!!
# https://www.datacamp.com/tutorial/discovering-hidden-topics-python
class LSI():
    """
    ...
    """
    def __init__(self) -> None:
        self.abstracts_tokenized = []
        self.coherence_values = []
        self.model_list = []

    def preprocess(self, texts, column='ABSTRACT'):
        self.index = texts.index.values
        self.abstracts_tokenized = [tokenize_abstract(text, output_scores=False) for text in texts[column].values.tolist()]
        #return self.abstracts_tokenized

    def prepare_matrix(self):
        """
        Prepares the text, creating a document-term matrix and
        a dictionary of terms to read the values in the matrix
        """
        dictionary = corpora.Dictionary(self.abstracts_tokenized)
        doc_term_matrix = [dictionary.doc2bow(abstract) for abstract in self.abstracts_tokenized]
        return dictionary, doc_term_matrix

    def create_gensim_lsa_model(self, number_of_topics, number_of_words):
        """
        Generates a model using LSA
        """
        dictionary, doc_term_matrix = self.prepare_matrix()
        # Generate LAS model with training data
        lsamodel = LsiModel(doc_term_matrix, num_topics=number_of_topics, id2word=dictionary)
        print(lsamodel.print_topics(num_topics=number_of_topics, num_words=number_of_words))
        return lsamodel

    def plot_graph(self, min, max, step):
        x = range(min, max, step)
        plt.plot(x, self.coherence_values)
        plt.xlabel("Number of topics")
        plt.ylabel("Coherence score")
        # plt.legend(("coherence_values"), loc="best")
        plt.show();

    def compute_coherence_values(self, min_max_step):
        """
        Computes the optimal number of topics
        """
        dictionary, doc_term_matrix = self.prepare_matrix()
        for num_topics in range(min_max_step[0], min_max_step[1], min_max_step[2]):
            model = LsiModel(doc_term_matrix, num_topics=num_topics, id2word= dictionary)
            self.model_list.append(model)
            coherencemodel = CoherenceModel(model=model, texts=self.abstracts_tokenized, dictionary=dictionary, coherence='c_v')
            self.coherence_values.append(coherencemodel.get_coherence())
        self.plot_graph(min_max_step[0], min_max_step[1], min_max_step[2])


