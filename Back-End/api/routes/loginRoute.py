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
from students import Students
from courses import Courses

# creation of a route blueprint, a reusable component
app_login = Blueprint('login', __name__)

# this funcion insert an interaction of the user
# with the front end in the database
@app_login.route("/login", methods=["POST"])
# activate the cross-origin, that accepts requests from another domain
@cross_origin()
def login():
    if request.method == "POST":
        try:
            # get the json sent by the front-end
            login_data = request.get_json()[0]
            
            # get the student that has the same RA as the one inside the json.
            # In other words, the student that has logged in
            student = Students.select().where(Students.ra == login_data["ra"]).first()
            
            # if the student doesn't exist or the RA is empty or the password retrieved isn't
            # correct, it raises an error
            if (not student or login_data["ra"] == "") or login_data["password"] != student.student_password:
                return "Wrong RA or Password", 401
            
            # get the id and the name of the student's course
            course = Courses.select().where(Courses.course_id == student.course_id).first()
            
            ids = {
                "course_id": course.course_id,
                "student_id": student.student_id
            }
            
            # return the ids and if the student is an admin (coordinator of the course)
            return json.dumps({"Message": "Logged successfully!", "ids": ids, "is_admin": student.is_admin}), 200
        # handle the error returning the description of the error
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        # return this if the http method is any other than POST
        return "Wrong Request Methods. Only POST Allowed", 405