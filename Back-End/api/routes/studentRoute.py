import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from flask import Blueprint, request
from flask_cors import cross_origin
from peewee import PeeweeException
import json

from students import Students

app_student = Blueprint("student", __name__)

@app_student.route("/student/course/<int:course_id>", methods=["GET"])
@cross_origin()
def student_by_course(course_id):
    if request.method == "GET":
        try:
            students = Students.select().where(Students.course_id == course_id)
            student_list = []
            for student in students:
                student_dict = {
                    "student_id": student.student_id,
                    "student_name": student.student_name
                }
                student_list.append(student_dict.copy())
            return json.dumps(student_list)
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        return "Wrong Request Methods. Only GET Allowed", 405