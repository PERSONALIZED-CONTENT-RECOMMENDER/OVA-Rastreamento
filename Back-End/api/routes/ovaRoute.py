# this lines below enable import from other submodules
import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

# necessary libraries import
from flask import Blueprint, request
from flask_cors import cross_origin
from peewee import PeeweeException # ORM library
import json
from collections import defaultdict

# import of the necessary orm classes
from offerings import Offerings
from subjects import Subjects
from ovas import OVAs

# creation of a route blueprint, a reusable component
app_ova = Blueprint("ova", __name__)

#given a course, return all the OVAs of this course
@app_ova.route("/ova/course/<int:course_id>", methods=["GET"])
# activate the cross-origin, that accepts requests from another domain
@cross_origin()
def show_course_OVAs(course_id):
    if request.method == "GET":
        try:
            # create aliases for less writing
            of = Offerings.alias()
            s = Subjects.alias()
            o = OVAs.alias()
            
            # query all the OVAs of the given course, joining the tables by its ids and filtering the course table
            query = o.select(s.subject_name, o.ova_id, o.ova_name, o.link).join(s).join(of).where(of.course_id == course_id)
            
            # make the result a defaultdict. for handle automatically the key error
            result = defaultdict(list)
            
            # for each OVA, append the id, name, description and html link to the result array
            for ova in query:
                subject = ova.subject_id
                result[subject.subject_name].append({
                    "ova_id": ova.ova_id,
                    "ova_name": ova.ova_name,
                    "link": ova.link
            })
            return json.dumps(result)
        # handle the error returning the description of the error
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        # return this if the http method is any other than GET
        return "Wrong Request Methods. Only GET Allowed", 405

# it returns all the ovas from the database
@app_ova.route("/ova/all", methods=["GET"])
@cross_origin()
def show_all_OVAs():
    if request.method == "GET":
        try:
            # get all the ovas
            ovas = OVAs.select()
            ova_list = []
            # for each ova, append to the list its id and its name
            for ova in ovas:
                ova_dict = {
                    "ova_id": ova.ova_id,
                    "ova_name": ova.ova_name
                }
                ova_list.append(ova_dict.copy())
            # returns the result array
            return json.dumps(ova_list)
        except PeeweeException as err:
            # handle the error returning the description of the error
            return json.dumps({"Error": f"{err}"}), 501
    else:
        # return this if the http method is any other than GET
        return "Wrong Request Methods. Only GET Allowed", 405