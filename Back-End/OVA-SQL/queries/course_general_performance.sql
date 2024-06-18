use ova_db;

select s.student_name, count(sub_q.answer_id) / (
	select count(q.question_id)
    from questions q
    inner join competencies c
    on q.competency_id = c.competency_id
    inner join course_subjects cs
    on c.subject_id = cs.subject_id
    inner join offerings offe
    on cs.subject_id = offe.subject_id
    where offe.course_id = 1
) as perc
from students s
left join (
	select answer_id, student_id
    from answers a
) sub_q
on s.student_id = sub_q.student_id
where s.is_admin = false
group by s.student_id;