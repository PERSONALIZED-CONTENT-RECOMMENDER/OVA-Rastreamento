use OVA_DB;

#drop table INTERACTION, OVA, STUDENT, COURSE

create table COURSE (
	COURSE_ID int primary key not null auto_increment,
    COURSE_NAME varchar(100)
);

create table STUDENT (
	RA varchar(10) primary key not null,
    STUDENT_PASSWORD varchar(30),
    STUDENT_NAME varchar(100),
    COURSE_ID int,
    foreign key (COURSE_ID) references COURSE(COURSE_ID) on delete cascade on update cascade
);

create table OVA (
	OVA_ID int primary key not null auto_increment,
    OVA_NAME varchar(70),
    COURSE_ID int,
    COMPLEXITY text,
    LINK text,
    foreign key (COURSE_ID) references COURSE(COURSE_ID) on delete cascade on update cascade
);

create table INTERACTION (
	INTERACTION_ID int primary key not null auto_increment,
    INTERACTION_DATE date,
    INTERACTION_TIME time,
    STUDENT_ACTION text,
    STUDENT_RA varchar(10),
    OVA_ID int,
    foreign key (STUDENT_RA) references STUDENT(RA) on delete cascade on update cascade,
    foreign key (OVA_ID) references OVA(OVA_ID) on delete cascade on update cascade
);