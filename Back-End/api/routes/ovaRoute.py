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
from competencies import Competencies
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
            c = Competencies.alias()
            o = OVAs.alias()
            
            # query all the OVAs of the given course, joining the tables by its ids and filtering the course table
            query = o.select(s.subject_name, c.competency_description, o.ova_id, o.ova_name, o.link).join(c).join(s).join(of).where(of.course_id == course_id)
            
            # make the result a defaultdict. for handle automatically the key error
            result = defaultdict(list)
            
            # for each OVA, append the id, name, description and html link to the result array
            for ova in query:
                competency = ova.competency_id
                result[competency.subject_id.subject_name].append({
                    "ova_id": ova.ova_id,
                    "ova_name": ova.ova_name,
                    "competency_description": competency.competency_description,
                    "link": ova.link
            })
            return json.dumps(result)
        # handle the error returning the description of the error
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        return "Wrong Request Methods. Only POST Allowed", 405

@app_ova.route("/ova/all", methods=["GET"])
@cross_origin()
def show_all_OVAs():
    if request.method == "GET":
        try:
            ovas = OVAs.select()
            ova_list = []
            for ova in ovas:
                ova_dict = {
                    "ova_id": ova.ova_id,
                    "ova_name": ova.ova_name
                }
                ova_list.append(ova_dict.copy())
            return json.dumps(ova_list)
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        return "Wrong Request Methods. Only POST Allowed", 405