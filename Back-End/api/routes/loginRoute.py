import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from flask import Blueprint, request, redirect
from flask_cors import cross_origin
import json
from peewee import PeeweeException

from students import Students
from courses import Courses

app_login = Blueprint('login', __name__)

@app_login.route("/login", methods=["POST"])
@cross_origin()
def login():
    if request.method == "POST":
        try:
            login_data = request.get_json()[0]
            student = Students.select().where(Students.ra == login_data["ra"]).first()
            
            if (not student or login_data["ra"] == "") or login_data["password"] != student.student_password:
                return "Wrong RA or Password", 401
            
            course = Courses.select().where(Courses.course_id == student.course_id).first()
            
            ids = {
                "course_id": course.course_id,
                "ra": student.ra
            }
            
            return json.dumps({"Message": "Logged successfully!", "ids": ids, "is_admin": student.is_admin}), 200
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        return "Wrong Request Methods. Only POST Allowed", 405