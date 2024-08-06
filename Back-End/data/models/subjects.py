# import the necessary classes
from base import BaseModel
from courses import Courses
from peewee import *

# class for the subjects table
class Subjects(BaseModel):
    # id of the subject
    subject_id = IntegerField(primary_key=True)
    # name of the subject
    subject_name = TextField()
    
    class Meta:
        # table name in database
        table_name = "course_subjects"