
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
    TextField('$.provider', as_name='provider', no_stem=True),
    TextField('$.title', as_name='title'),
    TextField('$.name', as_name='name'),
    TextField('$.preview', as_name='preview'),
    TextField('$.tree', as_name='tree', no_stem=True,),
    TextField('$.group', as_name='group', no_stem=True,),
    TextField('$.abstract', as_name='abstract'),
    TagField('$.keywords', as_name='keywords'),
    TagField('$.keywords_nlp', as_name='keywords_nlp'),
    TextField('$.legend', as_name='legend', no_stem=True,),
    TextField('$.contact', as_name='contact', no_stem=True,),
    TextField('$.endpoint', as_name='endpoint', no_stem=True,),
    TextField('$.metadata', as_name='metadata', no_stem=True,),
    # TextField('$.update', as_name='update', no_stem=True,),# BUG: field not used
    TextField('$.service', as_name='service'),
    NumericField('$.max_zoom', as_name='max_zoom'),
    NumericField('$.center_lat', as_name='center_lat'),
    NumericField('$.center_lon', as_name='center_lon'),
    TextField('$.bbox', as_name='bbox', no_stem=True,),
    TextField('$.summary', as_name='summary', no_stem=True,),
    TagField('$.lang_3', as_name='lang_3'),
    # TagField('$.lang_2', as_name='lang_2'), # BUG field not used
    NumericField('$.metaquality', as_name='metaquality')
    )


class GeoserviceModel(BaseModel):
    # Any fields not in the csv (and added by preprocessing) need to be optional!
    _primary_key_field: str = "id"
    provider: str
    title: str
    name: str
    preview: str
    tree: str
    group: str
    abstract: str
    keywords: str
    keywords_nlp:  Optional[str]
    legend: str
    contact: str
    endpoint: str
    metadata: str
    # update: Optional[str] # BUG: field not used
    service: str
    max_zoom: int
    center_lat: float
    center_lon: float
    bbox: str
    summary: Optional[str]
    lang_3:  Optional[str]
    # lang_2:  Optional[str] # BUG: field not used
    metaquality: Optional[int]

    class Config:
        orm_mode = True
