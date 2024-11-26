# Desafio BeTalen!

O Teste Técnico Backend BeTalent consiste em estruturar uma API RESTful conectada a um banco de dados.
Trata-se de um sistema que permite cadastrar usuários externos. Ao realizarem login, estes usuários deverão poder registrar clientes, produtos e vendas.
O(a) candidato(a) deve desenvolver o projeto em um dos seguintes frameworks: **Adonis (Node.js)** ou Laravel (PHP).
Pode-se usar recursos e bibliotecas que auxiliam na administração do banco de dados (Eloquent, **Lucid**, Knex, Bookshelf etc.);

# Candidato
- Nome: Francisco Alan do Nascimento Marinho
- Email: alanmarinho020@gmail.com
- Repositório: https://github.com/alanmarinho/desafio_BeTalent

# Stack escolhida

 - Framework: **Adonis (Node.js)**
 Motivação: Maior afinidade do candidato com a  linguagem de programação **JavaScrip/TypeScript**
 
 - Administração do banco de dados: **Lucid**
 Motivação: Integração nativa com o framework **Adonis** e maior facilidade na administração do banco de dados.
 
 - Banco de dados: **MySQL**
 Motivação:  requisito fixo.

##  Requisitos

### Projeto 
- Node **v20.14.0+** devidamente instalado.
- Npm **v10.9.0+** devidamente instalado.
- Git **v2.45.2+** devidamente instalado.

