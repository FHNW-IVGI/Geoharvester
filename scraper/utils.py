"""
Utilities for the elaboration of texts with NLP and TF-IDF
"""

import itertools
import os
import sys
from string import punctuation

import matplotlib.pyplot as plt
import numpy as np  # >= 1.23 < 1.26
import openai  # 0.27.0
import pandas as pd  # 1.5.2
import pyLDAvis.gensim_models as genvis  # 3.4.0
import spacy  # 3.3.1 and spacy-legacy 3.0.12 + pretrained models
# import translators as ts  # 5.5.6
from deep_translator import GoogleTranslator, exceptions
from dotenv import load_dotenv
from gensim import corpora  # gensim 4.3.0
from gensim.models import LsiModel
from gensim.models.coherencemodel import CoherenceModel
from gensim.models.ldamodel import LdaModel
from langdetect import detect  # 1.0.9
from nltk.corpus import stopwords  # nltk 3.7
from nltk.stem import PorterStemmer, SnowballStemmer
from nltk.tokenize import sent_tokenize, word_tokenize
from rake_nltk import Rake  # 1.0.6
from scipy import sparse  # 1.9.3
from sklearn.feature_extraction.text import \
    TfidfVectorizer  # scikit-learn 1.2.0
from summarizer.sbert import \
    SBertSummarizer  # bert-extractive-summarizer 0.10.1
from tqdm import tqdm

load_dotenv(dotenv_path=sys.path[0]+"/translator.env")
chatgpt_api_key = os.getenv("OPENAI_API_KEY")

def progress(token):
    """
    Allows to use the progress bar.
    """
    return token

def detect_language(phrase, not_found=False):
    """
    Detects the language of a str using langdetect.

    Parameters
    ----------
    phrase : str
        String element to be elaborated
    Returns
    -------
    _ : str
        Detected language.
    """
    if not_found:
        exception = 'not_found'
    else:
        exception = 'english'
    language_dict = {'en': 'english', 'fr': 'french', 'de': 'german', 'it': 'italian'}
    try:
        lang = language_dict[detect(phrase)]
    except:
        lang = exception
    return lang

def translate_text(text, to_lang, from_lang):
    """
    Translate title column
    """
    language_dict = {'ENG':'en', 'FRA':'fr', 'DEU':'de', 'ITA':'it','NAN':'na'}
    if language_dict[from_lang] == to_lang:
        return text
    else:
        try:
            trnd = GoogleTranslator(source='auto', target=to_lang).translate(text.replace('_',' '))
            trnd = trnd.replace("'", " ")
        except exceptions.TranslationNotFound:
            trnd = 'nan'
        return trnd

def translate_abstract(text, to_lang, from_lang):
    """
    Translate abstract column
    """
    language_dict = {'ENG':'en', 'FRA':'fr', 'DEU':'de', 'ITA':'it','NAN':'na'}
    if to_lang != language_dict[from_lang] and text != 'nan':
        if not text.startswith('http') or text.startswith('Link zu Metadaten:'):
            try:
                trnd = GoogleTranslator(source='auto', target=to_lang).translate(text.replace('_',' '))
                trnd = trnd.replace("'", " ")
            except exceptions.TranslationNotFound:
                trnd = 'nan'
            return trnd
        else:
            return 'nan'
    else:
        return text
def translate_keywords(text, to_lang, from_lang):
    """
    Translate keywords column und keywords_nlp column
    """
    if type(text) == str:
        text = [text]
    kwds, kwds_one = [], []
    language_dict = {'ENG':'en', 'FRA':'fr', 'DEU':'de', 'ITA':'it','NAN':'na'}
    for kwd in text:
        if kwd != 'nan' and kwd != '':
            if not kwd.startswith('http') or not kwd.startswith('Link zu Metadaten:'):
                kwds_one.append(kwd)
            else:
                kwds_one.append('nan')
        else:
            kwds_one.append('nan')
        if language_dict[from_lang] != to_lang:
            try:
                kwd_trnsd = GoogleTranslator(source='auto', target=to_lang).translate(';'.join(kwds_one).replace('_',' '))
                if not kwd_trnsd:
                    kwd_trnsd = 'nan'
                kwd_trnsd = kwd_trnsd.replace("'", " ")
            except exceptions.TranslationNotFound:
                kwd_trnsd = 'nan'
            kwds = kwd_trnsd.split(';')
        else:
            kwds = kwds_one
    return ','.join(kwds)
    
