use ova_db;

insert into course 
values 
(100, ""),
(1, "Engenharia de Computação"),
(2, "Engenharia de Controle e Automação"),
(3, "Engenharia Química"),
(4, "Engenharia Elétrica"),
(5, "Engenharia de Produção"),
(6, "Engenharia Civil"),
(7, "Arquitetura e Urbanismo"),
(8, "Engenharia Mecânica");

insert into course_subjects
values
(1, "Metodologia de Pesquisa"),
(2, "Relações Humanas no Trabalho"),
(3, "Cálculo 1"),
(4, "Banco de Dados 2"),
(5, "Controle Digital Aplicado"),
(6, "Estequiometria Industrial"),
(7, "Eletromagnetismo"),
(8, "Pesquisa Operacional 1"),
(9, "Estradas 1"),
(10, "Design de Interiores"),
(11, "Máquinas de Fluxo");

insert into offerings
values
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 2, 1),
(6, 2, 2),
(7, 2, 3),
(8, 2, 5);

insert into student
values
("10A.047292", "Password-0", "", 100, true),
("20A.752355", "Password-1", "Eduardo Fiscina Menezes Moraes", 1, false),
("10Q.178487", "Password-2", "Iago Santana Alfaya", 1, false),
("67Z.406178", "Password-3", "Rodrigo de Jesus Macêdo", 1, false),
("42L.910086", "Password-4", "André Lucas", 1, false),
("49Z.339516", "Password-5", "João Carlos", 6, false),
("22G.822160", "Password-6", "Hayana Fiscina Menezes Dias", 7, false),
("30F.340348", "Password-7", "Carlos Henrique de Brandão", 4, false),
("50Y.102840", "Password-8", "Maria Clara Barbosa", 4, false);

insert into ova
values
(1, "Computação Quântica", 1, "quantum-computing.html"),
(2, "Visão Computacional", 1, "computer-vision.html"),
(3, "Machine Learning", 1, "machine-learning.html"),
(4, "Circuitos Elétricos", 4, "eletric-circuits.html"),
(5, "Modelagem e Controle de Sistemas", 4, "modeling-control.html");