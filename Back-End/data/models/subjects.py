from base import BaseModel
from courses import Courses
from peewee import *

class Subjects(BaseModel):
    subject_id = IntegerField(primary_key=True)
    subject_name = TextField()
    course_id = ForeignKeyField(Courses, backref="subjects", on_delete="CASCADE", on_update="CASCADE")
    
    class Meta:
        table_name = "course_subjects"