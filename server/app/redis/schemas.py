
from redis.commands.search.field import (GeoField, NumericField, TagField,
                                         TextField)

geoservices_schema = (
    TextField('$.OWNER', as_name='OWNER'),
    TextField('$.TITLE', as_name='TITLE'),
    TextField('$.NAME', as_name='NAME'),
    TextField('$.MAPGEO', as_name='MAPGEO'),
    TextField('$.TREE', as_name='TREE'),
    TextField('$.GROUP', as_name='GROUP'),
    TextField('$.ABSTRACT', as_name='ABSTRACT'),
    TagField('$.KEYWORDS', as_name='KEYWORDS'),
    TextField('$.LEGEND', as_name='LEGEND'),
    TextField('$.CONTACT', as_name='CONTACT'),
    TextField('$.SERVICELINK', as_name='SERVICELINK'),
    TextField('$.METADATA', as_name='METADATA'),
    TextField('$.UPDATE', as_name='UPDATE'),
    TextField('$.SERVICETYPE', as_name='SERVICETYPE'),
    NumericField('$.MAX_ZOOM', as_name='MAX_ZOOM'),
    NumericField('$.CENTER_LAT', as_name='CENTER_LAT'),
    NumericField('$.CENTER_LON', as_name='CENTER_LON'),
    TextField('$.BBOX', as_name='BBOX')
)