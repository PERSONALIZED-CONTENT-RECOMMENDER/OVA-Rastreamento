from base import BaseModel
from course import Course
from peewee import *

class OVA(BaseModel):
    ova_id = IntegerField(primary_key=True)
    ova_name = TextField()
    course_id = ForeignKeyField(Course, backref="OVAs", on_delete="CASCADE", on_update="CASCADE")
    complexity = TextField()
    html_link = TextField()
    
    class Meta:
        table_name = 'OVA'