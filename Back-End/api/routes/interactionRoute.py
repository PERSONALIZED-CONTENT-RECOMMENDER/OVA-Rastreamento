import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from flask import Blueprint, request
from sqlalchemy import select, insert
from flask_cors import cross_origin
from peewee import PeeweeException
import json
import datetime

from student import Student
from ova import OVA
from interaction import Interaction
from base import db

app_interaction = Blueprint("interaction", __name__)

@app_interaction.route("/interaction/register", methods=["POST"])
@cross_origin()
def register():
    if request.method == "POST":
        try:
            interaction_data = request.get_json()[0]
            
            student = db.session.execute(
                select(Student.student_id).where(Student.student_id == interaction_data["student_id"])
                ).first()
            ova = db.session.execute(
                select(OVA.ova_id).where(OVA.ova_id == interaction_data["ova_id"])    
                ).first()
            
            db.session.execute(
                insert(Interaction).values(
                    interaction_date = str(datetime.datetime.now().strftime("%Y/%m/%d")),
                    interaction_time = str(datetime.datetime.now().strftime("%H:%M:%S")),
                    student_action = interaction_data["action"],
                    student_id = student.student_id,
                    ova_id = ova.ova_id
                )
            )
            db.session.commit()
            
            
            return json.dumps("New interaction registered!"), 200
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        return "Wrong Request Methods. Only POST Allowed", 405