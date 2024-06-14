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
(1, "Computação Quântica", "quantum_computing.html", 1);

insert into questions
values
(1, "Qual das seguintes afirmações melhor descreve a superposição quântica?",
'{
  "alternatives": [
    "Um qubit pode estar em um estado de 0 ou 1.",
	"Um qubit pode estar em um estado de 0, 1 ou ambos ao mesmo tempo.",
	"Um qubit só pode ser 0 ou 1 após a medição.",
	"Um qubit não pode mudar seu estado uma vez definido."
  ]
}', "b", false, 1, 1),
(2, "O que é entrelaçamento quântico?",
'{
  "alternatives": [
	"A capacidade de um qubit ser 0 e 1 simultaneamente.",
	"A conexão instantânea entre dois qubits separados por grandes distâncias.",
	"A propriedade de um qubit mudar de estado ao ser medido.",
	"A impossibilidade de medir o estado de um qubit."
  ]
}', "b", false, 1, 1),
(3, "Como os qubits diferem dos bits tradicionais?",
'{
  "alternatives": [
	"Qubits podem armazenar mais de dois estados.",
	"Qubits só podem estar em estado 0 ou 1.",
	"Qubits são usados apenas em computadores pessoais.",
	"Qubits não são afetados pelo ambiente."
  ]
}', "a", false, 1, 1),
(4, "Qual das seguintes áreas é mais impactada pela computação quântica?",
'{
  "alternatives": [
	"Medicina",
    "Finanças",
    "Segurança Cibernética",
    "Todas as opções acima"
  ]
}', "d", false, 1, 2),
(5, "Como a computação quântica pode melhorar a criptografia?",
'{
  "alternatives": [
    "Usando algoritmos que não podem ser quebrados por computadores clássicos.",
    "Aumentando a velocidade de cálculos de força bruta.",
    "Tornando os dados invisíveis para hackers.",
    "Permitindo a transmissão de dados sem necessidade de chaves."
  ]
}', "a", false, 1, 2),
(6, "Em qual das seguintes aplicações a simulação quântica é mais relevante?",
'{
  "alternatives": [
    "Desenvolvimento de novos medicamentos",
    "Criação de gráficos para jogos",
    "Redes sociais",
    "Edição de vídeo"
  ]
}', "a", false, 1, 2),
(7,"Qual dos seguintes NÃO é um desafio da computação quântica?",
'{
  "alternatives": [
    "Erros Quânticos",
    "Refrigeração",
    "Decoerência",
    "Falta de mão de obra qualificada"
  ]
}', "d", false, 1, 3),
(8, "O que é decoerência na computação quântica?",
'{
  "alternatives": [
    "A capacidade de um qubit manter sua superposição indefinidamente.",
    "A perda de informação quântica devido à interação com o ambiente.",
    "A necessidade de refrigerar qubits a temperaturas altas.",
    "A medição instantânea de dois qubits entrelaçados."
  ]
}', "b", false, 1, 3),
(9, "Por que a refrigeração é um desafio na computação quântica?",
'{
  "alternatives": [
    "Porque os qubits precisam ser aquecidos constantemente.",
    "Porque os qubits funcionam melhor em temperaturas ambiente.",
    "Porque os qubits precisam ser mantidos a temperaturas próximas do zero absoluto.",
    "Porque a refrigeração não afeta o estado dos qubits."
  ]
}', "c", false, 1, 3);