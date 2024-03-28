import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from flask import Blueprint, request
from flask_cors import cross_origin
from peewee import PeeweeException
import json

from ova import OVA

app_ova = Blueprint("ova", __name__)

@app_ova.route("/ova/<int:course_id>", methods=["GET"])
@cross_origin()
def show_OVAs(course_id):
    if request.method == "GET":
        try:
            ovas = OVA.select().where(OVA.course_id == course_id)
            ova_list = []
            for ova in ovas:
                ova_dict = {
                    "ova_id": ova.ova_id,
                    "ova_name": ova.ova_name,
                    "complexity": ova.complexity,
                    "html_link": ova.html_link
                }
                ova_list.append(ova_dict.copy())
            return json.dumps(ova_list)
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        return "Wrong Request Methods. Only POST Allowed", 405