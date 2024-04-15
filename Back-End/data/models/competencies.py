from base import BaseModel
from subjects import Subjects
from peewee import *

class Competencies(BaseModel):
    competency_id = IntegerField(primary_key=True)
    competency_description = TextField()
    subject_id = ForeignKeyField(Subjects, backref="competencies", on_delete="cascade", on_update="cascade")