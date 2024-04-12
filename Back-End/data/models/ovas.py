from base import BaseModel
from courses import Courses
from peewee import *

class OVAs(BaseModel):
    ova_id = IntegerField(primary_key=True)
    ova_name = TextField()
    course_id = ForeignKeyField(Courses, backref="ovas", on_delete="CASCADE", on_update="CASCADE")
    complexity = TextField()
    link = TextField()