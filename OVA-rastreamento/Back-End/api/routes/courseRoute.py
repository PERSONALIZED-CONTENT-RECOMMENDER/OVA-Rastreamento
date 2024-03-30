import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from flask import Blueprint, request
from flask_cors import cross_origin
from peewee import PeeweeException
import json

from course import Course

app_course = Blueprint("course", __name__)

@app_course.route("/courses", methods=["GET"])
@cross_origin()
def show_courses():
    if request.method == "GET":
        try:
            courses = Course.select()
            course_list = []
            for course in courses:
                course_dict = {
                    "course_id": course.course_id,
                    "course_name": course.course_name
                }
                course_list.append(course_dict.copy())
            return json.dumps(course_list)
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        return "Wrong Request Methods. Only POST Allowed", 405