def is_not_num(str) -> bool:
    """
    Tests if a str element contains a number and return True or False.
    
    Parameters
    ----------
    str : str
          String element to be checked
    Returns
    -------
    _ : False if numeric / True if text
    """
    try:
        float(str)
        return False
    except ValueError:
        return True
    
def check_length_text(text, min_length=4500):
    """
    Tests if a str element contains a number and return True or False.
    
    Parameters
    ----------
    text : str
          String element to be checked
    Returns
    -------
    _ : False if shorter / True if longer
    """
    if len(text) > min_length:
        return True
    else:
        return False

def stemming_sentence(sentence, stem_words = True):
    """
    Stems and cleans the words in a sentence returning a list
    of cleaned words.

    Parameters
    ----------
    sentence : [str, str]
        List of str to be stemmed
    stem_words : bool
        In addition to words cleaning apply stemming.
    Returns
    -------
    _ : list
    """
    lang = detect_language(sentence)
    stemmer = SnowballStemmer(lang)
    words = (word_tokenize(sentence, language= lang))
    stop_words = stopwords.words(lang)
    if stem_words:
        words_cleaned_list = [stemmer.stem(word.lower()) for word in words if word.lower() not in stop_words
                        and word.lower() not in list(punctuation) and is_not_num(word)]
    else:
        words_cleaned_list = [word.lower() for word in words if word.lower() not in stop_words
                              and word.lower() not in list(punctuation) and is_not_num(word)]
    return words_cleaned_list

def tokenize_abstract(text, output_scores=True, stem_words=True):
    """
    Tokenizes, cleans and stems a text returning a list or a pandas dataframe.

    Parameters
    ----------
    text : str
        Text to be tokenized
    output_scores : bool
        Output words and word's importance score as pandas dataframe, otherwise
        it outputs a list of words ordered by score.
    stem_words : bool
        In addition to words cleaning apply stemming.
    Returns
    -------
    _ : list or pandas.dataframe
    """
    ranker = TfidfVectorizer(norm='l2')
    sentences = sent_tokenize(text, language=detect_language(text))
    negative_sentences = {'english':'not contained', 'german':'nicht enthalten',
                        'italian':'non contenuti', 'french':'non contenu'}
    sentences_cleaned = [stemming_sentence(sentence, stem_words=stem_words) for sentence in sentences
                        if negative_sentences[detect_language(sentence)] not in sentence.lower()]
    if output_scores:
        vector = ranker.fit_transform(' '.join(words) for words in sentences_cleaned)
        scores = zip(ranker.get_feature_names_out(),
                    np.around(np.asarray(vector.sum(axis=0)).ravel(), decimals=2))
        output = pd.DataFrame(sorted(scores, key=lambda x: x[1], reverse=True), columns=['word', 'tfidf'])
    else:
        output = [stemming_sentence(sentence) for sentence in sentences
                        if negative_sentences[detect_language(sentence)] not in sentence.lower()]
        output = list(itertools.chain.from_iterable(output))
    return output



