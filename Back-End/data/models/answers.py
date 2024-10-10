# Import the necessary classes
from base import BaseModel
from students import Students
from questions import Questions
from peewee import *

# Class for the answers table
class Answers(BaseModel):
    # Unique identifier for the answer
    answer_id = IntegerField(primary_key=True)
    # ID of the student who provided the answer
    student_id = ForeignKeyField(Students, backref="answers", on_delete="cascade", on_update="cascade")
    # ID of the question that was answered
    question_id = ForeignKeyField(Questions, backref="answers", on_delete="cascade", on_update="cascade")
