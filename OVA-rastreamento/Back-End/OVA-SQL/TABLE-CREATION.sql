use OVA_DB;

create table COURSE (
	COURSE_ID int primary key not null,
    COURSE_NAME varchar(50)
);

create table STUDENT (
	RA varchar(10) primary key not null,
    STUDENT_PASSWORD varchar(50),
    STUDENT_NAME varchar(255),
    COURSE_ID int,
    foreign key (COURSE_ID) references COURSE(COURSE_ID) on delete cascade on update cascade
);

create table OVA (
	OVA_ID int primary key not null,
    OVA_NAME varchar(30),
    COURSE_ID int,
    ABSTRACT text,
    HMTL_LINK text,
    foreign key (COURSE_ID) references COURSE(COURSE_ID) on delete cascade on update cascade
);

create table INTERACTION (
	INTERACTION_ID int primary key not null,
    INTERACTION_DATE date,
    INTERACTION_TIME time,
    STUDENT_ACTION text,
    STUDENT_RA varchar(10),
    OVA_ID int,
    foreign key (STUDENT_RA) references STUDENT(RA) on delete cascade on update cascade,
    foreign key (OVA_ID) references OVA(OVA_ID) on delete cascade on update cascade
);