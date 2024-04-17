from base import BaseModel
from students import Students
from ovas import OVAs
from peewee import *

class Interactions(BaseModel):
    interaction_id = AutoField()
    interaction_date = DateField()
    interaction_time = TimeField()
    student_action = TextField()
    student_id = ForeignKeyField(Students, backref="interactions", on_delete="cascade", on_update="cascade")
    ova_id = ForeignKeyField(OVAs, backref="interactions", on_delete="cascade", on_update="cascade")