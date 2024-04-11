import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from playhouse.shortcuts import model_to_dict, fn, JOIN
from peewee import Select

from student import Student
from interaction import Interaction
from ova import OVA
from course import Course

def ova_by_student(data):
    I = Interaction.alias("I")
    student_interactions = (I.select(I.interaction_id, I.ova_id).where(I.student_ra == data["ra"]))
    SI = student_interactions.alias("SI")
    query = (OVA.select(OVA, fn.COUNT(SI.c.interaction_id).alias("count")).join(SI, JOIN.LEFT_OUTER, on=(OVA.ova_id == SI.c.ova_id)).group_by(OVA))
    
    [print(i.ova_name, i.count) for i in query]
    return {record.ova_name: record.count for record in query}