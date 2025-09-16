# Case de engenharia Itau - .NodeJS

## Pré Requisitos 
### Verificar versão do Node.js (deve ser 14.x ou superior)
node --version

### Verificar se o Git está instalado
git --version

## Rodar o projeto

cd nodeAPIcase

## Instalar dependências do backend
npm install

## Iniciar o servidor backend
node server.js

(O backend estará rodando em http://localhost:8080)


## Em outro terminal, navegar até a pasta do frontend
cd frontend

## Instalar dependências do frontend
npm install

## Iniciar o servidor de desenvolvimento do Angular
npm start

(O frontend estará rodando em http://localhost:4200)

## Testes

npm install axios --save-dev

cd tests

(RODAR
curl -X POST http://localhost:8080/clientes -H "Content-Type: application/json" -d '{
  "nome": "Cliente Teste",
  "email": "teste@example.com",
  "saldo": 5000
}'
)

npm test
ou 
node concurrent-transactions.test.js



-------------------------------------------------------------------

## Introdução
Neste projeto esta sendo utilizada a base de dados sqlite com a seguinte tabela:

    Tabela: CLIENTES > "Registro relacionados ao cadastro de clientes"
	- id    - INTEGER NOT NULL AUTOINCREMENT PRIMARY KEY
	- nome  - TEXT    NOT NULL
	- email - TEXT    NOT NULL UNIQUE
	- saldo - FLOAT

No projeto foi disponibilizada uma API de Clientes com os metodos abaixo realizando acoes diretas na base de dados:

	GET    clientes                - LISTAR TODOS OS CLIENTES CADASTRADOS
	GET    clientes/{ID}           - RETORNAR OS DETALHES DE UM DETERMINADO CLIENTES PELO ID
	POST   clientes                - REALIZA O CADASTRO DE UM NOVO CLIENTE
	PUT    clientes/{ID}           - EDITA O CADASTRO DE UM CLIENTE JÁ EXISTENTE
	DELETE clientes/{ID}           - EXCLUI O CADASTRO DE UM CLIENTE
	POST   clientes/{ID}/depositar - ADICIONA OU SUBTRAI DETERMINADO VALOR DO SALDO DE UM CLIENTE
    POST   clientes/{ID}/sacar     - ADICIONA OU SUBTRAI DETERMINADO VALOR DO SALDO DE UM CLIENTE

## Ações a serem realizadas
1. Faça o fork do projeto no seu github. Não realize commits na branch main e nem crie novas branchs.
2. O código da api de clientes faz mal uso dos objetos, não segue boas práticas e não possui qualidade. Refatore o codigo utilizando as melhores bibliotecas, praticas, patterns e garanta a qualidade da aplicação. Fique a vontade para mudar o que achar necessário.
3. O controle de saldo do cliente possui um erro. Identifique e implemente a correção
4. Para nós segurança é um tema sério, implemente as ações que achar prudente para garantir a segurança da sua aplicação
5. Utilizando o Angular, crie uma aplicação web  que consuma todos os metodos da API de clientes

Após finalizar o case, envie o link do seu github com a solução final para o e-mail andre.gattini@itau-unibanco.com.br
