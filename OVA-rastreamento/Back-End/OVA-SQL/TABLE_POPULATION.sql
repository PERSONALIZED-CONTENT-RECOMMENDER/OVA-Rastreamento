use OVA_DB;

insert into COURSE 
values 
	(1, "Engenharia de Computação"),
	(2, "Engenharia de Controle e Automação"),
    (3, "Engenharia Química"),
    (4, "Engenharia Elétrica"),
    (5, "Engenharia de Produção"),
    (6, "Engenharia Civil"),
    (7, "Ciência de Dados e Inteligência Artificial"),
    (8, "Arquitetura e Urbanismo"),
    (9, "Engenharia Mecânica");

insert into STUDENT
values
	("20A.752355", "Password-1", "Eduardo Fiscina Menezes Moraes", 1),
    ("10Q.178487", "Password-2", "Iago Santana Alfaya", 1),
	("67Z.406178", "Password-3", "Rodrigo de Jesus Macêdo", 1),
	("42L.910086", "Password-4", "André Lucas", 1),
	("49Z.339516", "Password-5", "João Carlos", 6),
	("22G.822160", "Password-6", "Hayana Fiscina Menezes Dias", 8);
    
insert into OVA
values
	(1, "Computação Quântica", 1, 2, "quantum-computing.html"),
    (2, "Visão Computacional", 1, 3, "computer-vision.html");
    
    