# import the necessary classes
from base import BaseModel
from subjects import Subjects
from peewee import *

class Competencies(BaseModel):
    # id of the competency
    competency_id = IntegerField(primary_key=True)
    # description of the competency
    competency_description = TextField()
    # id of the subject to which it belongs
    subject_id = ForeignKeyField(Subjects, backref="competencies", on_delete="cascade", on_update="cascade")