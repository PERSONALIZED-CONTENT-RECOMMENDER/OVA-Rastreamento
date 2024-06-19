use ova_db;

select s.student_name, count(sub_q.question_id) / (
	select count(*)
    from questions
    where ova_id = 1
)
from students s
left join (
	select q.question_id, a.student_id
    from questions q
	inner join answers a
	on a.question_id = q.question_id
    where ova_id = 1
) sub_q
on s.student_id = sub_q.student_id
where s.is_admin = false
group by s.student_id;