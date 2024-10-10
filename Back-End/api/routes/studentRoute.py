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
from students import Students

# Create a route blueprint as a reusable component
app_student = Blueprint("student", __name__)

# Given a course id, return all the students of this course
@app_student.route("/student/course/<int:course_id>", methods=["GET"])
@cross_origin()
def student_by_course(course_id):
    if request.method == "GET":
        try:
            # Query the students of the course
            students = Students.select().where(Students.course_id == course_id)
            student_list = []
            # For each student, append its id and name to the list
            for student in students:
                student_dict = {
                    "student_id": student.student_id,
                    "student_name": student.student_name
                }
                student_list.append(student_dict.copy())
            return json.dumps(student_list)
        # Handle the error by returning the description of the error
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        # Return this if the HTTP method is not GET
        return "Wrong Request Methods. Only GET Allowed", 405
