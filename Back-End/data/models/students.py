from base import BaseModel
from courses import Courses
from peewee import *

class Students(BaseModel):
    ra = TextField(primary_key=True)
    student_password = TextField()
    student_name = TextField()
    course_id = ForeignKeyField(Courses, backref="students", on_delete="CASCADE", on_update="CASCADE")
    is_admin = BooleanField()