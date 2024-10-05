# this lines below enable import from other submodules
import sys, os

from offerings import Offerings
from subjects import Subjects
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

# necessary libraries import
from flask import Blueprint, request
from flask_cors import cross_origin
from peewee import PeeweeException # ORM library
import json

# import of the necessary orm classes
from courses import Courses

# creation of a route blueprint, a reusable component
app_course = Blueprint("course", __name__)

# this function retrieves all the courses
@app_course.route("/courses", methods=["GET"])
# activate the cross-origin, that accepts requests from another domain
@cross_origin()
def show_courses():
    if request.method == "GET":
        try:
            # do a request to the database using the ORM (Peewee) to get,
            # all the courses, except the one to the administrators
            courses = Courses.select().where(Courses.course_id < 100)
            course_list = []
            # iterate over the result of the request
            for course in courses:
                # for each of it, creates a dictionary containing the id and
                # the name of the course
                course_dict = {
                    "course_id": course.course_id,
                    "course_name": course.course_name
                }
                course_list.append(course_dict.copy())
            # retrieves to the front-end an array with the courses' id and name
            return json.dumps(course_list)
        # handle the error returning the description of the error
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        # return this if the http method is any other than GET
        return "Wrong Request Methods. Only GET Allowed", 405
    
@app_course.route("/course/<int:course_id>/subjects", methods=["GET"])
# activate the cross-origin, that accepts requests from another domain
@cross_origin()
def get_course_subjects(course_id):
    if request.method == "GET":
        try:
            s = Subjects.alias()
            of = Offerings.alias()
            print(f"Course id {course_id}")
            subjects =  s.select(s.subject_id, s.subject_name).join(of).where(of.course_id == course_id)
            subject_list = []
            
            for subject in subjects:
                subject_dict = {
                    "subject_id": subject.subject_id,
                    "subject_name": subject.subject_name
                }
                subject_list.append(subject_dict.copy())
            # retrieves to the front-end an array with the courses' id and name
            return json.dumps(subject_list)
        # handle the error returning the description of the error
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        # return this if the http method is any other than GET
        return "Wrong Request Methods. Only GET Allowed", 405