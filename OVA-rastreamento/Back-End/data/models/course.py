from base import BaseModel
from peewee import *

class Course(BaseModel):
    course_id = IntegerField(primary_key=True, column_name="COURSE_ID")
    course_name = TextField(column_name="COURSE_NAME")
    
    class Meta:
        table_name = 'COURSE'