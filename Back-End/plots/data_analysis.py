import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from collections import defaultdict
from base import db
import json

def ova_interactions_by_competencies(data, grouping_type="subject"):
    db.connect(reuse_if_open=True)
    student_id = data["student_id"]
    course_id = data["course_id"]
    
    query = ("""select {0}, count(si.interaction_id) from 
(
    select interaction_id, ova_id 
    from interactions 
    where student_id = {1}
) si
right join ovas o on si.ova_id = o.ova_id
inner join competencies c on o.competency_id = c.competency_id
inner join course_subjects s on c.subject_id = s.subject_id
inner join offerings offe on s.subject_id = offe.subject_id
where offe.course_id = {2}
group by {0}
""")
    
    group_columns = "s.subject_name, c.competency_description"
    columns = ["subject", "competency", "count"]
    
    full_query = query.format(group_columns, student_id, course_id, group_columns)
    cursor = db.execute_sql(full_query)
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
    query = (f"""select s.student_name, sum(case when ci.partial_perc is null then 0 else ci.partial_perc end) as perc_total
from students s
left join (
	select i.student_id, (count(i.interaction_id) / o.num_interactions) as partial_perc
	from interactions i
	inner join ovas o
	on o.ova_id = i.ova_id
	inner join competencies c
	on o.competency_id = c.competency_id
	inner join course_subjects cs
	on c.subject_id = cs.subject_id
	inner join offerings offe
	on cs.subject_id = offe.subject_id
	where offe.course_id = {course_id}
    group by i.student_id, o.ova_id
) ci
on s.student_id = ci.student_id
where s.course_id = {course_id}
group by s.student_name""")
    
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