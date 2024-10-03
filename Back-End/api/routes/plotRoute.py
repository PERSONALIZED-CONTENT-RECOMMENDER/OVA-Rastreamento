# this lines below enable import from other submodules
import sys, os

from interactions import Interactions
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'plots')))

# necessary libraries import
from flask import Blueprint, request
from flask_cors import cross_origin
import json

# import the data_analysis module
from data_analysis import ova_interactions_by_competencies, course_general_performance, ova_performance_by_students
#from data_analysis import competency_performance_by_students, ova_interactions_by_competencies, course_general_performance, ova_performance_by_students

# format the data to send to front-end, with the type of plot
# the data and the title of the plot
def format_data(plot_type, title, data, max=None):
    d = {"type": plot_type,
        "data": data,
        "title": title,
    }
    if max is not None:
        d["max_num_competencies"] = max
    return d

# creation of a route blueprint, a reusable component
app_plot = Blueprint("plot", __name__)

# get all the plots referent to a student
@app_plot.route("/plot/student", methods=["POST"])
@cross_origin()
def get_student_plots():
    if request.method == "POST":
        student_data = request.get_json()[0]
        
        # call the plot function for the plot module
        title, data, max = ova_interactions_by_competencies(student_data)
        #get the formatted data
        plot = format_data("bar", title, data, max)
        
        return json.dumps(plot)
    else:
        # return this if the http method is any other than POST
        return "Wrong Request Methods. Only POST Allowed", 405

# get all the plots referent to a course
@app_plot.route("/plot/course", methods=["POST"])
@cross_origin()
def get_course_plots():
    if request.method == "POST":
        course_id = request.get_json()[0]["course_id"]
        
        # call the plot function for the plot module
        data = course_general_performance(course_id)
        #get the formatted data
        plot = format_data("bar", "Performance Geral do Curso", data)
        
        return json.dumps(plot)
    else:
        # return this if the http method is any other than POST
        return "Wrong Request Methods. Only POST Allowed", 405

# get all the plots referent to an OVA
@app_plot.route("/plot/ova", methods=["POST"])
@cross_origin()
def get_ova_plots():
    if request.method == "POST":
        data = request.get_json()[0]
        
        # call the plot function for the plot module
        data = ova_performance_by_students(data)
        #get the formatted data
        plot = format_data("bar", "Performance dos alunos no OVA", data)
        
        return json.dumps(plot)
    else:
        # return this if the http method is any other than POST
        return "Wrong Request Methods. Only POST Allowed", 405
    
# get the number of interactions in an OVA
@app_plot.route("/plot/interaction/ova", methods=["POST"])
@cross_origin()
def get_interaction_plots():
    if request.method == "POST":
        interaction_data = request.get_json()[0]
        
        data = Interactions.select(Interactions.student_id == interaction_data["student_id"] and Interactions.ova_id == interaction_data["ova_id"]).count()
        
        return json.dumps({"num_interactions": data})
    else:
        # return this if the http method is any other than POST
        return "Wrong Request Methods. Only POST Allowed", 405
    
# get all the plots referent to an competency
# @app_plot.route("/plot/competency", methods=["POST"])
# @cross_origin()
# def get_competency_plots():
#     if request.method == "POST":
#         competency_id = request.get_json()[0]["competency_id"]
        
#         # call the plot function for the plot module
#         data = competency_performance_by_students(competency_id)
#         #get the formatted data
#         plot = format_data("bar", "Performance dos alunos na competência", data)
        
#         return json.dumps(plot)
#     else:
#         # return this if the http method is any other than POST
#         return "Wrong Request Methods. Only POST Allowed", 405