class TFIDF_BM25():
    """
    This class contains all the functions for keyword extraction and search with TF-IDF and BM25.
    https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html
    """
    def __init__(self, b=0.75, k1=1.6, avd1=0.1) -> None:
        self.vectorizer = TfidfVectorizer(norm=None, smooth_idf=False)
        self.b = b
        self.k1 = k1
        self.avd1 = avd1
        self.abstracts, self.results = [], []
        self.index = np.array([])

    def cleansing_ranking(self, texts, column='abstract') -> None:
        """
        It saves the index of the pandas.dataframe and apply the tokenize function to one column.
        
        Parameters
        ----------
        texts : pandas.dataframe
            Dataframe with a text column
        column : str
            name of the text column, default "abstract"
        
        """
        self.index = texts.index.values
        self.results = [tokenize_abstract(text) for text in texts[column].values.tolist()]
    
    def fit(self) -> None:
        """
        Fits a TF-IDF vector to the resulting data from cleansing_ranking function.
        """
        self.abstracts = [' '.join(abstract['word'].tolist()) for abstract in self.results]
        self.vectorizer.fit(self.abstracts)
        score = super(TfidfVectorizer, self.vectorizer).transform(self.abstracts)
        self.avd1 = score.sum(1).mean()
    
    def search(self, q):
        """
        Uses the best match 25 method to execute a query on the fitted dataset.

        Parameters
        ----------
        q : str
            Query text.
        Returns
        -------
        _ : list, list
            Index of the dataset with positive score and the score list
        """
        document = super(TfidfVectorizer, self.vectorizer).transform(self.abstracts)
        doc_length = document.sum(1).A1
        query_cleaned = stemming_sentence(q)
        query, = super(TfidfVectorizer, self.vectorizer).transform([' '.join(word) for word in [query_cleaned]])
        assert sparse.isspmatrix_csr(query)

        document = document.tocsc()[:, query.indices]
        # denom = document + (self.k1 * (1 - self.b + self.b * doc_length / self.avd1))[:, None]
        idf = self.vectorizer._tfidf.idf_[None, query.indices] - 1.
        # numer = document.multiply(np.broadcast_to(idf, document.shape)) * (self.k1 + 1)
        scores = (document.multiply(np.broadcast_to(idf, document.shape)) * (self.k1 + 1)/
                document + (self.k1 * (1 - self.b + self.b * doc_length / self.avd1))[:, None]).sum(1).A1
        scores = [round(score, 2) for score in scores if score != 0.0 and not np.isnan(score)]
        scores_idx = [self.index[i] for i in range(0, len(scores)) if scores[i] > 0]
        return scores_idx, scores


