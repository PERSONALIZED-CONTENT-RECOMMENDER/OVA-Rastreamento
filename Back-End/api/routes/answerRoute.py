# this lines below enable import from other submodules
import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

# necessary libraries import
from flask import Blueprint, request
from flask_cors import cross_origin
from peewee import PeeweeException # ORM library
import json

# import of the necessary orm classes
from answers import Answers
from students import Students
from questions import Questions

# creation of a route blueprint, a reusable component
app_answer = Blueprint("answer", __name__)

@app_answer.route("/answer/add", methods=['POST'])
@cross_origin()
def answer_question():
    if request.method == "POST":
        try:
            answer_data = request.get_json()[0]
            
            student = Students.select().where(Students.student_id == answer_data["student_id"])
            question = Questions.select().where(Questions.question_id == answer_data["question_id"])
            
            if answer_data["is_correct"]:
                answer = Answers.create(
                    student_id = student,
                    question_id = question
                )
            
    # retrieves to the front-end an array with the courses' id and name
            return json.dumps("New interaction registered!"), 200
        # handle the error returning the description of the error
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        # return this if the http method is any other than POST
        return "Wrong Request Methods. Only POST Allowed", 405