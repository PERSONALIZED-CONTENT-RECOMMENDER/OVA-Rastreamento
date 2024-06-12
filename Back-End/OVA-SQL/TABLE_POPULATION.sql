use ova_db;

insert into courses 
values 
(100, ""),
(1, "Engenharia de Computação");

insert into course_subjects
values
(1, "Computação Quântica");

insert into offerings
values
(1, 1, 1);

insert into students
values
(1, "0", "0", "", 100, true),
(2, "1", "1", "Eduardo", 1, false),
(3, "2", "2", "Gabriel", 1, false),
(4, "3", "3", "Yasmin", 1, false),
(5, "4", "4", "Sanval", 1, true);

insert into competencies
values
(1, "Compreender os conceitos fundamentais da computação quântica", 1),
(2, "Identificar as aplicações práticas da computação quântica", 1),
(3, "Avaliar os desafios e limitações da computação quântica", 1);

insert into ovas
values
(1, "Computação Quântica", "quantum_computing.html", 30, 1);
