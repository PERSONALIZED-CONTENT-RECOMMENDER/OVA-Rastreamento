import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from flask import Blueprint, request
from flask_cors import cross_origin
import json
from peewee import PeeweeException
from student import Student
from course import Course

app_student = Blueprint('student', __name__)

@app_student.route("/student/<ra>", methods=["GET"])
@cross_origin()
def create_student(ra):
    if request.method == "GET":
        try:
            student = Student.select().where(Student.ra == ra).first()
            
            if not student:
                return json.dumps({"Message": "RA not found!"})
            
            course = Course.select().where(Course.course_id == student.course_id).first()
            student_dict = {
                "ra": student.ra,
                "password": student.student_password,
                "student_name": student.student_name,
                "course": {
                    "course_id": course.course_id,
                    "course_name": course.course_name
                }
            }
            return json.dumps(student_dict), 200
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        return json.dumps({"Error": "Wrong Request Methods. Only POST Allowed"}), 405