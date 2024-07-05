const express = require('express');
const router = express.Router();
const connectDatabase = require('../middlewares/connectDB');
router.use(express.json());
router.use(connectDatabase);


router.post('/create', (req, res) => {
  try {
    const db = req.dbConnection;
    const { nome, descricao, valor } = req.body;

    // Check by name if the product exists
    const consultaProduto = 'SELECT id FROM produto WHERE nome = ?';
    db.query(consultaProduto, [nome], (Error, result) => {
      if (Error) {
        console.error(`erro na consulta do produto: ${Error}`);
        return res.status(500).json({ error: Error });
      }

      if (result.length > 0) {
        
        const produtoId = result[0].id;
        const consultaQuantidadeProduto = 'UPDATE estoque SET quantidade = quantidade + 1 WHERE produto_id = ?'
        db.query(consultaQuantidadeProduto, [produtoId], (updateErro, updateResult) => {
          if (updateErro) {
            console.error(`Erro ao atualizar quantidade no banco de dados: ${updateErro}`);
            return res.status(500).json({ error: updateErro });
          } else {
            res.status(200).json({ status: 'alterado', message: 'Quantidade alterada ', data: { produtoId }, updateResult });
            db.release()
          }
        })
      } else {

        const sql = 'INSERT INTO produto ( nome, descricao, valor) VALUES (?, ?, ?)';
        const values = [nome, descricao, valor];

        db.query(sql, values, (err, results) => {
          if (err) {
            console.error(`Erro ao criar produto no banco de dados: ${err}`);
            return res.status(500).json({ error: err })
          } else {

            const novoProdutoId = results.insertId;
            const sql2 = 'INSERT INTO estoque (produto_id, quantidade) VALUES (?, 1)'

            db.query(sql2, [novoProdutoId], (Error, Results) => {
              if (Error) {
                console.error(`Erro na consulta ao banco de dados: ${Error}`);
                res.status(500).json({ error: Error })
              } else {
                res.status(201).json({ status: 'Criado', message: 'Produdo registrado', data: { novoProdutoId }, Results });
                db.release();
              }
            })
          }
        })
      }
    })
  } catch (error) {
    console.error(`Erro ao inserir dados na tabela de produtos: ${error}`)
    res.status(500).json({ error: `Erro interno no servidor` })
  }
})

router.get('/', (req, res) => {
  try {
    const db = req.dbConnection;
    const consultaTodoProduto = 'SELECT * FROM produto'

    db.query(consultaTodoProduto, (err, results) => {
      if (err) {
        console.error(`Erro ao consultar dados na tabela de produtos: ${err}`);
        res.status(500).json({ error: err })
      } else {
        res.status(200).json({ status: 'Ok', message: "Consulta finalizada", data: results });
        db.release();
      }
    })

  } catch (error) {
    console.error(`Erro ao consultar dados na tabela de produtos: ${error}`);
    res.status(500).json({ error: `Erro interno no servidor` })
  }
})

router.get('/:id', (req, res) => {
  try {
    const db = req.dbConnection;
    const id = req.params.id
    const consultaProdutoId = 'SELECT * FROM produto WHERE id = ?'

    db.query(consultaProdutoId, [id], (err, result) => {
      if (err) {
        console.error(`Erro ao consultar dados na tabela de produtos: ${err}`);
        res.status(500).json({ error: err })
      } else {
        res.status(200).json({ status: 'Ok', message: "Consulta finalizada", data: result });
        db.release();
      }
    })

  } catch (error) {
    console.error(`Erro ao consultar dados na tabela de produtos: ${error}`);
    res.status(500).json({ error: `Erro interno no servidor` })
  }
})

router.put('/:id', (req, res) => {
  try {
    const db = req.dbConnection;
    const id = req.params.id
    const updatedCampos = req.body;
    const updateProducto = 'UPDATE produto SET ? WHERE id = ?'
    const values = [updatedCampos, id]

    db.query(updateProducto, values, (err, results) => {
      if (err) {
        console.error(`Erro ao atualizar dados na tabela de produtos: ${err}`);
        res.status(500).json({ error: err })
      } else {
        res.status(200).json({ status: 'Ok', message: "Alterado com sucesso", data: results });
        db.release();
      }
    })

  } catch (error) {
    console.error(`Erro ao consultar dados na tabela de produtos: ${error}`);
    res.status(500).json({ error: `Erro interno no servidor` });
  }
})

router.delete('/:id', (req, res) => {
  try {
    const db = req.dbConnection;
    const id = req.params.id;

    const consultaEstoque = 'SELECT id, quantidade FROM estoque WHERE produto_id = ?'
    db.query(consultaEstoque, [id], (err, results) => {
      if (err) {
        console.error(`Erro ao verificar entradas de estoque do produto: ${err}`);
        res.status(500).json({ error: err })
      }

      if (results.length === 0) {
        deleteProduto(id, db, res)
      } else {
        const estoqueId = results[0].id;
        const quantidade = results[0].quantidade;

        if (quantity > 1) {
          updateEstoqueQuantidade(estoqueId, quantidade - 1, db, res);
        } else {
          deleteProdutoeEstoque(id, estoqueId, db, res)
        }
      }
    })

  } catch (error) {
    console.log(`Erro ao excluir dados da tabela de produtos: ${error}`);
    res.status(500).json({ error: `Erro interno no servidor` });
  }
})

function deleteProduto(produtoId, db, res) {
  const queryDeleteProduto = 'DELETE FROM produto WHERE id = ?';
  db.query(queryDeleteProduto, [produtoId], (err, results) => {
    if (err) {
      console.error(`Erro ao excluir produto do banco de dados: ${err}`)
      return res.status(500).json({ error: err });
    } else {
      res.status(200).json({ status: 'Ok', message: 'Produto excluído com sucesso', data: results });
      db.release();
    }
  })
}

function updateEstoqueQuantidade(estoqueId, novaQuantidade, db, res) {
  const updateEstoqueQuery = 'UPDATE stock SET quantity = ? WHERE id = ?';
  db.query(updateEstoqueQuery, [novaQuantidade, estoqueId], (err, results) => {
    if (err) {
      console.error(`Erro ao atualizar quantidade em estoque no banco de dados: ${err}`);
      return res.status(500).json({ error: err })
    } else {
      res.status(200).json({ status: 'Ok', message: 'Atualização da quantidade em estoque com sucesso', data: results });
      db.release()
    }
  })
}

function deleteProdutoeEstoque(produtoId, estoqueId, db, res) {
  const queryDeleteEstoque = "DELETE FROM estoque WHERE id = ?";
  db.query(queryDeleteEstoque, [estoqueId], (deleteErro, deleteStockResults) => {
    if (deleteErro) {
      console.error(`Erro ao excluir entrada de estoque do banco de dados: ${deleteErro}`);
      return res.status(500).json({ error: deleteErro });
    } else {
      deleteProduto(produtoId, db, res);
    }
  })
}

module.exports = router;