import os

SOURCE_COLLECTION_CSV = "sources.csv"
SOURCE_COLLECTION_VERSION = {"KT_AI": "1.3.0",
                             "KT_AR": "1.3.0", "Geodienste": "1.3.0"}
SOURCE_SCRAPER_DIR = "scraper"
GEOSERVICES_CH_CSV = os.path.join("data", "geoservices_CH.csv")
#GEOSERVICES_STATS_CH_CSV = os.path.join("data", "geoservices_stats_CH.csv")
#GEOSERVICES_STATS_CH_PATTERN = os.path.join(
#    "data", "* geoservices_stats_CH.csv")
#GEOSERVICES_CHANGESTATS_CH_CSV = os.path.join(
#    "data", "geoservices_changestats_CH.csv")
#GEOSERVICES_CHANGESTATS_ALERT_RECIPIENTS = [
#    'david.oesch@gmail.com', 'mail@ralphstraumann.ch']
#GEODATA_CH_CSV = os.path.join("data", "geodata_CH.csv")
#GEODATA_SIMPLE_CH_CSV = os.path.join("data", "geodata_simple_CH.csv")
LOG_FILE = os.path.join("tools", "debug.log")
#OPERATOR_STATS_FILE = "ISSUES.md"
DEAD_SERVICES_PATH = "tools"
preview_PREFIX = \
    "https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-grau&"

# Google Indexing API
# JSON_KEY_FILE = "geoharvester-indexing-credentials.json"
# SCOPES = ["https://www.googleapis.com/auth/indexing"]
