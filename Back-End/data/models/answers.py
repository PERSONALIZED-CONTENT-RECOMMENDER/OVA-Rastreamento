# import the necessary classes
from base import BaseModel
from students import Students
from questions import Questions
from peewee import  *

class Answers(BaseModel):
    # id of the answer
    answer_id = IntegerField(primary_key=True)
    # id of the student that answered the question
    student_id = ForeignKeyField(Students, backref="answers", on_delete="cascade", on_update="cascade")
    # id of the question that was answered
    question_id = ForeignKeyField(Questions, backref="answers", on_delete="cascade", on_update="cascade")