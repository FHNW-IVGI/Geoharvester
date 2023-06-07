
from typing import List, Optional

from pydantic import BaseModel
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
    TextField('$.TREE', as_name='TREE', no_stem=True,),
    TextField('$.GROUP', as_name='GROUP', no_stem=True,),
    TextField('$.ABSTRACT', as_name='ABSTRACT'),
    TagField('$.KEYWORDS', as_name='KEYWORDS'),
    TagField('$.KEYWORDS_NLP', as_name='KEYWORDS_NLP'),
    TextField('$.LEGEND', as_name='LEGEND', no_stem=True,),
    TextField('$.CONTACT', as_name='CONTACT', no_stem=True,),
    TextField('$.SERVICELINK', as_name='SERVICELINK', no_stem=True,),
    TextField('$.METADATA', as_name='METADATA', no_stem=True,),
    TextField('$.UPDATE', as_name='UPDATE', no_stem=True,),
    TextField('$.SERVICETYPE', as_name='SERVICETYPE'),
    NumericField('$.MAX_ZOOM', as_name='MAX_ZOOM'),
    NumericField('$.CENTER_LAT', as_name='CENTER_LAT'),
    NumericField('$.CENTER_LON', as_name='CENTER_LON'),
    TextField('$.BBOX', as_name='BBOX', no_stem=True,),
    TextField('$.SUMMARY', as_name='SUMMARY', no_stem=True,),
    TagField('$.LANG_3', as_name='LANG_3'),
    TagField('$.LANG_2', as_name='LANG_2'),
    NumericField('$.METAQUALITY', as_name='METAQUALITY'))


test_geoservices_schema = (
    TextField('$.OWNER', as_name='OWNER', no_stem=True),
    TextField('$.TITLE', as_name='TITLE'),
    TextField('$.NAME', as_name='NAME'),
    TextField('$.MAPGEO', as_name='MAPGEO', no_index=True,  sortable=True),
    TextField('$.TREE', as_name='TREE', no_stem=True, no_index=True, sortable=True),
    TextField('$.GROUP', as_name='GROUP', no_stem=True, no_index=True, sortable=True),
    TextField('$.ABSTRACT', as_name='ABSTRACT'),
    TagField('$.KEYWORDS', as_name='KEYWORDS'),
    TagField('$.KEYWORDS_NLP', as_name='KEYWORDS_NLP'),
    TextField('$.LEGEND', as_name='LEGEND', no_stem=True, no_index=True, sortable=True),
    TextField('$.CONTACT', as_name='CONTACT', no_stem=True, no_index=True, sortable=True),
    TextField('$.SERVICELINK', as_name='SERVICELINK', no_stem=True, no_index=True, sortable=True),
    TextField('$.METADATA', as_name='METADATA', no_stem=True, no_index=True, sortable=True),
    TextField('$.UPDATE', as_name='UPDATE', no_stem=True, no_index=True, sortable=True),
    TextField('$.SERVICETYPE', as_name='SERVICETYPE', no_stem=True),
    NumericField('$.MAX_ZOOM', as_name='MAX_ZOOM', no_index=True, sortable=True),
    NumericField('$.CENTER_LAT', as_name='CENTER_LAT', no_index=True, sortable=True),
    NumericField('$.CENTER_LON', as_name='CENTER_LON', no_index=True, sortable=True),
    TextField('$.BBOX', as_name='BBOX', no_stem=True, no_index=True, sortable=True),
    TextField('$.SUMMARY', as_name='SUMMARY', no_stem=True, no_index=True, sortable=True),
    TagField('$.LANG_3', as_name='LANG_3'),
    TagField('$.LANG_2', as_name='LANG_2'),
    NumericField('$.METAQUALITY', as_name='METAQUALITY', no_index=True,  sortable=True)
)

class GeoserviceModel(BaseModel):
    # Any fields not in the csv (and added by preprocessing) need to be optional!
    _primary_key_field: str = "id"
    OWNER: str
    TITLE: str
    NAME: str
    MAPGEO: str
    TREE: str
    GROUP: str
    ABSTRACT: str
    KEYWORDS: str
    KEYWORDS_NLP:  str
    LEGEND: str
    CONTACT: str
    SERVICELINK: str
    METADATA: str
    UPDATE: Optional[str]
    SERVICETYPE: str
    MAX_ZOOM: int
    CENTER_LAT: float
    CENTER_LON: float
    BBOX: str
    SUMMARY: str
    LANG_3:  Optional[str]
    LANG_2:  Optional[str]
    METAQUALITY: Optional[int]

    class Config:
        orm_mode = True







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