import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'plots')))

from flask import Blueprint, request
from flask_cors import cross_origin
import json

from data_analysis import ova_interactions_by_competencies

def format_data(plot_type, title, data, max):
    return {
        "type": plot_type,
        "data": data,
        "title": title,
        "max_num_competencies": max
    }

app_plot = Blueprint("plot", __name__)

@app_plot.route("/plot/student", methods=["POST"])
@cross_origin()
def get_student_plots():
    if request.method == "POST":
        student_data = request.get_json()[0]
        
        title, data, max = ova_interactions_by_competencies(student_data)
        plot = format_data("bar", title, data, max)
        
        return json.dumps(plot)
    else:
        return "Wrong Request Methods. Only POST Allowed", 405