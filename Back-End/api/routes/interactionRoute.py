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
import datetime

# import of the necessary orm classes
from students import Students
from ovas import OVAs
from interactions import Interactions

# creation of a route blueprint, a reusable component
app_interaction = Blueprint("interaction", __name__)

# this funcion insert an interaction of the user
# with the front end in the database
@app_interaction.route("/interaction/register", methods=["POST"])
# activate the cross-origin, that accepts requests from another domain
@cross_origin()
def register():
    if request.method == "POST":
        try:
            # get the json sent by the front-end
            interaction_data = request.get_json()[0]
            
            # get the student that has the same id as the one inside the json.
            # In other words, the student that made the interaction with the OVA
            student = Students.select().where(Students.student_id == interaction_data["student_id"]).first()
            # get the OVA that has the same id as the one inside the json.
            # In other words, the OVA that the student made interaction with.
            ova = OVAs.select().where(OVAs.ova_id == interaction_data["ova_id"]).first()
            
            # create the interaction register, containing, respectively, the date and time that the
            # interaction was made, the interaction description (action), the student that
            # made the interaction and the OVA of the interaction
            interaction = Interactions.create(
                interaction_date = datetime.datetime.now().strftime("%Y/%m/%d"),
                interaction_time = datetime.datetime.now().strftime("%H:%M:%S"),
                student_action = interaction_data["action"],
                student_id = student,
                ova_id = ova
            )
            
            # retrieves to the front-end an array with the courses' id and name
            return json.dumps("New interaction registered!"), 200
        # handle the error returning the description of the error
        except PeeweeException as err:
            return json.dumps({"Error": f"{err}"}), 501
    else:
        # return this if the http method is any other than POST
        return "Wrong Request Methods. Only POST Allowed", 405