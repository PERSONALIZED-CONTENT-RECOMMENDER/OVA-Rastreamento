import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'plots')))

from flask import Blueprint, request
from flask_cors import cross_origin
import json

from data_analysis import ova_interactions_by_student

def format_data(plot_type, data, title):
    return {
        "type": plot_type,
        "data": data,
        "title": title
    }

app_plot = Blueprint("plot", __name__)

@app_plot.route("/plot/student", methods=["POST"])
@cross_origin()
def get_student_plots():
    if request.method == "POST":
        student_data = request.get_json()[0]
        plots = []
        title, data = ova_interactions_by_student(student_data)
        plot = format_data("bar", data, title)
        plots.append(plot)
        return json.dumps(plots)
    else:
        return "Wrong Request Methods. Only POST Allowed", 405