class LSI_LDA():
    """
    The class contains all the functions to summarize the text with Latent Semantic Analysis
    and Latent Dirchlet Allocation.
    https://www.datacamp.com/tutorial/discovering-hidden-topics-python
    """
    def __init__(self) -> None:
        self.abstracts_tokenized = []
        self.coherence_values = []
        self.model_list = []

    def preprocess(self, texts, column='abstract'):
        """
        Preprocess a set of texts in a pandas dataframe cleaning and tokenizing the texts.

        Parameters
        ----------
        texts : pandas.dataframe
            Dataframe with a text column
        column : str
            name of the text column, default "abstract"
        Returns
        -------
        _ : [list, list]
            List of lists containing the elaborated words.
        """
        self.index = texts.index.values
        self.abstracts_tokenized = [tokenize_abstract(text, output_scores=False, stem_words=False) 
                                    for text in texts[column].values.tolist()]
        return self.abstracts_tokenized

    def prepare_matrix(self):
        """
        Prepares the text, creating a document-term matrix and
        a dictionary of terms to read the values in the matrix.

        Returns
        -------
        _ : dict
            dictionary used to read the matrix values.
        _ : list
            matrix values for the LSA model
        """
        dictionary = corpora.Dictionary(self.abstracts_tokenized)
        doc_term_matrix = [dictionary.doc2bow(abstract) for abstract in self.abstracts_tokenized]
        return dictionary, doc_term_matrix
    
    def plot_graph(self, min, max, step):
        """
        Plots the graph for the coherence values of a LSA model.

        Parameters
        ----------
        min : int
            Min number of topics
        max : int
            Max number of topics
        stepp : int
            Increment between min and max
        """
        x = range(min, max, step)
        plt.plot(x, self.coherence_values)
        plt.xlabel("Number of topics")
        plt.ylabel("Coherence score")
        # plt.legend(("coherence_values"), loc="best")
        plt.show();
    
    def compute_coherence_values_LSI(self, min_max_step):
        """
        Computes the optimal number of topics for the LSA model using the LSI score

        Parameters
        ----------
        min_max_step : (int, int, int)
            Min, max and increment for the different number of topcs
        """
        dictionary, doc_term_matrix = self.prepare_matrix()
        for num_topics in range(min_max_step[0], min_max_step[1], min_max_step[2]):
            model = LsiModel(doc_term_matrix, num_topics=num_topics, id2word= dictionary)
            self.model_list.append(model)
            coherencemodel = CoherenceModel(model=model, texts=self.abstracts_tokenized, dictionary=dictionary, coherence='c_v')
            self.coherence_values.append(coherencemodel.get_coherence())
        self.plot_graph(min_max_step[0], min_max_step[1], min_max_step[2])

    def create_gensim_lsa_model(self, number_of_topics, number_of_words):
        """
        Generates a model using LSA with predefined number of classes.

        Parameters
        ----------
        texts : pandas.dataframe
            Dataframe with a text column
        column : str
            name of the text column, default "abstract"
        Returns
        -------
        _ : [list, list]
            List of lists containing the elaborated words.
        """
        dictionary, doc_term_matrix = self.prepare_matrix()
        # Generate LAS model with training data
        lsamodel = LsiModel(doc_term_matrix, num_topics=number_of_topics, id2word=dictionary)
        print(lsamodel.print_topics(num_topics=number_of_topics, num_words=number_of_words))
        return lsamodel
    
    def create_gensim_lda_model(self, categories = 'eCH'):
        """
        Creates a LDA model with a predefined number of categories (27) eCH or (34) INSPIRE,
        trained on the data from the preporcessing function.

        Parameters
        ----------
        categories : pandas.dataframe
            Dataframe with a text column
        column : str
            name of the text column, default "abstract"
        Returns
        -------
        _ : list
            List of scored topics from the LDA model.
        """
        self.dictionary, self.doc_term_matrix = self.prepare_matrix()
        if categories == 'eCH':
            cat = 27+1 # one more for empty fields
        elif categories == 'INSPIRE':
            cat = 34+1 # one more for empty fields
        else:
            print('The categories must be <eCH> or <INSPIRE>')
            cat = 0
        self.main_topics_lda = LdaModel(corpus=self.doc_term_matrix, id2word=self.dictionary, num_topics=cat,
                                        alpha='auto', eta='auto', passes=100, eval_every=None, chunksize=2000)
        return self.main_topics_lda
    
    def prepare_plot_lda(self):
        """
        Prepares the data from the LDA model for an interactive visualisation
        with pyLDAvis (pyLDAvis.display(vis)).

        Returns
        -------
        _ : genvis.dataset
                Parameters for the dataset's visualisation
        """
        vis = genvis.prepare(self.main_topics_lda, self.doc_term_matrix, self.dictionary)
        return vis


