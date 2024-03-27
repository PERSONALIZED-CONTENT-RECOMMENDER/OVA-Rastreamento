from base import BaseModel
from student import Student
from ova import OVA
from peewee import *
import datetime

def today():
    date = datetime.date.today()
    return f"{date.day}/{date.month}/{date.year}"

class Interaction(BaseModel):
    interaction_id = AutoField()
    interaction_date = DateField(default=datetime.datetime.now().strftime("%d/%m/%Y"))
    interaction_time = TimeField(default=datetime.datetime.now().strftime("%X"))
    student_action = TextField()
    student_ra = ForeignKeyField(Student, backref="interactions", on_delete="CASCADE", on_update="CASCADE")
    ova_id = ForeignKeyField(OVA, backref="interactions", on_delete="CASCADE", on_update="CASCADE")
    
    class Meta:
        table_name = 'INTERACTION'