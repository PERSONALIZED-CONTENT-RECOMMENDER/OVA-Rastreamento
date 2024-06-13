# this lines below enable import from other submodules
import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

# necessary libraries import
from flask import Blueprint, request
from flask_cors import cross_origin
import json
from peewee import PeeweeException # ORM library

# import of the necessary orm classes
from questions import Questions

# creation of a route blueprint, a reusable component
app_question = Blueprint("question", __name__)

# it returns all the questions from the database
@app_question.route("/question/all", methods=["GET"])
# activate the cross-origin, that accepts requests from another domain
@cross_origin()
def show_all_questions():
    if request.method == "GET":
        try:
            # get all the questions
            questions = Questions.select()
            question_list = []
            # for each question, append to the list its id, statement
            # alternatives and answer
            for question in questions:
                question_dict = {
                    "question_id": question.question_id,
                    "statement": question.statement,
                    "alternatives": question.alternatives["alternatives"],
                    "answer": question.answer
                }
                question_list.append(question_dict.copy())
            # returns the result array
            return json.dumps(question_list)
        except PeeweeException as err:
            # handle the error returning the description of the error
            return json.dumps({"Error": f"{err}"}), 501
    else:
        # return this if the http method is any other than GET
        return "Wrong Request Methods. Only GET Allowed", 405

#given a ova, return all the question of this ova
@app_question.route("/question/ova/<int:ova_id>", methods=["GET"])
# activate the cross-origin, that accepts requests from another domain
@cross_origin()
def show_ova_questions(ova_id):
    if request.method == "GET":
        try:
            # get all the questions of the given ova
            questions = Questions.select().where(Questions.ova_id == ova_id)
            question_list = []
            # for each question, append to the list its id, statement
            # alternatives, answer and the competency_id
            # of the competency worked with this question
            for question in questions:
                question_dict = {
                    "question_id": question.question_id,
                    "statement": question.statement,
                    "alternatives": question.alternatives["alternatives"],
                    "answer": question.answer,
                    "answered": question.answered,
                    "competency_id": question.competency_id.competency_id
                }
                question_list.append(question_dict.copy())
            # returns the result array
            return json.dumps(question_list)
        except PeeweeException as err:
            # handle the error returning the description of the error
            return json.dumps({"Error": f"{err}"}), 501
    else:
        # return this if the http method is any other than GET
        return "Wrong Request Methods. Only GET Allowed", 405