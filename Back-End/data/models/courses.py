# import the necessary classes
from base import BaseModel
from peewee import * # ORM

class Courses(BaseModel):
    # id of the course
    course_id = IntegerField(primary_key=True)
    # name of the course
    course_name = TextField()