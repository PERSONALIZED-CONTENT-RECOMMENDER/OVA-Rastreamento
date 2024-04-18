import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from collections import defaultdict
from base import db
import json

def ova_interactions_by_student(data, grouping_type="subject"):
    db.connect(reuse_if_open=True)
    # cursor = db.execute_sql()
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
    
    if (grouping_type == "competency"):
        group_columns = "s.subject_name, c.competency_description"
        cursor = db.execute_sql(query.format(group_columns, student_id, course_id, group_columns))
        
        result = defaultdict(lambda: defaultdict(list))
        for row in cursor.fetchall():
            print(row)
            result[row[0]][row[1]].append(row[2])

        return "Title", result
    else:
        group_columns = "o.ova_name"
        cursor = db.execute_sql(query.format(group_columns, student_id, course_id, group_columns))
    
        result = defaultdict(int)
        for row in cursor.fetchall():
            result[row[0]] += row[1]

        return "Title", result
    
    # print("\n\n\n\n\n")
    # print(json.dumps(result, ensure_ascii=False))
    
# data = {
#     "student_id": 2,
#     "course_id": 1
# }
# _, result = ova_interactions_by_student(data)
# print(result)

# ova_interactions_by_student(data, "competency")