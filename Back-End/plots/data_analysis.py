# this lines below enable import from other submodules
import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

# necessary libraries import
from collections import defaultdict
from base import db
import json

# returns all the interaction that a student made in the ovas, grouped by
# competencies of each course subject
def ova_interactions_by_competencies(data):
    # reuse the connection if its already open
    db.connect(reuse_if_open=True)
    student_id = data["student_id"]
    course_id = data["course_id"]
    
    # do the query
    query = (f"""select cs.subject_name, c.competency_description, count(sub_q.answer_id), 
(
	select count(*)
    from questions
    where competency_id = c.competency_id
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
    where a.student_id = {student_id}
) sub_q
on sub_q.competency_id = c.competency_id
where offe.course_id = {course_id}
group by cs.subject_id, c.competency_id""")
    
    # execute raw sql due to complexity
    cursor = db.execute_sql(query)
    data = cursor.fetchall()
    
    # use the defaultdict to handle automatically the key error of a dict
    result = defaultdict(list)
    for row in data:
        result[row[0]].append((row[1], int(row[2]), int(row[3])))
        
    # return the result and the max of competencies that a subject have
    # to show differents amounts of columns in the front end graphic    
    return "Title", result, max(list(map(lambda x: len(x), result.values())))

# given an id of a course, return the general performance of each student
# in percentage
def course_general_performance(course_id):
    # reuse the connection if its already open
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
    
    # execute raw sql due to complexity
    cursor = db.execute_sql(query)
    data = {"students": [], "perc": []}
    
    # append the student and the percentage achieved until the
    # moment of the request
    for student, perc in cursor.fetchall():
        data["students"].append(student)
        data["perc"].append(round(float(perc), 2))
    
    return data

# given an ova id, returns the performance of each student on it
def ova_performance_by_students(data):
    # reuse the connection if its already open
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
    
    # execute raw sql due to complexity
    cursor = db.execute_sql(query)
    data = {"students": [], "perc": []}
    
    # append the student and the percentage achieved until the
    # moment of the request
    for student, perc in cursor.fetchall():
        data["students"].append(student)
        data["perc"].append(round(float(perc), 2))
    
    return data

# given an competency id, returns the performance of each student on it
# def competency_performance_by_students(competency_id):
#     # reuse the connection if its already open
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
    
#     # execute raw sql due to complexity
#     cursor = db.execute_sql(query)
#     data = {"students": [], "perc": []}
    
#     # append the student and the percentage achieved until the
#     # moment of the request
#     for student, perc in cursor.fetchall():
#         data["students"].append(student)
#         data["perc"].append(round(float(perc), 2))
    
#     return data