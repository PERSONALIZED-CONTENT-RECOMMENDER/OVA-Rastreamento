use ova_db;

insert into courses 
values 
(100, ""),
(1, "Engenharia de Computação"),
(2, "Engenharia de Controle e Automação"),
(3, "Engenharia Química"),
(4, "Engenharia Elétrica"),
(5, "Engenharia de Produção"),
(6, "Engenharia Civil"),
(7, "Engenharia Mecânica"),
(8, "Arquitetura e Urbanismo");

insert into course_subjects
values
(1, "Cálculo A"),
(2, "Metodologia da Pesquisa"),
(3, "Compiladores"),
(4, "Banco de Dados 1"),
(5, "Controle Digital Aplicado"),
(6, "Sistemas a Eventos Discretos"),
(7, "Engenharia Bioquímica"),
(8, "Projetos de Processos Químicos 2"),
(9, "Acionamentos Elétricos"),
(10, "Eletromagnetismo"),
(11, "Comércio Exterior"),
(12, "Tecnologias DIgitais na Produção"),
(13, "Estruturas de Madeira"),
(14, "Obras de Terra"),
(15, "Processos de Soldagem"),
(16, "Trocadores de Calor"),
(17, "Intraestrutura Urbana"),
(18, "Design de Interiores"),
(19, "Patrimônio Histórico");

insert into offerings
values
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 2, 1),
(6, 2, 2),
(7, 2, 5),
(8, 2, 6),
(9, 3, 1),
(10, 3, 2),
(11, 3, 7),
(12, 3, 8),
(13, 4, 1),
(14, 4, 2),
(15, 4, 9),
(16, 4, 10),
(17, 5, 1),
(18, 5, 2),
(19, 5, 11),
(20, 5, 12),
(21, 6, 1),
(22, 6, 2),
(23, 6, 13),
(24, 6, 14),
(25, 7, 1),
(26, 7, 2),
(27, 7, 15),
(28, 7, 16),
(29, 8, 2),
(30, 8, 17),
(31, 8, 18),
(32, 8, 19);

insert into students
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

#insert into ovas
#values
#(1, "Computação Quântica", 1, "quantum-computing.html"),
#(2, "Visão Computacional", 1, "computer-vision.html"),
#(3, "Machine Learning", 1, "machine-learning.html"),
#(4, "Circuitos Elétricos", 4, "eletric-circuits.html"),
#(5, "Modelagem e Controle de Sistemas", 4, "modeling-control.html");