import os

SOURCE_COLLECTION_CSV = "sources.csv"
SOURCE_COLLECTION_VERSION = {"KT_AI": "1.3.0",
                             "KT_AR": "1.3.0", "Geodienste": "1.3.0"}
SOURCE_SCRAPER_DIR = "scraper"
GEOSERVICES_CH_CSV = os.path.join("data", "geoservices_CH.csv")
WORKFLOW_ARTIFACT_FOLDER = "artifacts"
WORKFLOW_TRANSLATE_LANGUAGES = ['de','en','fr','it']
WORKFLOW_TRANSLATE_COLUMNS = ["title","abstract","keywords","keywords_nlp"]
WORKFLOW_MERGE_COLUMNS = ['name','title','provider','keywords','abstract','endpoint']
LOG_FILE = os.path.join("tools", "debug.log")
DEAD_SERVICES_PATH = "tools"
preview_PREFIX = \
    "https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-grau&"

# Google Indexing API
# JSON_KEY_FILE = "geoharvester-indexing-credentials.json"
# SCOPES = ["https://www.googleapis.com/auth/indexing"]
