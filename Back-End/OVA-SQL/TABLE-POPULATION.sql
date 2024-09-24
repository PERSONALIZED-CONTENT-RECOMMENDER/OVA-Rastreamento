use ova_db;

insert into courses 
values
(1, "Engenharia de Computação");

insert into course_subjects
values
(1, "Computação Quântica"),
(2, "Cálculo");

insert into offerings
values
(1, 1, 1),
(2, 1, 2);

insert into students
values
(1, "1", "1", "Eduardo", 1, false),
(2, "2", "2", "Gabriel", 1, false),
(3, "3", "3", "Yasmin", 1, false),
(4, "4", "4", "Sanval", 1, true),
(5, "5", "5", "Pedro", 1, false),
(6, "6", "6", "Thiago", 1, false),
(7, "7", "7", "Manuel", 1, false),
(8, "8", "8", "Angela", 1, false),
(9, "9", "9", "Ana", 1, false),
(10, "10", "10", "Ricardo", 1, false),
(11, "11", "11", "Cezar", 1, false),
(12, "12", "12", "Camilla", 1, false),
(13, "13", "13", "Rodrigo", 1, false),
(14, "14", "14", "Jaqueline", 1, false),
(15, "15", "15", "Gabriela", 1, false),
(16, "16", "16", "Sara", 1, false),
(17, "17", "17", "Paulo", 1, false),
(18, "18", "18", "Lucas", 1, false),
(19, "19", "19", "Roberto", 1, false),
(20, "20", "20", "Liz", 1, false),
(21, "21", "21", "Rafael", 1, false),
(22, "22", "22", "Neilton", 1, false),
(23, "23", "23", "Caio", 1, false),
(24, "24", "24", "Leonardo", 1, false);


insert into competencies
values
(1, "Compreender os princípios fundamentais da computação quântica", 1),
(2, "Analisar as aplicações da computação quântica", 1),
(3, "Reconhecer os desafios e limitações técnicos da computação quântica", 1),
(4, "Calcular derivadas e integrais de funções polinomiais e trigonométricas", 2),
(5, "Aplicar os conceitos de limites em funções simples, incluindo a identificação de comportamentos em infinitos", 2),
(6, "Identificar pontos de máximo e mínimo em funções, utilizando o cálculo diferencial para a análise de curvas", 2);

insert into ovas
values
(1, "Computação Quântica", "quantum_computing.html", 1),
(2, "Cálculo", "calculus.html", 2);

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
}', "b", 1, 1),
(2, "O que é entrelaçamento quântico?",
'{
  "alternatives": [
	"A capacidade de um qubit ser 0 e 1 simultaneamente.",
	"A conexão instantânea entre dois qubits separados por grandes distâncias.",
	"A propriedade de um qubit mudar de estado ao ser medido.",
	"A impossibilidade de medir o estado de um qubit."
  ]
}', "b", 1, 1),
(3, "Como os qubits diferem dos bits tradicionais?",
'{
  "alternatives": [
	"Qubits podem armazenar mais de dois estados.",
	"Qubits só podem estar em estado 0 ou 1.",
	"Qubits são usados apenas em computadores pessoais.",
	"Qubits não são afetados pelo ambiente."
  ]
}', "a", 1, 1),
(4, "Qual das seguintes áreas é mais impactada pela computação quântica?",
'{
  "alternatives": [
	"Medicina",
    "Finanças",
    "Segurança Cibernética",
    "Todas as opções acima"
  ]
}', "d", 1, 2),
(5, "Como a computação quântica pode melhorar a criptografia?",
'{
  "alternatives": [
    "Usando algoritmos que não podem ser quebrados por computadores clássicos.",
    "Aumentando a velocidade de cálculos de força bruta.",
    "Tornando os dados invisíveis para hackers.",
    "Permitindo a transmissão de dados sem necessidade de chaves."
  ]
}', "a", 1, 2),
(6, "Em qual das seguintes aplicações a simulação quântica é mais relevante?",
'{
  "alternatives": [
    "Desenvolvimento de novos medicamentos",
    "Criação de gráficos para jogos",
    "Redes sociais",
    "Edição de vídeo"
  ]
}', "a", 1, 2),
(7,"Qual dos seguintes NÃO é um desafio da computação quântica?",
'{
  "alternatives": [
    "Erros Quânticos",
    "Refrigeração",
    "Decoerência",
    "Falta de mão de obra qualificada"
  ]
}', "d", 1, 3),
(8, "O que é decoerência na computação quântica?",
'{
  "alternatives": [
    "A capacidade de um qubit manter sua superposição indefinidamente.",
    "A perda de informação quântica devido à interação com o ambiente.",
    "A necessidade de refrigerar qubits a temperaturas altas.",
    "A medição instantânea de dois qubits entrelaçados."
  ]
}', "b", 1, 3),
(9, "Por que a refrigeração é um desafio na computação quântica?",
'{
  "alternatives": [
    "Porque os qubits precisam ser aquecidos constantemente.",
    "Porque os qubits funcionam melhor em temperaturas ambiente.",
    "Porque os qubits precisam ser mantidos a temperaturas próximas do zero absoluto.",
    "Porque a refrigeração não afeta o estado dos qubits."
  ]
}', "c", 1, 3),
(10, "Calcule a derivada da função  f(x)=3x²+2x+1.",
'{
  "alternatives": [
    "3x²+2",
    "6x+2",
    "6x²+2",
    "6x+1"
  ]
}', "b", 2, 4),
(11, "Qual é a derivada da função g(x)=e^x?",
'{
  "alternatives": [
	"e^x",
    "x.e^x",
    "e^(x-1)",
    "x.e^(x-1)"
  ]
}', "a", 2, 4),
(12, "Calcule a integral indefinida de f(x)=4x³",
'{
  "alternatives": [
	"x⁴+C",
    "x⁴",
    "(x⁴/4)+C",
    "(x⁴/2)+C"
  ]
}', "a", 2, 4),
(13, "Calcule o limite lim(x->2)(3x-4)",
'{
  "alternatives": [
	"6",
    "4",
    "2",
    "8"
  ]
}', "c", 2, 5),
(14, "Qual o limite lim(x->infinito)(1/x)?",
'{
  "alternatives": [
	"1",
    "0",
    "Infinito",
    "-1"
  ]
}', "b", 2, 5),
(15, "Calcule o limite da função (3x²-2x+1)/(x-1) quando x tende a 1",
'{
  "alternatives": [
    "Infinito",
    "1",
    "4",
    "2",
    "Não existe"
  ]
}', "c", 2, 5),
(16, "A função f(x)=x² tem um ponto de mínimo em:",
'{
  "alternatives": [
	"x=0",
    "x=1",
    "x=-1",
    "x=2"
  ]
}', "a", 2, 6),
(17, "Para a função h(x)=-2x²+4x, o ponto de máximo é:",
'{
  "alternatives": [
	"x=0",
    "x=-1",
    "x=2",
    "x=1"
  ]
}', "d", 2, 6),
(18, "Considere a função f(x)=-2x²+4x+1. Determine se o ponto crítico da função é um ponto máximo ou mínimo.",
'{
  "alternatives": [
    "Ponto máximo",
    "Ponto mínimo",
    "Não há ponto crítico",
    "Nenhum dos anteriores"
  ]
}', "a", 2, 6);