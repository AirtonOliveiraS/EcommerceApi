# Desafio 6 - Escola DNC 🧠
Projeto desenvolvido durante a  Formação em Tecnologia da Escola DNC.

### MODELAGEM

![image](https://github.com/AirtonOliveiraS/EcommerceApi.git/Desafio6/public/logic_model.png)

---

### Instalação

##### Clone o repositório:
```sh
$ git clone https://github.com/AirtonOliveiraS/EcommerceApi.git
```

##### Acesse a pasta :
```sh
$ cd Desafio6
```

---

### Banco de Dados
##### Crie o banco de dados ecommerce MySQL :
```mysql
CREATE DATABASE ecommerce;

```

##### Crieas tabelas a seguir:

```mysql
CREATE TABLE ecommerce.venda 
( 
 id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,  
 data_venda DATE,  
 cliente_id INT  
);

CREATE TABLE ecommerce.pedido 
( 
 id INT PRIMARY KEY AUTO_INCREMENT,  
 quantidade INT,  
 venda_id INT NOT NULL,  
 produto_id INT NOT NULL  
);

CREATE TABLE ecommerce.cliente 
( 
 id INT PRIMARY KEY AUTO_INCREMENT,  
 nome VARCHAR(255) NOT NULL,  
 email VARCHAR(255),  
 telefone VARCHAR(20),  
 UNIQUE (email, telefone)
); 

CREATE TABLE ecommerce.produto 
( 
 id INT PRIMARY KEY AUTO_INCREMENT,  
 nome VARCHAR(255),  
 valor FLOAT DEFAULT 0,  
 descricao VARCHAR(255),  
 UNIQUE (nome)
); 

CREATE TABLE ecommerce.estoque 
( 
 id INT PRIMARY KEY AUTO_INCREMENT,  
 quantidade INT,  
 produto_id INT NOT NULL  
); 



ALTER TABLE venda ADD FOREIGN KEY (cliente_id) REFERENCES cliente (id);
ALTER TABLE pedido ADD FOREIGN KEY (venda_id) REFERENCES venda (id);
ALTER TABLE pedido ADD FOREIGN KEY (produto_id) REFERENCES produto (id);
ALTER TABLE estoque ADD FOREIGN KEY (produto_id) REFERENCES produto (id);

```


##### Configure o banco de dados no ficheiro connectDB.js (src/middlewares/connectDB.js)


##### Instale as dependências:
```sh
$ npm i
```

##### Inicie o projeto:
```sh
$ npm run dev
```

### Consutas Realizadas via Insomnia:

![image](https://github.com/AirtonOliveiraS/EcommerceApi.git/Desafio6/public/consultas_insomnia.png)

---


















