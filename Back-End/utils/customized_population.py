import datetime
import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), "data/models")))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), "data")))

from base import db
from collections import defaultdict
from random import choice

from interactions import Interactions
from students import Students
from ovas import OVAs

db.connect(reuse_if_open=True)

def generate_interactions(n, course_id=1, ova_id=None):
    ova_query = (f"""select co.course_id, o.ova_id
                from courses co
                inner join offerings offe
                on co.course_id = offe.course_id
                inner join course_subjects cs
                on offe.subject_id = cs.subject_id
                inner join competencies c
                on cs.subject_id = c.subject_id
                inner join ovas o
                on c.competency_id = o.competency_id
                where co.course_id = {course_id}""")

    cursor = db.execute_sql(ova_query)
    result = cursor.fetchall()

    ovas_ids = defaultdict(list)

    for row in result:
        ovas_ids[row[0]].append(row[1])

    student_query = (f"""select co.course_id, s.student_id
                    from courses co
                    inner join students s
                    on co.course_id = s.course_id
                    where s.course_id = {course_id}""")

    cursor = db.execute_sql(student_query)
    result = cursor.fetchall()

    students_ids = defaultdict(list)

    for row in result:
        students_ids[row[0]].append(row[1])

    for _ in range(n):
        course_id = choice(list(set(ovas_ids.keys()).intersection(students_ids.keys())))
        
        ova_id = choice(ovas_ids[course_id])
        
        student_id = choice(students_ids[course_id])
    
        student = Students.select().where(Students.student_id == student_id).first()
        ova = OVAs.select().where(OVAs.ova_id == ova_id).first()
        
        interaction = Interactions.create(
            interaction_date = datetime.datetime.now().strftime("%Y/%m/%d"),
            interaction_time = datetime.datetime.now().strftime("%H:%M:%S"),
            student_action = "teste",
            student_id = student,
            ova_id = ova
        )
        
generate_interactions(20000)