from base import BaseModel
from courses import Courses
from subjects import Subjects
from peewee import *

class Offerings(BaseModel):
    offering_id = IntegerField(primary_key=True)
    course_id = ForeignKeyField(Courses, backref="offerings", on_delete="cascade", on_update="cascade")
    subject_id = ForeignKeyField(Subjects, backref="offerings", on_delete="cascade", on_update="cascade")