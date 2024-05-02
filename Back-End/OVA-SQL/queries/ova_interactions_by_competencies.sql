use ova_db;

select s.subject_name, c.competency_description, count(si.interaction_id) / (
	select sum(num_interactions) 
    from ovas 
    where competency_id = c.competency_id
)
from 
(
    select interaction_id, ova_id 
    from interactions 
    where student_id = 2
) si
right join ovas o on si.ova_id = o.ova_id
inner join competencies c on o.competency_id = c.competency_id
inner join course_subjects s on c.subject_id = s.subject_id
inner join offerings offe on s.subject_id = offe.subject_id
where offe.course_id = 1
group by s.subject_id, c.competency_id;