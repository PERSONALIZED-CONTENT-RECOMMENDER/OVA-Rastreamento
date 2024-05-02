use ova_db;

select s.student_name, count(i.interaction_id) / (select num_interactions from ovas where ova_id = 1)
from students s
left join (
	select interaction_id, student_id 
    from interactions
    where ova_id = 1
) ova_interactions
on s.student_id = i.student_id
where s.course_id = 1
group by s.student_name