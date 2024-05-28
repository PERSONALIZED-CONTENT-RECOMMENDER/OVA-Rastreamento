# import the necessary classes
from base import BaseModel
from courses import Courses
from subjects import Subjects
from peewee import *

# association table of course with subjects

# this table allows a course to have multiple subjects
# and a subject to be taught in many courses
class Offerings(BaseModel):
    # id of the association table
    offering_id = IntegerField(primary_key=True)
    # id of the course
    course_id = ForeignKeyField(Courses, backref="offerings", on_delete="cascade", on_update="cascade")
    # id of the subject
    subject_id = ForeignKeyField(Subjects, backref="offerings", on_delete="cascade", on_update="cascade")