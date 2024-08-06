# import the necessary classes
from base import BaseModel
from courses import Courses
from peewee import *

# class for the students table
class Students(BaseModel):
    # id of the student
    student_id = IntegerField(primary_key=True)
    # ra of the student
    ra = TextField()
    # password of the student
    student_password = TextField()
    # name of the student
    student_name = TextField()
    # id of the course to which he belongs to
    course_id = ForeignKeyField(Courses, backref="students", on_delete="cascade", on_update="cascade")
    # if he is a coordinator or a student
    is_admin = BooleanField()