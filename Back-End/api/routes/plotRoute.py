import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'plots')))

from flask import Blueprint, request
from flask_cors import cross_origin
import json

from data_analysis import ova_interactions_by_competencies, course_general_performance, ova_performance_by_students

def format_data(plot_type, title, data, max=None):
    d = {"type": plot_type,
        "data": data,
        "title": title,
    }
    if max is not None:
        d["max_num_competencies"] = max
    return d

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
    
@app_plot.route("/plot/course", methods=["POST"])
@cross_origin()
def get_course_plots():
    if request.method == "POST":
        course_id = request.get_json()[0]["course_id"]
        
        data = course_general_performance(course_id)
        plot = format_data("bar", "Performance Geral do Curso", data)
        
        return json.dumps(plot)
    else:
        return "Wrong Request Methods. Only POST Allowed", 405
    
@app_plot.route("/plot/ova", methods=["POST"])
@cross_origin()
def get_ova_plots():
    if request.method == "POST":
        ova_id = request.get_json()[0]["ova_id"]
        
        data = ova_performance_by_students(ova_id)
        plot = format_data("bar", "Performance dos alunos no OVA", data)
        
        return json.dumps(plot)
    else:
        return "Wrong Request Methods. Only POST Allowed", 405