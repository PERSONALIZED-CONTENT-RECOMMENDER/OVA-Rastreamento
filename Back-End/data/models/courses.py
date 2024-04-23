from base import BaseModel
from peewee import *

class Courses(BaseModel):
    course_id = IntegerField(primary_key=True)
    course_name = TextField()