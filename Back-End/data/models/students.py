from base import BaseModel
from courses import Courses
from peewee import *

class Students(BaseModel):
    student_id = IntegerField(primary_key=True)
    ra = TextField()
    student_password = TextField()
    student_name = TextField()
    course_id = ForeignKeyField(Courses, backref="students", on_delete="cascade", on_update="cascade")
    is_admin = BooleanField()