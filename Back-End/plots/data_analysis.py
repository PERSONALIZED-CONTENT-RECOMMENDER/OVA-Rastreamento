import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from playhouse.shortcuts import model_to_dict, fn, JOIN

from students import Students
from ovas import OVAs
from interactions import Interactions
from courses import Courses

def ova_interactions_by_student(data):
    I = Interactions.alias()
    O = OVAs.alias()
    
    student_interactions = I.select(I.interaction_id, I.ova_id).where(I.student_ra == data["ra"])
    SI = student_interactions.alias("SI")
    
    result = O.select(O.ova_name, fn.COUNT(SI.c.interaction_id).alias("count")).join(SI, JOIN.LEFT_OUTER, on=(SI.c.ova_id == O.ova_id)).group_by(O.ova_name)
    
    return "OVA interactions", {r.ova_name: r.count for r in result}