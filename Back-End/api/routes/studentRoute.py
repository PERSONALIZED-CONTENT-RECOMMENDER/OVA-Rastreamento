# this lines below enable import from other submodules
import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

# necessary libraries import
from flask import Blueprint, request
from flask_cors import cross_origin
from peewee import PeeweeException
import json

# import of the necessary orm classes
from students import Students

# creation of a route blueprint, a reusable component
app_student = Blueprint("student", __name__)

# given a course id, return all the students of this course
@app_student.route("/student/course/<int:course_id>", methods=["GET"])
@cross_origin()
def student_by_course(course_id):
    if request.method == "GET":
        try:
            # do the query of the students of the course
            students = Students.select().where(Students.course_id == course_id)
            student_list = []
            # for each student, append its id and name to the list
            for student in students:
                student_dict = {
                    "student_id": student.student_id,
                    "student_name": student.student_name
                }
                student_list.append(student_dict.copy())
            return json.dumps(student_list)
        # handle the error returning the description of the error
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        # return this if the http method is any other than POST
        return "Wrong Request Methods. Only GET Allowed", 405