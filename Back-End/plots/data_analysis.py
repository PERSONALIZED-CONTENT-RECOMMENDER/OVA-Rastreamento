# This lines below enable import from other submodules
import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

# Necessary libraries import
from collections import defaultdict
from base import db
import json

# Returns the performance of the student in a subject,
# grouped by competencies
def subject_performance_by_competencies(data):
    # Reuse the connection if it's already open
    db.connect(reuse_if_open=True)
    
    # get the ids for the query
    student_id = data["student_id"]
    course_id = data["course_id"]
    subject_id = data["subject_id"]
    has_ova_id = data.get("ova_id") is not None
    ova_where = ""
    if has_ova_id:
        ova_id = data["ova_id"]
        ova_where = f" and q.ova_id = {ova_id}"
    
    # Perform the query
    query = (f"""select c.competency_description, count(sub_q.answer_id), 
(
	select count(*)
    from questions q
    where q.competency_id = c.competency_id {ova_where if has_ova_id else ""}
)
from competencies c
inner join course_subjects cs
on c.subject_id = cs.subject_id
inner join offerings offe
on cs.subject_id = offe.subject_id
left join (
	select a.answer_id, q.competency_id
    from answers a
	inner join questions q
	on q.question_id = a.question_id
    where a.student_id = {student_id} {ova_where if has_ova_id else ""}
) sub_q
on sub_q.competency_id = c.competency_id
where offe.course_id = {course_id} and cs.subject_id = {subject_id}
group by c.competency_id""")
    
    # Execute raw SQL due to complexity
    cursor = db.execute_sql(query)
    data = cursor.fetchall()
    
    # Use the defaultdict to handle automatically the key error of a dict
    result = []
    for row in data:
        result.append((row[0], int(row[1]), int(row[2])))
        
    # Return the result  
    return "Title", result

# Given an ID of a course, return the general performance of each student
# in percentage
def course_general_performance(course_id):
    # Reuse the connection if it's already open
    db.connect(reuse_if_open=True)
    query = (f"""select s.student_name, count(sub_q.answer_id) / (
	select count(q.question_id)
    from questions q
    inner join competencies c
    on q.competency_id = c.competency_id
    inner join course_subjects cs
    on c.subject_id = cs.subject_id
    inner join offerings offe
    on cs.subject_id = offe.subject_id
    where offe.course_id = {course_id}
) as perc
from students s
left join (
	select answer_id, student_id
    from answers a
) sub_q
on s.student_id = sub_q.student_id
where s.is_admin = false
group by s.student_id;""")
    
    # Execute raw SQL due to complexity
    cursor = db.execute_sql(query)
    data = {"students": [], "perc": []}
    
    # Append the student and the percentage achieved until the
    # moment of the request
    for student, perc in cursor.fetchall():
        data["students"].append(student)
        data["perc"].append(round(float(perc), 2))
    
    return data

# Given an OVA ID, returns the performance of each student on it
def ova_performance_by_students(data):
    # Reuse the connection if it's already open
    db.connect(reuse_if_open=True)
    ova_id = data["ova_id"]
    
    query = (f"""select s.student_name, count(sub_q.question_id) / (
	select count(*)
    from questions
    where ova_id = {ova_id}
)
from students s
left join (
	select q.question_id, a.student_id
    from questions q
	inner join answers a
	on a.question_id = q.question_id
    where q.ova_id = {ova_id}
) sub_q
on s.student_id = sub_q.student_id
where s.is_admin = false
group by s.student_id""")
    
    # Execute raw SQL due to complexity
    cursor = db.execute_sql(query)
    data = {"students": [], "perc": []}
    
    # Append the student and the percentage achieved until the
    # moment of the request
    for student, perc in cursor.fetchall():
        data["students"].append(student)
        data["perc"].append(round(float(perc), 2))
    
    return data

# Given a competency ID, returns the performance of each student on it
# def competency_performance_by_students(competency_id):
#     # Reuse the connection if it's already open
#     db.connect(reuse_if_open=True)
#     query = (f"""select s.student_name, count(sub_q.question_id) / (
# 	select count(q.question_id)
#     from questions q
#     where q.competency_id = {competency_id}
# ) as perc
# from students s
# left join (
# 	select q.question_id, a.student_id
#     from questions q
# 	inner join answers a
# 	on a.question_id = q.question_id
#     where q.competency_id = {competency_id}
# ) sub_q
# on s.student_id = sub_q.student_id
# where s.is_admin = false
# group by s.student_id;""")
    
#     # Execute raw SQL due to complexity
#     cursor = db.execute_sql(query)
#     data = {"students": [], "perc": []}
    
#     # Append the student and the percentage achieved until the
#     # moment of the request
#     for student, perc in cursor.fetchall():
#         data["students"].append(student)
#         data["perc"].append(round(float(perc), 2))
    
#     return data
