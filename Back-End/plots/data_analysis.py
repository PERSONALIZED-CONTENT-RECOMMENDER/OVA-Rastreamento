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

#select para desempenho geral do estudante no curso

# select s.student_name, count(i.interaction_id) as count
# from (
# 	select *
#     from students
#     where course_id = 1
# ) s
# left join interactions i
# on i.student_id = s.student_id
# left join ovas o
# on i.ova_id = o.ova_id
# left join competencies c
# on o.competency_id = c.competency_id
# left join (
# 	select *
#     from offerings
#     where course_id = 1
# ) cs
# on c.subject_id = cs.subject_id
# group by s.student_name