class NLP_spacy():
    """
    The class uses Spacy and RAKE to extract and refine the keywords of a text using NLP.
    https://spacy.io/
    Do not remove punctuation, it is needed for the context extraction in NLP!
    """
    def __init__(self) -> None:
        """
        Initialises pretrained spacy models.
        Diverese models are available on https://spacy.io/models/en
        sm = small 15MB, md = middle 45MB, lg = large 500MB
        """
        self.nlp_en = spacy.load("en_core_web_sm")
        self.nlp_fr = spacy.load("fr_core_news_sm")
        self.nlp_de = spacy.load("de_core_news_sm")
        self.nlp_it = spacy.load("it_core_news_sm")
        self.topics = set([])

    def fit_nlp(self, text) -> list:
        """
        Fits a DL model based on the detected language and extract the keeywords
        using spacy.

        Parameters
        ----------
        text : str
            Text for the keyword extraction
        Returns
        -------
        _ : list
            list of keywords
        """
        lang = detect_language(text, not_found=True)
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

    def extract_keywords_rake(self, text, score=False, keyword_length = 3):
        """
        Extracts the keywords from a text using
        RAKE https://csurfer.github.io/rake-nltk/_build/html/index.html

        Parameters
        ----------
        text : str
            Text for the keyword extraction
        score : bool
            Output the score for the extracted keywords
        keyword_length : int
            number of words each keyword
        Returns
        -------
        _ : list
            list of keywords
        """
        lang = detect_language(text, not_found=True)
        if lang != 'not_found':
            rake_nltk = Rake(language=lang, include_repeated_phrases=False, max_length=keyword_length)
            rake_nltk.extract_keywords_from_text(text)
            if score:
                keywords = rake_nltk.get_ranked_phrases_with_scores()# limit by score (not normalized) using TFIDF
                keywords = [w for w in keywords if w not in list(stopwords.words(lang))
                    and w not in list(punctuation)]
            else:
                new_kws = []
                keywords = rake_nltk.get_ranked_phrases()
                for keyword in keywords:
                    # remove stop words and punctuation
                    new_kw = [w for w in word_tokenize(keyword) if w not in list(stopwords.words(lang)) and w not in list(punctuation)]
                    if len(new_kw) != 0:
                        new_kws.append(new_kw)
                    else:
                        continue
                keywords = new_kws
            return keywords
        else:
            return []
    
    def analyse_text_keywords(self, text, refine_keywords, keyword_length=3):
        """
        applies the keyword extraction with RAKE and clean the resulting keywords analysing the grammar
        with the DL model from spacy.

        Parameters
        ----------
        text : str
            Text for the keyword extraction
        keyword_length : int
            number of words each keyword
        Returns
        -------
        _ : list
            list of cleaned keywords
        """
        lang = detect_language(text, not_found=True)
        if lang == 'italian':
            dataset = self.nlp_it(text)
        elif lang == 'german':
            dataset = self.nlp_de(text)
        elif lang == 'french':
            dataset = self.nlp_fr(text)
        elif lang == 'english':
            dataset = self.nlp_en(text)
        else:
            dataset = None

        keywords = self.extract_keywords_rake (text, keyword_length=keyword_length)
        if refine_keywords and dataset:
            words = [token.text.lower() for token in dataset if not
                    (token.pos_ == 'DET' or token.pos_ == 'PUNCT' or token.pos_ == 'SPACE' or 'CONJ' in token.pos_)]
            positionals = [token.pos_ for token in dataset if not 
                        (token.pos_ == 'DET' or token.pos_ == 'PUNCT' or token.pos_ == 'SPACE' or 'CONJ' in token.pos_)]
            # refine the keywords using just the relevant ones
            pos_dict = dict(zip(words, positionals))
            cleaned_keywords = {' '.join(kw) for kw in keywords if any(pos_dict.get(w) in ['NOUN', 'PROPN', 'NUM'] for w in kw)}
        else:
            cleaned_keywords= {' '.join(kw) for kw in keywords}
        return list(cleaned_keywords)
    
    def extract_refined_keywords(self, texts, use_rake=True, refine_keywords=True, column='abstract', keyword_length=3, num_keywords=10):
        """
        Applies the keyword extraction and cleansing to a whole dataset of texts
        
        Parameters
        ----------
        texts : pandas.dataframe
            Dataframe containing the texts to be elaborated
        use_rake : bool
            Use RAKE to extract the keywords otherwise uses Spacy
        keyword_length : int
            number of words each keyword
        num_keywords : int
            Number of keywords each text (Only for Spacy)
        Returns
        -------
        _ : list
            list of keywords
        """
        self.index = texts.index.values
        if use_rake:
            print('Extracting keywords with RAKE...')
            keywords = [self.analyse_text_keywords(text, refine_keywords, keyword_length=keyword_length) for text in tqdm(texts[column].values.tolist())]
            self.topics = keywords
        else:
            print('Extracting keywords with SpaCy...')
            datasets = [self.fit_nlp(text) for text in tqdm(texts[column].values.tolist())]
            for dataset in datasets:
                self.topics.update(dataset[:num_keywords])
            translator = str.maketrans('','', punctuation)
            self.topics = [str(i).translate(translator) for i in list(self.topics) if len(i) > 2]
        return self.topics


    # SUMMARIZATION
    def summarize(self, text, use_GPT=False):
        """
        Summarizes a text using SBert model or in alternative using a GPT model (API-key needed)
        
        Parameters
        ----------
        text : str
            Text to be summarized
        use_GPT : bool
            Use a GPT model oterwise a Sbert model
        Returns
        -------
        _ : str
            summarized text
        """
        lang = detect_language(text, not_found=True)
        if use_GPT:
            if lang == 'german':
                prompt='Diesen Text zusammenfassen'
            elif lang == 'french':
                prompt='Résumez ce texte'
            elif lang == 'italian':
                prompt='Riassumi questo testo'
            else:
                prompt='Summarize this text'
            openai.api_key = os.getenv('OPENAI_KEY')
            summarized_text = openai.Completion.create(model='text-davinci-003', prompt=f"{prompt}: {text}",
                                                       temperature=.2, max_tokens=1000,)["choices"][0]['text']
        else:
            if lang == 'english':
                model = SBertSummarizer('all-MiniLM-L12-v2')
            else:
                model = SBertSummarizer('paraphrase-multilingual-mpnet-base-v2')
            summarized_text = model(text, num_sentences=4)
        return summarized_text
    
    def summarize_texts(self, texts, column='abstract', use_GPT=False):
        """
        Applies the summariation function to a pandas dataframe
        
        Parameters
        ----------
        texts : pandas.dataframe
            Dataframe with a text column
        use_GPT : bool
            Use a GPT model oterwise a Sbert model
        column : str
            Text column, default "abstract"
        Returns
        -------
        _ : list
            lists of summarized texts
        """
        if use_GPT:
            print('Summarizing with openai. There is a limit of token for the free version!')
        else:
            print('Summarizing text with Bert')
        self.index = texts.index.values
        summaries = [self.summarize(progress(text)) for text in texts[column].values.tolist()]
        return summaries

