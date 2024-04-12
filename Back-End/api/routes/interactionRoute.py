import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from flask import Blueprint, request
from flask_cors import cross_origin
from peewee import PeeweeException
import json
import datetime

from students import Students
from ovas import OVAs
from interactions import Interactions

app_interaction = Blueprint("interaction", __name__)

@app_interaction.route("/interaction/register", methods=["POST"])
@cross_origin()
def register():
    if request.method == "POST":
        try:
            interaction_data = request.get_json()[0]
            
            student = Students.select().where(Students.ra == interaction_data["ra"]).first()
            ova = OVAs.select().where(OVAs.ova_id == interaction_data["ova_id"]).first()
            
            interaction = Interactions.create(
                interaction_date = datetime.datetime.now().strftime("%Y/%m/%d"),
                interaction_time = datetime.datetime.now().strftime("%H:%M:%S"),
                student_action = interaction_data["action"],
                student_ra = student,
                ova_id = ova
            )
            
            return json.dumps("New interaction registered!"), 200
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        return "Wrong Request Methods. Only POST Allowed", 405