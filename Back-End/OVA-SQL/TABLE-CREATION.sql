drop table interactions, ovas, students, competencies, offerings, course_subjects, courses;

create table courses (
	course_id int primary key not null,
    course_name varchar(100)
);

create table course_subjects (
	subject_id int primary key not null,
    subject_name varchar(255)
);

create table offerings (
	offering_id int primary key not null,
    course_id int,
    subject_id int,
    foreign key (course_id) references courses(course_id) on delete cascade on update cascade,
    foreign key (subject_id) references course_subjects(subject_id) on delete cascade on update cascade,
    constraint uc_offering unique(course_id, subject_id)
);

create table competencies (
	competency_id int primary key not null,
    competency_description varchar(255),
    subject_id int,
    foreign key (subject_id) references course_subjects(subject_id) on delete cascade on update cascade
);

create table ovas (
	ova_id int primary key not null,
    ova_name varchar(255),
    link varchar(255),
    competency_id int,
    foreign key (competency_id) references competencies(competency_id) on delete cascade on update cascade
);

create table students (
	student_id int primary key not null,
	ra varchar(10),
    student_password varchar(30),
    student_name varchar(100),
    course_id int,
    is_admin bit,
    foreign key (course_id) references courses(course_id) on delete cascade on update cascade
);

create table interactions (
	interaction_id int primary key not null,
    interaction_date date,
    interaction_time time,
    student_action varchar(255),
    correct_answer bit,
    percentage_achieved float,
    percentage_name varchar(255),
    student_id int,
    ova_id int,
    foreign key (student_id) references students(student_id) on delete cascade on update cascade,
    foreign key (ova_id) references ovas(ova_id) on delete cascade on update cascade
);