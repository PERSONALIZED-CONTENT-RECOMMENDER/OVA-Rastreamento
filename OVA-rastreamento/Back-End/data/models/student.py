from base import BaseModel
from course import Course
from peewee import *

class Student(BaseModel):
    ra = TextField(primary_key=True, column_name="RA")
    student_password = TextField(column_name="STUDENT_PASSWORD")
    student_name = TextField(column_name="STUDENT_NAME")
    course_id = ForeignKeyField(Course, backref="students", on_delete="CASCADE", on_update="CASCADE", column_name="COURSE_ID")
    
    class Meta:
        table_name = 'STUDENT'