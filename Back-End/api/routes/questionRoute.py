# Add parent directories to the path to enable imports from submodules
import sys, os

root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

# Import necessary libraries
from flask import Blueprint, request
from flask_cors import cross_origin
from peewee import PeeweeException # ORM library
import json

# Import the necessary ORM classes
from questions import Questions
from answers import Answers
from students import Students

# Create a route blueprint as a reusable component
app_question = Blueprint("question", __name__)

# Return all the questions from the database
@app_question.route("/question/all", methods=["GET"])
# Activate cross-origin to accept requests from another domain
@cross_origin()
def show_all_questions():
    if request.method == "GET":
        try:
            # Get all the questions
            questions = Questions.select()
            question_list = []
            # For each question, append its id, statement,
            # alternatives, and answer to the list
            for question in questions:
                question_dict = {
                    "question_id": question.question_id,
                    "statement": question.statement,
                    "alternatives": question.alternatives["alternatives"],
                    "answer": question.answer
                }
                question_list.append(question_dict.copy())
            # Return the result array
            return json.dumps(question_list)
        except PeeweeException as err:
            # Handle the error by returning the description of the error
            return json.dumps({"Error": f"{err}"}), 501
    else:
        # Return this if the HTTP method is not GET
        return "Wrong Request Methods. Only GET Allowed", 405

# Given an OVA, return all the questions of this OVA
@app_question.route("/question/ova", methods=["POST"])
# Activate cross-origin to accept requests from another domain
@cross_origin()
def show_ova_questions():
    if request.method == "POST":
        try:
            question_data = request.get_json()[0]
            # Get all the questions of the given OVA
            questions = Questions.select().where(Questions.ova_id == question_data["ova_id"])
            questions_ids = [question.question_id for question in questions]
            
            # Get all the questions of the ova given by the student
            answers_ids = Answers.select(Answers.question_id).where(Answers.student_id == question_data["student_id"], Answers.question_id.in_(questions_ids))
            answers_ids = [id.question_id.question_id for id in answers_ids]
            
            question_list = []
            # For each question, append its id, statement,
            # alternatives, answer, and the competency_id
            # of the competency worked with this question
            for question in questions:
                question_dict = {
                    "question_id": question.question_id,
                    "statement": question.statement,
                    "alternatives": question.alternatives["alternatives"],
                    "answer": question.answer,
                    "answered": question.question_id in answers_ids,
                    "competency_id": question.competency_id.competency_id
                }
                question_list.append(question_dict.copy())
            # Return the result array
            return json.dumps(question_list)
        except PeeweeException as err:
            # Handle the error by returning the description of the error
            return json.dumps({"Error": f"{err}"}), 501
    else:
        # Return this if the HTTP method is not POST
        return "Wrong Request Methods. Only POST Allowed", 405
 
# Given a student's id, this function inserts a new answer for a question
@app_question.route("/question/answer", methods=['POST'])
@cross_origin()
def answer_question():
    if request.method == 'POST':
        try:
            answer_data = request.get_json()[0]
            
            # Get the answer of a student for a given question
            answer = Answers.select(Answers.question_id).where(Answers.question_id == answer_data["question_id"], Answers.student_id == answer_data["student_id"]).first()
            
            # Verify if the answer is correct and if it doesn't
            # exist in the database. If both conditions are true,
            # insert a new answer in the database
            if answer_data["is_correct"] and answer is None:
                print("new")
                student = Students.select().where(Students.student_id == answer_data["student_id"]).first()
                question = Questions.select().where(Questions.question_id == answer_data["question_id"]).first()
                
                # Insert a new answer in the database
                answer = Answers.create(
                    student_id = student,
                    question_id = question
                )
            
            return json.dumps("Question answered!"), 200
        except PeeweeException as err:
            # Handle the error by returning the description of the error
            return json.dumps({"Error": f"{err}"}), 501
    else:
        # Return this if the HTTP method is not POST
        return "Wrong Request Methods. Only POST Allowed", 405
