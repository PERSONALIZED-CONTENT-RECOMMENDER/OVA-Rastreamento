# import the necessary classes
from base import BaseModel
from subjects import Subjects
from peewee import *

class OVAs(BaseModel):
    # id of the ova
    ova_id = IntegerField(primary_key=True)
    # name of the ova
    ova_name = TextField()
    # subject to which it belongs
    subject_id = ForeignKeyField(Subjects, backref="ovas", on_delete="cascade", on_update="cascade")
    # html link to an ova page
    link = TextField()