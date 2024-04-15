from base import BaseModel
from competencies import Competencies
from peewee import *

class OVAs(BaseModel):
    ova_id = IntegerField(primary_key=True)
    ova_name = TextField()
    competency_id = ForeignKeyField(Competencies, backref="ovas", on_delete="cascade", on_update="cascade")
    link = TextField()