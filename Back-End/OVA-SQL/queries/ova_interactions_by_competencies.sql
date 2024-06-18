use ova_db;

select cs.subject_name, c.competency_description, count(sub_q.answer_id) / 
(
	select count(*)
    from questions
    where competency_id = c.competency_id
)
from competencies c
inner join course_subjects cs
on c.subject_id = cs.subject_id
left join (
	select a.answer_id, q.competency_id
    from answers a
	inner join questions q
	on q.question_id = a.question_id
    where a.student_id = 1
) sub_q
on sub_q.competency_id = c.competency_id
group by cs.subject_id, c.competency_id;