### Ferramenta de consulta a APIs - sugestões
- Insomnia  -  **Recomendado**  [Arquivo Insomnia do projeto](#Ambiente_de_teste)
- Postman.
- Outra a gosto.

### Banco de dados
####  Usando Docker
- Docker **v27.3.1+** devidamente instalado.

#### Usando MySQL nativo
- MySQL Server **v8.0.40+** devidamente instalado

## Como executar

### Clonar repositório
1. Clone o repositório com o comando

 `git clone https://github.com/alanmarinho/desafio_BeTalent.git`

### Configuração do projeto
1. Arquivo .env
- Criar um arquivo chamado *.env* na raiz do projeto usando o arquivo *.env.example* como exemplo (ele já vem com 2 exemplos completos usando Docker e MySQL nativo).
- Opcionalmente, uma nova key pode ser gerada para a aplicação usando o comando `node ./tools/generate64bitkey.cjs` , basta copiar a key do console e substituir o campo **APP_KEY** no arquivo *.env*.

2. Projeto
- Instale as dependências usando o comando `npm install` na raiz do projeto

3. Banco de Dados
	1. Docker
		- Crie o contêiner  com o comando `docker-compose up -d` na raiz do projeto, aguarde a conclusão do processo, uma pasta chamada **db_data** deve ser gerada automaticamente, ele é a referência para o banco do contêiner , caso necessário remover um banco já gerado (não somente o contêiner ), a pasta **db_data** deve ser deletada.
		- Opcionalmente a porta do contêiner  pode ser modificado para evitar conflitos com outros aplicativos, basta modificar a porta no arquivo *docker-compose.yml*, por padrão e porta é 3390 (é necessário alterar o valor **DB_PORT** no arquivo .env caso a porta padrão seja modificada em *docker-compose.yml*).
		> ports: <br>
		>\-  '127.0.0.1:**3390**:3306'
	2. MySQL nativo
		- Usando a porta padrão do MySQL **3306** logue com usuário **root** com o comando `mysql -u root -p` e insira a senha root criada no processo de instalação do **MySQL Server** em sua máquina. 
		- Crie o banco de dados com o comando `CREATE DATABASE desafio_betalent_alan_marinho;`, opcionalmente o nome do banco pode ser modificado, mas é necessário configurar o campo **DB_DATABASE** no arquivo *.env*.
	3. Execute a migração do banco com o comando `node ace migration:run`.
		- O seguinte corpo deve aparecer no console.
			> migrated database/migrations/1_create_users_table <br>
			> migrated database/migrations/2_create_clients_table <br>
			> migrated database/migrations/3_create_products_table <br>
			> migrated database/migrations/4_create_sessions_table <br>
			> migrated database/migrations/5_create_addresses_table <br>
			> migrated database/migrations/6_create_phones_table <br>
			> migrated database/migrations/7_create_sales_table<br>
		- Caso ocorra algum erro, verifique as dependências, analise o erro e refaça os passos anteriores, caso o erro persista, utilize a outra opção de banco de dados repetindo os passos anteriores para a respectiva opção de banco.
		- Com o sucesso dos passos anteriores, o projeto está pronto para rodar.

### Executando o projeto
1. Para executar o projeto utilize o comando `npm run dev` a mensagem **INFO (): started HTTP server on localhost:3333** de aparecer
2. Para confirmar a execução, acesse http://localhost:3333/, o corpo deve ser retornado 

	```
	{
		"working":true,
		"project_ulr":"https://github.com/alanmarinho/desafio_BeTalent"
	}
	```
# Docs

## Estrutura do banco de dados
### Tabelas e dados
1. Users
	- Função: Armazenar os dados dos Usuários, possui os seguintes campos:
	> id: integer--  PK <br>
	> name: string <br>
	> email: string   -- unique <br>
	> password: string  (hash) <br>
	> created_at: DataTime <br>
	> updated_at: DataTime <br>
2. Sessions
	- Função: armazenar os dados das **Sessões do Usuário**, principalmente a chave de assinatura de seus tokens JWT, possui os seguintes campos:
	> id: integer--  PK <br>
	> user_id: integer-- FK <br>
	> token_key: string <br>
	> created_at: DataTime <br>
	> updated_at: DataTime <br>
	
3. Clients
	- Função: Armazenar os dados do **Cliente**, possui os seguintes campos:
	> id: integer--  PK <br>
	> user_id: integer-- FK para o user que criou o cliente <br>
	> name: string <br>
	> CPF: string (unique somente junto com o user_id, [explicação](#Unicidade_Dupla)) <br>
	> created_at: DataTime <br>
	> updated_at: DataTime <br>

4. Products
- Função: Armazenar dos dados dos **Produtos**, possui os seguintes campos:
	> id: integer--  PK <br>
	> user_id: integer-- FK para o user que criou o produto <br>
	> name: string <br>
	> description: text (opcional)  <br>
	> unit_price: float <br>
	> deleted_in: DataTime (necessário para o SortDelete, [explicação](#softDelete)) <br>
	> created_at: DataTime <br>
	> updated_at: DataTime <br>
5. Addresses
- Função: Armazenar dos dados dos **Endereços dos Clientes**, possui os seguintes campos:
	> id: integer--  PK <br>
	> user_id: integer -- FK para o user que criou o endereço do cliente <br>
	> client_id: integer --  FK para o cliente <br>
	> road: string  <br>
	> number: integer  <br>
	> complement: string (opcional) <br>
	> neighborhood: string <br>
	> city: string  <br>
	> state: string  <br>
	> country: string  <br>
	> zip_code: string  <br>
	> created_at: DataTime <br>
	> updated_at: DataTime <br>
6. Phones
- Função: Armazenar os dados de  **Telefones dos Clientes**, possui os seguintes campos:
	> id: integer--  PK <br>
	> user_id: integer -- FK para o user que criou o endereço do cliente <br>
	> client_id: integer --  FK para o cliente <br>
	> number: string  -- ((XX) XXXXX-XXXX) || telefone válido <br>
	> created_at: DataTime <br>
	> updated_at: DataTime <br>
7. Sales
- Função: Armazenar os dados das **Vendas dos Clientes**, possui os seguintes campos:
	> id: integer--  PK <br>
	> user_id: integer -- FK para o user que criou o endereço do cliente <br>
	> client_id: integer --  FK para o cliente <br>
	> product_id: integer -- FK para o produto <br>
	> quantity: interger <br>
	> total_price: float <br>
	> unit_price: float <br>
	> sale_date: DataTime <br>
	> created_at: DataTime <br>
	
## Rotas
	** -> simboliza rota autenticada
	## -> simboliza rota extra criada 
1. Autenticação
	1,1. Rotas:
	> POST /login <br>
	> POST /logout **## <br>
	> POST /signup   <br>
	
	1.2. Funções
	-  /login  - Realizar o login, (aqui onde o **token** chega)
	- /logout - Remove a sessão logada (token no cabeçalho)
	- /signup  **    Cadastra um novo  **User**
	
2. Clientes **
	2.1. Rotas
	> GET /client/   -  (index)  ** <br>
    > GET /client/show/:id   -  (show)  ** <br>
    > POST /client/store   -  (store)  ** <br>
    > PUT /client/update/:id   -  (update)  ** <br>
    > DELETE /client/delete/:id   -  (delete)  ** <br>
    
    2.2. Funções
     - /client/  **  -  Listar todos os **Clientes** cadastrados (ordenado pelo id)
     - /client/show/:id   **  -  Mostrar dados detalhados de um **Cliente** + possibilidade de filtrar suas vendas por: todas, ano e ano+mês.
     -  /client/store  ** - Criar um novo **Cliente**
     - /client/update/:id   ** - Editar os dados de um **Cliente** (seu telefone e endereço também)
     - /client/delete/:id   ** - Deletar um **Cliente**, assim como todas as suas vendas, endereço e telefone.
     
3. Produtos**
	3.1. Rotas
	> GET /product/   -  (index)  ** <br>
   > GET /product/show/:id   -  (show)  ** <br>
   > POST /product/store   -  (store)  ** <br>
   > PUT /product/update/:id   -  (update)  ** <br>
   > PUT /product/delete/:id   -  (delete)  ** <br>
   > 
   3.2. Funções
      - **/product/**  **  -  Listar todos os **Produtos** cadastrados não *SoftDeletados* (ordenado alfabeticamente)
     - **/product/show/:id**   **  -  Mostrar dados detalhados de um **Produto** .
     -  **/product/store**  ** - Criar um novo **Produto**
     - **/product/update/:id**   ** - Editar os dados de um **Produto**, (inclusive reverter o SoftDelet).
     - **/product/delete/:id**   ** - Deletar um **Produto**, SoftDelet (ele é marcado como deletado e invalidado de outras operações, com exceção da de */product/update/:id*, onde ele pode ser novamente reabilitado no sistema através do campo `"deleted_in": false` no body.)
  4. Vendas
	  4.1. Rotas
		> GET /sale/   -  (index)  **## <br>
	    > GET /sale/show/:id   -  (show)  **##  <br>
	    > POST /sale/store   -  (store)  ** <br>
	    
4.2. Funções
 - **/sale/**  **##  -  Listar todas as **Vendas** cadastradas, que não tenha produtos deletados e ordem de data da venda mais recente primeiro.
 - **/sale/show/:id** **## - Mostrar detalhes de uma venda assim como o produto e o cliente da venda.
 - **/sale/store/** ** - Criar um nova venda de um produto para um cliente (exite a possibilidade de configurar uma data para venda, como o campo `sale_date: "YYYY-MM-DDThh:mm:ss.sss±hh:mm"` usando uma string de data **no padrão  ISO8601** não superior ao presente momento (ou seja dados no futuro) nem no passado inferior ao ano 2000, caso o campo  `sale_date` não seja fornecido a venda será registrada como sendo no instante da requisição.
 
## Autenticação
1. Definição
	- Método: Token JWT
	- Localização: Bearer ->  `Authorization: "Bearer <tokenJwt>"`
	- Abrangência: Rotas
	```
	 /logout
	 /clients/...
	 /products/...
	 /sales/...
	 ```
2. Metodologia 
	a. Foi utilizado a noção de seções para autenticação, depois de cadastrado um **User** pode realizar *login* com **email** + **password** corretas, após isso uma **chave 256bits** é gerada com o auxílio da biblioteca *crypto*, essa chave então é usada para assinar o **token JWT** do user, antes de enviar o **token JWT**para o user uma **Sessão** é criada na tabela **Sessions** responsável por guardar a **chave 256bits** que é criptografada com o algoritmo *aes-256-ctr* +*IV (initialization vector)*+ 
	*+*APP_KEY (256bit)* com o auxílio biblioteca *crypto*, após o sucesso no armazenamento, o **token JWT**é enviado para o usuário que deve  usá-lo nas rotas autenticadas.
	
3. Motivação da Metodologia 
	- Desacoplamento das assinaturas dos tokens de **User** da APP_KEY e delegando essa responsabilidade para a **Chave de Sessão**, tornando cada token utilizável somente na sua respectiva sessão existente.
	-  Invalidação de tokens facilitada: Caso uma sessão seja deletada (*/logout*), **TODOS** os tokens gerados naquela sessão se tornarão inválidos, já que a chave se assinatura deles foi deletada, tonando o uso de tokens de forma indevida mais dificultoso.

4. Execução
	- Para aplicar a autenticação nas rotas corretas, usou-se o conceito de *Middlewares* aplicado aos grupos de rotas *Adonis* que devem ser protegidas. Um *Middlewre de Autenticação* (*auth_middleware.ts*) foi criado para receber o token em `Authorization: "Bearer <tokenJwt>"` localizado no **Header** da requisição e processá-lo: recepção -> decodificação -> busca da sessão correspondente -> validação com a chave da sessão. Se válido executa `next()` liberando o fluxo para os validadores de conteúdo e ocasionalmente os *Controllers* correspondentes, se não Válido, impede a requisição de prosseguir.
	Ex: 
	```
	  router.group(() => {
		   // routes here
	  })
	  .prefix('/routeGroup')
	  .use(middleware.auth());
	                   ☝️
	```
## Requisições e Respostas
1. Padronização: JSON
	a. Um padronizador de respostas foi implementado para Success e Error afim de tornar o retorno o mais estruturado e organizado possível.
	b. Todas as datas não retornadas em String no padrão ISO8601 - "YYYY-MM-DDThh:mm:ss.sss±hh:mm".
	
	### Success 
	```
	{
		"status": 200,
		"msg": "Success message",
		"data": {},
		"actions": {}
	}
	```
	- **status** - Número status HTTP tipo sucesso (200)
	- **msg** - Mensagem informativa
	- **data** - (Opcional) Objeto contendo dados relevantes para a request. 
	 <a id="actions_return"></a>
	- **actions** - (Opcional) Objeto contendo ações que o consumidor deve realizar, pode ser do tipo **remove_token**, se apresentando da seguinte forma :

	```
	"actions": {
		"remove_token": true
	}
	```
	- **remove_token**: simboliza que o consumidor remover o seu token do Bearer e ocasionalmente relogin, quando **remove_token** é disparado nos caso de a sessão existir, ela é removida pelo back-end.

	### Error
	```
	{
		"status": 400,
		"msg": "Error message",
		"fields": [],
		"actions": {},
		"parameters": []
	}
	```
	- **status** - Número status HTTP tipo error (400-500)
	- **msg** - Mensagem informativa
	- **fields** - (Opcional) Lista de objetos contendo os nomes dos campos com erro e um mesagem informativa individual de cada campo se apresentando da seguinte forma :
	```
	"fields": [
		{
			"field": "CPF",
			"message": "Not valid CPF"
		},
		{
			"field": "address.zip_code",
			"message": "The zip_code field is required"
		}	
	]
	```
	- **actions** -  (Opcional) Objeto contendo ações que o consumidor deve realizar, podem ser do tipo **remove_token**, se apresentando da seguinte forma: [formato](#actions_return)
	- **parameters**- (Opcional) Objetivo contendo o nome dos parâmetros URL que geraram error, se apresentando da seguinte forma: 
	```
		"parameters": [
		{
			"parameter": "id",
			"message": "Product not found"
		},
		{
			"parameter": "sale_year",
			"message": "The parameter sale_year is required"
		}	
	]
	```
	###  Rotas de Autenticação 

	#### **/login**  POST
	Body

	```
	{
		"email":"user@email.com",
		"password":"userPassword"
	}
	```
	- **email** - email válido
	- **password** - senha do usuário.
		
	Resposta Success
	
	```
	{
	"status": 200,
	"msg": "login successful",
	"data": {
		"authToken": "<tokenJWT>"
		}
	}
	```
	
	Resposta Error (uma delas - senha incorreta) 
	
	```
	{
	"msg": "Incorrect password",
	"status": 401,
	"fields": [
		{
			"field": "password",
			"message": "Incorrect password"
		}
	]
	}
	```
	
	###  **/signup** POST
	
	Body
		
	```
	{
		"email":"user@email.com",
		"password": "str0ngP@ssw0rd",
		"name":"User Name"
	}
	```
	- **email** - Email do usuário
	-	**password** - Senha forte, contendo: mínimo 6 caracteres dentre ele pelo menos 1 - letras e maiúsculas, número, caractere especial da lista [!@#$%^&*?]
	-	**name** - Nome do usuário, somente letras e espaços.

	Resposta Success
	```
	{
	"status": 201,
	"msg": "Success create user",
	"data": {
		"id": 4,
		"name": "User Name"
		}
	}
	```
	### **/logout**  POST 
	
	**Body** - Sem body
	
	 **Reader** 
	```
	"Authorization": "Bearrer <TokenJWT>"
	```
	
	- **\<TokenJWT>**  - Token obtido com o **login**.

	Resposta Success
	```
	{
		"status": 200,
		"msg": "Success logout"
	}
	```
	
	Resposta Error
	```
	{
		"msg": "Token not send",
		"status": 401,
		"actions": {
			"remove_token": true
		}
	}
	```
	### Rotas Cliente (todas precisam do token no  `Bearrer`)

	####  **/client/**  GET
	**Body** - Sem body
	**Parâmetros** -  Sem Parâmetros
	
	Resposta Success - **/client/**
	```
	{
	"status": 200,
	"msg": "Success get clients",
	"data": [
		{
			"id": 1,
			"name": "João",
			"created_at": "2024-11-22T18:16:25.000-03:00"
		},
		{
			"id": 2,
			"name": "Maria",
			"created_at": "2024-11-23T18:16:25.000-03:00"
		}
	]
	}
	```
	

	Resposta Error  - **/client/** (Token Inválido)
	<a id="Not_authenticated"></a>
	```
	{
	"msg": "Not authenticated",
	"status": 401,
	"actions": {
		"remove_token": true
		}
	}
	```
	####  **/client/show/:id?all_sales=false&sales_year=2024&sales_month=10** GET
	*OBS1: todas as vendas vem na ordenado mais recente primeiro.*
	**Body** - Sem body
	**Parâmetros** 
	
	-  **id** *Número Positivo* -  ID do cliente que deseja ver mais detalhes.
	-  **all_sales** *Boleano* -  Indicar a listagem de todas as vendas.
	- **sales_year** *Número positivo acima de 2000 e menor que o atual ano* - Indica o ano das vendas do cliente
	- **sales_month** Indica o mês das vendas do cliente valores entre 1-12.
		- Combinações:
				-  **/client/show/:id/** ou + **?all_sales=false** -> Detalha o **Cliente** id sem suas vendas.
				- **/client/show/:id/?all_sales=true** -. Detalha o **Cliente** id com todas as suas vendas.
				- **/client/show/:id/?sales_year=2024** - Detalha o **Cliente** id filtrando as suas vendas pelo *ano*.
				- **/client/show/:id/?sales_year=2024&sales_month=11** - Detalha o **Cliente** id filtrando suas vendas por *ano + mês*.
				
			*OBS2:
			 * O parâmetro **all_sales** com valos *false* não possui influência e pode ser omitido.
			 * O parâmetro **all_sales** com valos *true*, sobrepõe todos os outros parâmetros.
			 *  O parâmetro  **sales_month** só pode ser usado em conjunto com **sales_year**.
	
	Resposta Success - **/client/show/6/?sales_year=2024&sales_month=10**

	```
	{
	"status": 200,
	"msg": "Success get client",
	"data": {
		"id": 6,
		"name": "Alan Marinho",
		"sales": [
			{
				"id": 4,
				"unit_price": 1567.9,
				"quantity": 2,
				"total_price": 3135.8,
				"sale_date": "2024-10-22T18:16:25.000-03:00"
			},
			{
				"id": 5,
				"unit_price": 1567.9,
				"quantity": 2,
				"total_price": 3135.8,
				"sale_date": "2024-10-03T18:16:25.000-03:00"
			}
		],
		"addresses": [
			{
				"id": 6,
				"city": "Guaraciaba do Norte",
				"road": "Rua das Flores",
				"number": 123
			}
		],
		"phones": [
			{
				"id": 6,
				"number": "(88) 98236-4526"
			}
		],
		"created_at": "2024-11-25T14:34:04.000-03:00",
		"updated_at": "2024-11-25T14:38:58.000-03:00"
	}
	}
	```
	Resposta ERROR - **/client/show/6/?sales_month=10**
	```
	{
	"msg": "Validation Error",
	"status": 400,
	"parameters": [
		{
			"parameter": "sales_year",
			"message": "The sales_year parameter is required"
		}
	]
	}
	```
	####  **/client/store/** POST
	**Body** 	
	```
	{
	"CPF":"557.176.350-79",
	"name":"Jinx",
	"address": {
		  "road": "Rua das Flores",
	      "number": 123,
	      "complement": "Apto 202",
	      "neighborhood": "Jardim Primavera",
	      "city": "São Paulo",
	      "zip_code": "01001-000",
	      "state": "São Paulo",
	      "country": "Brasil"
		},
	"phone":{
		"number": "+1 (212) 555-1234"
		}
	}
	```
	-	Os campos tem nomenclatura e aninhamento auto explicativos.
	-	O campo, **address.complement** é opcional e pode ser omitido, os demais são obrigados para a criação de um **Cliente**.
	-	**CPF** deve ser um CPF matematicamente válido. Sugestão: usar um [gerador de CPF](https://www.geradordecpf.org), pode ser usado formatado (XXX.XXX.XXX-XX) ou somente números (11 números), mas é armazenado em banco somente em números.
	-	**address.zip_code** Deve seguir o padrão XXXXX-XXX, **zip_code** *NÃO* é validado junto aos outros dados de endereço.
	-	**phone.number** deve ser um número de telefone seguindo os padrões,
		-	99999999 - base
		-	DDD 88 ou (88)
		-	País 55 ou +55
		-	digito extra X99999999
		-	EX:
			*	5581979152927
			*	+558179152927
			*	55 (81) 97915-2927
			*	+351912345678 - exemplo numero do país Portugal 
			*	+1 (212) 555-1234 - exemplo de número país EUA.
		- Independente do formato de entrada ele é armazena no padrão de numero internacional segundo a documentação da biblioteca utilizada [Vine](https://vinejs.dev/docs/types/string#mobile), se não identificado o código de pais será armazenado como código Brasil +55, podendo ocorrer inconsistência de números de outros países caso o código de pais não seja fornecido, então forneça o código  e formatação correta do pais para evitar isso.
		- **phone.number** *NÃO* é validado junto a sua existência e validade real, apenas é validado  a formatação.
		- 
	**Parâmetros**  - Sem Parâmetros
	
	Retorn Success - **/client/store/**
	```
	{
	"status": 201,
	"msg": "Success create client",
	"data": {
		"id": 23,
		"name": "Jinx",
		"address": {
			"id": 23,
			"zip_code": "01001-000",
			"city": "São Paulo",
			"road": "Rua das Flores",
			"number": 123
		},
		"Phone": {
			"id": 23,
			"number": "+1 212 555 1234"
		}
	}
	}
	```

	Resposta Error - - **/client/store/** - CPF já existente - Validações individuais por campo são aplicadas e cada um tem seu retorno de erro.
	```
	{
	"msg": "CPF already registered",
	"status": 409,
	"fields": [
		{
			"field": "CPF",
			"message": "CPF already registered!"
		}
	]
	}
	```
	####  **/client/update/:id** PUT
	**Parêmetros** 
	- **id** ID do cliente
	
	**Body**
	OBS: todos as campos são opcionais com exceção dos IDs em **address** e **phone** que devem existir caso algum dados de **address** ou **phone** for modificado e o parâmetro **id**
	```
	{
		"name":"Jinx Cangaceira",
		"CPF": "557.176.350-79",
		"phone":{
			"id": 23,
			"number": "+5581982695904"
		},
		"address": {
			"id": 23,
			"city": "Xique-Xique",
			"state":"Bahia"
		}
	}
	```
	Pesposta Success  - **/client/update/23**
	```
	{
	"status": 200,
	"msg": "Success update client",
	"data": {
		"phone": {
			"id": 23,
			"number": "+55 81 98269 5904"
		},
		"id": 23,
		"name": "Jinx Cangaceira",
		"CPF": "55717635079",
		"address": {
			"address": {
				"id": 23,
				"city": "Xique-Xique",
				"state": "Bahia"
			}
		}
	}
	}
	```

	Resposta Error - **/client/update/23** - Campo **address .id** ausente
	```
	{
	"msg": "Validation Error",
	"status": 400,
	"fields": [
		{
			"field": "address.id",
			"message": "The id field is required"
		}
	]
	}
	```

	####  **/client/delete/:id** DELETE
	OBS: Todas as vendas, endereços e números de telefone do Cliente são deletados junto com o **Cliente** pelas funções `.onDelete('CASCADE')` das migrações LucideORM. 
	
	**Parêmetros** 
	- **id** ID do cliente
	
	**Body** - sem body

	Resposta Success - **/client/delete/23**
	```
	{
		"status": 200,
		"msg": "Success delete client",
		"data": {
		"id": 23
		}
	}
	```
	Resposta ERROR - **/client/delete/1234**
	```
	{
	"msg": "Client not found",
	"status": 404,
	"parameters": [
		{
			"message": "Client not found",
			"parameter": "id"
		}
	]
	}
	```
	### Rotas Produtos (todas precisam do token no  `Bearrer`)
	**OBS: as rotas do Produto são bastantes parecidas com as de Client, então somente o que muda vai ser listado abaixo.**

	###  **/product/**  GET
	- **Body** - Sem body
	- **Parâmetros** -  Sem Parâmetros
	- Produtos ordenados alfabeticamente

	Retorno Success - ***/product/**

	```
	{
	"status": 200,
	"msg": "Success get products",
	"data": [
		{
			"id": 3,
			"name": "abacate",
			"created_at": "2024-11-26T12:04:20.000-03:00"
		},
		{
			"id": 1,
			"name": "abobora",
			"created_at": "2024-11-25T18:15:48.000-03:00"
		},
		{
			"id": 2,
			"name": "gato",
			"created_at": "2024-11-25T18:15:59.000-03:00"
		}
	]
	}
	``` 
	
	Retorno Error - ***/product/**
	- [Error de autenticação](#Not_authenticated) já demonstrado

	###  **/product/show/:id** GET
	**Body** - Sem body
	**Parâmetros** 
	- **id** ID do produto.
	
	Retorno Success - **/product/show/1**
	```
	{
	"status": 200,
	"msg": "Success get product ",
	"data": {
		"id": 1,
		"name": "abobora",
		"description": "abobora caboclo",
		"unit_price": 5.9,
		"created_at": "2024-11-25T18:15:48.000-03:00",
		"updated_at": "2024-11-25T18:15:48.000-03:00"
	}
	}
	```
	Retorno Error - /product/show/123 - Produto não encontrado
	```
	{
		"msg": "Product not found",
		"status": 404,
		"parameters": [
			{
				"parameter": "id",
				"message": "Product not found"
			}
		]
	}
	```
	### **/product/store/** POST
	**Parâmetros**  - Sem parâmetros
	**body**:
	```
	{
		"name":"água Cristal - garrafa 250ml",
		"unit_price": 1.90,
		"description":"água Cristal - garrafa 250ml"
	}
	```
	
	<a id="product_store"></a>

	- **name**, String até 80 caracteres
	- **unit_price**: Float Positivo
	- **description**: Text (opcional) até 600 caracteres

	Retorno Success - **/product/store/**
	```
	{
	"status": 201,
	"msg": "Success create product",
	"data": {
		"id": 5,
		"name": "água Cristal - garrafa 250ml"
	}
	}
	```

	Retorno Error - **/product/store/** (valor negativo no **unit_price**)
	```
	{
	"msg": "Validation Error",
	"status": 400,
	"fields": [
		{
			"field": "unit_price",
			"message": "The unit_price field must be positive"
		}
	]
	}
	```
	### **/product/update/:id** PUT
	**Parâmetros** :
	- **id** ID do produto
	
	**body**:
	OBS: Todos os campos são opcionais
	```
	{
		"name":"água Cristal - garrafa 250ml",
		"unit_price": 1.90,
		"description":"água Cristal - garrafa 250ml",
		"deleted_in": false
	}
	```
	- Mesmos campos de [/product/store/](#product_store)
	- **deleted_in** Booleano que representa a reversão do SoftDetet se tiver valor false, reverte o softDelete, se tiver valor true, é considerado ação inválida, retornando erro 400.


 	Retorno Success - **/product/updade/6** - editar o **unit_price**

 	```
	{
		"status": 200,
		"msg": "Success update product",
		"data": {
			"id": 6,
			"unit_price": 2.1
		}
		}
   ```

	Retorno Error- **/product/updade/6** - sem body

	```
	{
	"msg": "Data not send",
	"status": 400
	}
	```

	<a id="softDelete"></a>

	### **/product/delete/:id** PUT

	OBS: Nesta ação ocorre o SoftDelete do produto, ou seja ele não é removido do banco e tem o campo indicador de SoftDelete `deleted_in` modificado de NULL (padrão) para um objeto DateTime do instante da ação de SoftDelete, após "SoftDeletado" o **Produto** é ignorado no restante da aplicação exceto na ação de **Update** dele, onde seus dados não atualizados normalmente, e onde é possível reverter o SoftDelete dele, simplesmente anulando o campo `deleted_in` dele no banco, o trazendo de volta a aplicação.
	
	**Parâmetros** :
	- **id** ID do produto	
	- **body**: Sem body

	Resposta Success - **/product/delete/6**

	```
	{
	"status": 200,
	"msg": "Success delete product",
	"data": {
		"id": 6
	}
	}
	```

	Resposta Error - **/product/delete/6** - (tentando deletar um produto já deletado)

	```
	{
	"msg": "Product not found",
	"status": 404,
	"parameters": [
		{
			"message": "Produto não encontradao",
			"parameter": "id"
		}
	]
	}
	```

	### Rotas Vendas (todas precisam do token no  `Bearrer`)

	### **/sale/** GET
		OBS: Retorno ordenado pela venda mais recente
	**Parâmetros**  - Sem parâmetros
	**body**: - Sem Body

	Resposta Success - **/product/store/**
	```
	{
	"status": 200,
	"msg": "Success get sales",
	"data": [
		{
			"id": 6,
			"product_id": 1,
			"total_price": 31.8,
			"created_at": "2024-11-26T13:47:18.000-03:00"
		},
		{
			"id": 10,
			"product_id": 2,
			"total_price": 35.8,
			"created_at": "2024-11-25T20:04:47.000-03:00"
		}
	]
	}
	```

	Resposta Error
	```
	{
	"msg": "Sale not found",
	"status": 404,
	"parameters": [
		{
			"parameter": "id",
			"message": "Sale not found"
		}
	]
	}
	```


	### **/sale/show/:id** GET
	**Parâmetros** :
	- **id** Id da venda

	**body**: - Sem Body
	
	Retorno Success /sale/show/1

	```
	{
	"status": 200,
	"msg": "Success get product",
	"data": {
		"id": 1,
		"product": {
			"id": 1,
			"name": "abobora"
		},
		"client": {
			"id": 6,
			"name": "abobora cabloco"
		},
		"quantity": 2,
		"unit_price": 5.9,
		"total_price": 11.8,
		"sale_date": "2024-11-25T18:16:25.000-03:00"
	}
	}
	```
	Retorno Error /sale/show/123

	```
	{
	"msg": "Sale not found",
	"status": 404,
	"parameters": [
		{
			"parameter": "id",
			"message": "Sale not found"
		}
	]
	}
	```

	### **/sale/store/** POST
	**Parâmetros**  -Sem parâmetros

	**body**: 

	```
	{
	"client_id":6,
	"product_id":1,
	"quantity":2
	}
	```
	
	Retorno Success /sale/show/1

	```
	{
	"status": 201,
	"msg": "Success create sale",
	"data": {
		"id": 22,
		"client_id": 6,
		"product_id": 1,
		"unit_price": 5.9,
		"quantity": 2,
		"total_price": 11.8,
		"sale_date": "2024-11-26T14:01:07.561-03:00"
	}
	}
	```

	Resposta Error - (**quantity** = 0)

	```
	{
	"msg": "Not valid quantity",
	"status": 400,
	"fields": [
		{
			"field": "quantity",
			"message": "Not valid quantity"
		}
	]
	}
	```

# Extras

## Criação do projeto
- O projeto foi criado usando o template Adonis
`npm  init  adonisjs@latest  nameProjet  -K=slim  --db=mysql` 
- Demais dependências configuradas durando o desenvolvimento.

<a id="Ambiente_de_teste"></a>
## Ambiente de teste de requisição 
- Um projeto Insomnia já configurado para o teste da API é disponibilizado em ./tools/Insomnia_project.json, basta abrir o Aplicativo Insomnia, na Home Page clicar em Import, Choose a File, selecionar o arquivo .json, Abrir, Scan, Import.
OBS: com esse projeto não é necessário modificar o token, ele é automaticamente coletado da requisição login, e distribuído para as rotas autenticadas. Para fins de teste de autenticação (token inválido) basta modificar o token nas variáveis de ambiente.

## Listas de Endereços e Telefones
- O projeto foi desenvolvido considerando a possibilidade de um Cliente ter mais de um **Endereço** ou **Telefone**, apesar que não ter sido implementado, bastava criar uma rota nova ou um modificador para aceitar o "push" de mais endereços ou telefones na rota de **UPDADE** e usar parâmetros para filtra-los por uma possível categoria como **Telefone** e **Endereço** Residencial/Comercial, etc.

<a id="Unicidade_Dupla"></a>

## Unicidade de Dupla

- O projeto foi desenvolvido pensando em que cada **User** é um "universo" diferente com cada um podendo ter acesso somente às suas próprias coisas sem interferir nos itens dos demais **Users**, e para possibilitar que um mesmo cliente possa comprar de Users diferentes, campos que seriam naturalmente Uniques como **CPF** e **phone.number** sozinhos não são Unique e sim são Unique para o universo do User, para conseguir esse efeito utilizou-se a comando `table.unique(['number', 'user_id']);` para Telefone e outro semelhante para o **CPF** do cliente.

## Erros reconhecidos | eventuais
  - Erros de ortografia em: documentação, nomes de variáveis, mensagens de retorno e em outros locais podem ter ocorrido.
  - Algumas mensagens de retorno de erro de validação de campos estão em português, se tornando inconsistentes frente aos retornos em inglês padrões.


/end

<!-- -..- -....- -..- -->
