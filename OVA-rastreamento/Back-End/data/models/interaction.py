from base import BaseModel
from student import Student
from ova import OVA
from peewee import *
import datetime

class Interaction(BaseModel):
    interaction_id = AutoField()
    interaction_date = DateField()
    interaction_time = TimeField()
    student_action = TextField()
    student_ra = ForeignKeyField(Student, backref="interactions", on_delete="CASCADE", on_update="CASCADE")
    ova_id = ForeignKeyField(OVA, backref="interactions", on_delete="CASCADE", on_update="CASCADE")
    
    class Meta:
        table_name = 'INTERACTION'