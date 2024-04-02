from base import BaseModel
from peewee import *

class Course(BaseModel):
    course_id = IntegerField(primary_key=True)
    course_name = TextField()
    
    class Meta:
        table_name = 'COURSE'