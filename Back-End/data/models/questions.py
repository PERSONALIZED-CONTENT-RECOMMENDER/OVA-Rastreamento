# import the necessary classes
from base import BaseModel
from competencies import Competencies
from ovas import OVAs
from peewee import *
from playhouse.mysql_ext import JSONField

class Questions(BaseModel):
    # id of the question
    question_id = IntegerField(primary_key=True)
    # statement of the question
    statement = TextField()
    # alternatives of the question
    alternatives = JSONField()
    # answer of the question
    answer = TextField()
    # if the user has already answered or not
    answered = BooleanField()
    # id of the ova to which it belongs to
    ova_id = ForeignKeyField(OVAs, backref="questions", on_delete="cascade", on_update="cascade")
    # id of the competency to which he belongs to
    competency_id = ForeignKeyField(Competencies, backref="questions", on_delete="cascade", on_update="cascade")