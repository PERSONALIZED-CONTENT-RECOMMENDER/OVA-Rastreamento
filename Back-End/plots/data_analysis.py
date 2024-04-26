import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from collections import defaultdict
from base import db
import json

def ova_interactions_by_competencies(data):
    db.connect(reuse_if_open=True)
    student_id = data["student_id"]
    course_id = data["course_id"]
    
    query = (f"""select s.subject_name, c.competency_description, count(si.interaction_id) / (
	select sum(o1.num_interactions)
	from ovas o1 where o1.competency_id = o.competency_id
)
from 
(
    select interaction_id, ova_id 
    from interactions 
    where student_id = {student_id}
) si
right join ovas o on si.ova_id = o.ova_id
inner join competencies c on o.competency_id = c.competency_id
inner join course_subjects s on c.subject_id = s.subject_id
inner join offerings offe on s.subject_id = offe.subject_id
where offe.course_id = {course_id}
group by s.subject_name, c.competency_description, o.ova_id
""")
    
    cursor = db.execute_sql(query)
    data = cursor.fetchall()
    
    result = defaultdict(list)
    for row in data:
        result[row[0]].append(row[1:])
        
    return "Title", result, max(list(map(lambda x: len(x), result.values())))
    
data = {
    "student_id": 2,
    "course_id": 1
}

def course_general_performance(course_id):
    query = (f"""with course_ovas as (
	select o.ova_id, o.num_interactions 
    from ovas o
	inner join competencies c
	on o.competency_id = c.competency_id
	inner join course_subjects cs
	on c.subject_id = cs.subject_id
	inner join offerings offe
	on cs.subject_id = offe.subject_id
	where offe.course_id = {course_id}
)
select s.student_name, (case when ci.count is null then 0 else ci.count end) / (
	select sum(num_interactions) from course_ovas
)
from students s
left join (
	select i.student_id, count(i.interaction_id) as count
	from interactions i
	inner join course_ovas o
    on o.ova_id = i.ova_id
    group by i.student_id
) ci
on s.student_id = ci.student_id
where s.course_id = {course_id}""")
    
    cursor = db.execute_sql(query)
    data = {"students": [], "perc": []}
    
    for student, perc in cursor.fetchall():
        data["students"].append(student)
        data["perc"].append(round(float(perc), 2))
    
    return data

def ova_performance_by_students(ova_id):
    query = (f"""select s.student_name, count(i.interaction_id) / (
select num_interactions from ovas where ova_id = {ova_id}
)
from students s
left join (
	select interaction_id, student_id 
    from interactions
    where ova_id = {ova_id}
) i
on s.student_id = i.student_id
group by s.student_name""")
    
    cursor = db.execute_sql(query)
    data = {"students": [], "perc": []}
    
    for student, perc in cursor.fetchall():
        data["students"].append(student)
        data["perc"].append(round(float(perc), 2))
    
    return data