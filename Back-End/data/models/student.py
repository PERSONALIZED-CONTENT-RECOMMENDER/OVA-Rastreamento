from base import BaseModel
from course import Course
from peewee import *

class Student(BaseModel):
    ra = TextField(primary_key=True)
    student_password = TextField()
    student_name = TextField()
    course_id = ForeignKeyField(Course, backref="students", column_name="course_id", on_delete="CASCADE", on_update="CASCADE")
    is_admin = BooleanField()
    
    class Meta:
        table_name = 'STUDENT'