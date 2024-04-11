import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'plots')))

from flask import Blueprint, request
from flask_cors import cross_origin
import json

from data_analysis import studentPlot1

def format_data(plot_type, data):
    return {
        "type": plot_type,
        "data": data
    }

app_plot = Blueprint("plot", __name__)

@app_plot.route("/plots", methods=["GET"])
@cross_origin()
def get_plots():
    if request.method == "GET":
        return json.dumps(allPlots())
    else:
        return "Wrong Request Methods. Only GET Allowed", 405
    
@app_plot.route("/plot/student", methods=["POST"])
@cross_origin()
def get_student_plots():
    if request.method == "POST":
        student_data = request.get_json()[0]
        plots = []
        plot = format_data("bar", studentPlot1(student_data))
        plots.append(plot)
        return json.dumps(plots)
    else:
        return "Wrong Request Methods. Only POST Allowed", 405