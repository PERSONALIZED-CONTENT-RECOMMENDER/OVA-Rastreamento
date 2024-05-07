use ova_db;

with course_ovas as (
	select o.ova_id, o.num_interactions 
    from ovas o
	inner join competencies c
	on o.competency_id = c.competency_id
	inner join course_subjects cs
	on c.subject_id = cs.subject_id
	inner join offerings offe
	on cs.subject_id = offe.subject_id
	where offe.course_id = 1
)
select s.student_name, (case when ci.count is null then 0 else ci.count end) / (
	select sum(num_interactions) from course_ovas
)
from students s
left join (
	select i.student_id, count(i.interaction_id) as count
	from interactions i
	inner join course_ovas o
    on o.ova_id = i.ova_id
    group by i.student_id
) ci
on s.student_id = ci.student_id
where s.course_id = 1;