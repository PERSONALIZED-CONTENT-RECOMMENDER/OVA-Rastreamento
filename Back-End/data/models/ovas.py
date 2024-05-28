# import the necessary classes
from base import BaseModel
from competencies import Competencies
from peewee import *

class OVAs(BaseModel):
    # id of the ova
    ova_id = IntegerField(primary_key=True)
    # name of the ova
    ova_name = TextField()
    # competency to which it belongs
    competency_id = ForeignKeyField(Competencies, backref="ovas", on_delete="cascade", on_update="cascade")
    # html link to an ova page
    link = TextField()