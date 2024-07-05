CREATE DATABASE ecommerce;

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


