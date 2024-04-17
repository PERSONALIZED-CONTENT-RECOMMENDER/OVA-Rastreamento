import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from playhouse.shortcuts import model_to_dict, fn, JOIN
from collections import defaultdict

from students import Students
from ovas import OVAs
from interactions import Interactions
from courses import Courses
from offerings import Offerings
from subjects import Subjects
from competencies import Competencies

def ova_interactions_by_student(data):
    i = Interactions.alias()
    o = OVAs.alias()
    c = Competencies.alias()
    s = Subjects.alias()
    of = Offerings.alias()
    
    student_interactions = i.select(i.interaction_id, i.ova_id).where(i.student_id == data["student_id"])
    SI = student_interactions.alias("SI")
    
    result = o.select(o.ova_name, fn.COUNT(SI.c.interaction_id).alias("count")).join(SI, JOIN.LEFT_OUTER, on=(SI.c.ova_id == o.ova_id)).join(c, on=(o.competency_id == c.competency_id)).join(s).join(of).group_by(o.ova_name).where(of.course_id == data["course_id"])
    
    
    return "OVA interactions", {r.ova_name: r.count for r in result}