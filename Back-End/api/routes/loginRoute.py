import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from flask import Blueprint, request
from flask_cors import cross_origin
import json
from peewee import PeeweeException

from sqlalchemy import select
from student import Student
from course import Course
from base import db

app_login = Blueprint('login', __name__)

@app_login.route("/login", methods=["POST"])
@cross_origin()
def login():
    if request.method == "POST":
        try:
            login_data = request.get_json()[0]
            student = db.session.execute(
                select(Student.student_id, Student.course_id, Student.is_admin).where(Student.ra == login_data["ra"] and Student.student_password == login_data["password"])
                ).first()
            
            if (student == None or login_data["ra"] == ""):
                return "Wrong RA or Password", 401
            
            course = db.session.execute(
                select(Course.course_id).where(Course.course_id == student.course_id)
                ).first()
            
            ids = {
                "course_id": course.course_id,
                "student_id": student.student_id
            }
            
            return json.dumps({"Message": "Logged successfully!", "ids": ids, "is_admin": student.is_admin}), 200
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        return "Wrong Request Methods. Only POST Allowed", 405