def set_nans(row, apply_on_column='abstract', check_columns=['title', 'name']):
    """
    Set a nan value to the field if the column is equal to check columns or
    starts with "https" or with "Link zu Metadaten".
    """
    if str(row[apply_on_column]) != 'nan':
        if len(str(row[apply_on_column]).split()) < 2 or str(row[apply_on_column]).startswith('http') or str(row[apply_on_column]).startswith('Link zu Metadaten:') or str(row[apply_on_column]).startswith('?') or str(row[apply_on_column]).startswith('WMS/WFS Dienst des Kantons') or str(row[apply_on_column]).startswith('Geodienst des GIS'):
            new_value = 'nan'
        else:
            new_value = row[apply_on_column]
            for col in check_columns:
                if row[col].lower() == row[apply_on_column].lower() and new_value != 'nan':
                    new_value = 'nan'
                elif new_value != 'nan':
                    new_value = row[apply_on_column]
                else:
                    pass
    else:
        new_value = 'nan'
    return new_value

def check_metadata_quality(database, search_word='nan',
                           search_columns=['abstract', 'keywords', 'metadata','contact'],
                           case_sensitive=False):
    """
    Calculate metadata quality score based on columns: abstract, keywords, metadata, contact
    """
    database[search_columns] = database[search_columns].replace({' ': 'nan', '??':'nan','n.a.':'nan'})
    database['abstract_nan'] = database.apply(set_nans, axis=1)
    search_columns[search_columns.index("abstract")]='abstract_nan'
    mask = database[search_columns].apply(lambda x:x.str.match(search_word, case=case_sensitive))
    database['metaquality'] = round(100 - mask.sum(axis=1)*25) # Scoring with 4 fields
    return database.drop(columns=['abstract_nan'])
