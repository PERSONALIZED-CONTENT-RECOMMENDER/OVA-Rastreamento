use ova_db;

with ova_questions as (
	select question_id
    from questions
    where ova_id = 1
)
select s.student_name, count(sub_q.question_id) / (
	select count(*)
    from ova_questions
)
from students s
left join (
	select q.question_id, a.student_id
    from questions q
	inner join answers a
	on a.question_id = q.question_id
) sub_q
on s.student_id = sub_q.student_id
group by s.student_id;