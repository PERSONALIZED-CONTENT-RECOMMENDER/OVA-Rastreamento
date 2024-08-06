# import the necessary classes
from base import BaseModel
from students import Students
from ovas import OVAs
from peewee import *

# class for the interactions table
class Interactions(BaseModel):
    # id of the interaction
    interaction_id = AutoField()
    # date on which the interaction was made
    interaction_date = DateField()
    # time on which the interaction was made
    interaction_time = TimeField()
    # description of the action made by the student
    student_action = TextField()
    # student that made the interaction
    student_id = ForeignKeyField(Students, backref="interactions", on_delete="cascade", on_update="cascade")
    # the OVA of the interaction
    ova_id = ForeignKeyField(OVAs, backref="interactions", on_delete="cascade", on_update="cascade")