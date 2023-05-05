
from redis.commands.search.field import (GeoField, NumericField, TagField,
                                         TextField)

### Geoservices
# Source data:  https://github.com/davidoesch/geoservice_harvester_poc/tree/main/data/geoservices_CH.csv

SVC_PREFIX = "svc:"    
SVC_KEY = SVC_PREFIX + '{}'
SVC_INDEX_ID = "py_{}_idx".format(SVC_PREFIX)

geoservices_schema = (
    TextField('$.provider', as_name='provider', no_stem=True),
    TextField('$.title', as_name='title'),
    TextField('$.name', as_name='name'),
    TextField('$.preview', as_name='preview'),
    TextField('$.tree', as_name='tree', no_stem=True),
    TextField('$.group', as_name='group', no_stem=True),
    TextField('$.abstract', as_name='abstract'),
    TagField('$.keywords', as_name='keywords'),
    TextField('$.legend', as_name='legend', no_stem=True),
    TextField('$.contact', as_name='contact', no_stem=True),
    TextField('$.endpoint', as_name='endpoint', no_stem=True),
    TextField('$.metadata', as_name='metadata', no_stem=True),
    TextField('$.update', as_name='update', no_stem=True),
    TextField('$.service', as_name='service', no_stem=True),
    NumericField('$.maxZoom', as_name='maxZoom'),
    NumericField('$.centerLat', as_name='centerLat'),
    NumericField('$.centerLon', as_name='centerLon'),
    TextField('$.bbox', as_name='bbox', no_stem=True)
)

### Geodata
# Source data:  https://github.com/davidoesch/geoservice_harvester_poc/tree/main/data/geodata_CH.csv

DTA_PREFIX = "dta:"    
DTA_KEY = DTA_PREFIX + '{}'
DTA_INDEX_ID = "py_{}_idx".format(DTA_PREFIX)

geodata_schema = (
    TextField('$.provider', as_name='provider', no_stem=True),
    TextField('$.title', as_name='title'),
    TextField('$.name', as_name='name'),
    TextField('$.preview', as_name='preview'),
    TextField('$.abstract', as_name='abstract'),
    TagField('$.keywords', as_name='keywords'),
    TextField('$.contact', as_name='contact', no_stem=True),
    TextField('$.WMSGetCap', as_name='WMSGetCap', no_stem=True),
    TextField('$.WMTSGetCap', as_name='WMTSGetCap', no_stem=True),
    TextField('$.WFSGetCap', as_name='WFSGetCap', no_stem=True)
)