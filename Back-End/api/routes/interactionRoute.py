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

from student import Student
from ova import OVA

from interaction import Interaction

app_interaction = Blueprint("interaction", __name__)

@app_interaction.route("/interaction/register", methods=["POST"])
@cross_origin()
def register():
    if request.method == "POST":
        try:
            interaction_data = request.get_json()[0]
            
            student = Student.select().where(Student.ra == interaction_data["ra"]).first()
            ova = OVA.select().where(OVA.ova_id == interaction_data["ova_id"]).first()
            
            interaction = Interaction.create(
                interaction_date = datetime.datetime.now().strftime("%Y/%m/%d"),
                interaction_time = datetime.datetime.now().strftime("%X"),
                student_action = interaction_data["action"],
                student_ra = student,
                ova_id = ova
            )
            
            return json.dumps("New interaction registered!"), 200
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        return "Wrong Request Methods. Only POST Allowed", 405