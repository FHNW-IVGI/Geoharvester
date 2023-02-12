
from redis.commands.search.field import (GeoField, NumericField, TagField,
                                         TextField)

### Geoservices
# Source data:  https://github.com/davidoesch/geoservice_harvester_poc/tree/main/data/geoservices_CH.csv

SVC_PREFIX = "svc:"    
SVC_KEY = SVC_PREFIX + '{}'
SVC_INDEX_ID = "py_{}_idx".format(SVC_PREFIX)

geoservices_schema = (
    TextField('$.OWNER', as_name='OWNER', no_stem=True),
    TextField('$.TITLE', as_name='TITLE'),
    TextField('$.NAME', as_name='NAME'),
    TextField('$.MAPGEO', as_name='MAPGEO'),
    TextField('$.TREE', as_name='TREE', no_stem=True),
    TextField('$.GROUP', as_name='GROUP', no_stem=True),
    TextField('$.ABSTRACT', as_name='ABSTRACT'),
    TagField('$.KEYWORDS', as_name='KEYWORDS'),
    TextField('$.LEGEND', as_name='LEGEND', no_stem=True),
    TextField('$.CONTACT', as_name='CONTACT', no_stem=True),
    TextField('$.SERVICELINK', as_name='SERVICELINK', no_stem=True),
    TextField('$.METADATA', as_name='METADATA', no_stem=True),
    TextField('$.UPDATE', as_name='UPDATE', no_stem=True),
    TextField('$.SERVICETYPE', as_name='SERVICETYPE', no_stem=True),
    NumericField('$.MAX_ZOOM', as_name='MAX_ZOOM'),
    NumericField('$.CENTER_LAT', as_name='CENTER_LAT'),
    NumericField('$.CENTER_LON', as_name='CENTER_LON'),
    TextField('$.BBOX', as_name='BBOX', no_stem=True)
)

### Geodata
# Source data:  https://github.com/davidoesch/geoservice_harvester_poc/tree/main/data/geodata_CH.csv

DTA_PREFIX = "dta:"    
DTA_KEY = DTA_PREFIX + '{}'
DTA_INDEX_ID = "py_{}_idx".format(DTA_PREFIX)

geodata_schema = (
    TextField('$.OWNER', as_name='OWNER', no_stem=True),
    TextField('$.TITLE', as_name='TITLE'),
    TextField('$.NAME', as_name='NAME'),
    TextField('$.MAPGEO', as_name='MAPGEO'),
    TextField('$.ABSTRACT', as_name='ABSTRACT'),
    TagField('$.KEYWORDS', as_name='KEYWORDS'),
    TextField('$.CONTACT', as_name='CONTACT', no_stem=True),
    TextField('$.WMSGetCap', as_name='WMSGetCap', no_stem=True),
    TextField('$.WMTSGetCap', as_name='WMTSGetCap', no_stem=True),
    TextField('$.WFSGetCap', as_name='WFSGetCap', no_stem=True)
)