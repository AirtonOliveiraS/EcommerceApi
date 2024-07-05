const express = require('express');
const router = express.Router();
const connectDatabase = require('../middlewares/connectDB');
const axios = require('axios');
router.use(express.json());
router.use(connectDatabase);

router.get('/', (req, res) => {
  try {
    const db = req.dbConnection;
    const allVendasQuery = "SELECT * FROM venda";

    db.query(allVendasQuery, (err, results) => {
      if (err) {
        console.error(`Erro na consulta do banco: ${err}`);
        return res.status(500).json({ error: 'Erro interno no servidor' })
      } else {
        res.status(200).json({ status: 'Ok', message: 'Successo na consulta de  Vendas', data: results })
        db.release();
      }
    })

  } catch (error) {
    console.error(`Erro na consulta do banco: ${error}`)
    res.status(500).json({ error: `Erro interno no servidor` })
  }
})

router.get('/:id', (req, res) => {
  try {
    const db = req.dbConnection;
    const id = req.params.id;
    const allVendasQuery = "SELECT * FROM venda WHERE id = ?";

    db.query(allVendasQuery, [id], (err, results) => {
      if (err) {
        console.error(`Erro na consulta do banco: ${err}`);
        return res.status(500).json({ error: 'Erro interno no servidor' })
      } else {
        res.status(200).json({ status: 'Ok', message: 'Successo na consulta de  Vendas', data: results })
        db.release();
      }
    })

  } catch (error) {
    console.error(`Erro na consulta do banco: ${error}`)
    res.status(500).json({ error: `Erro interno no servidor` })
  }
})

router.post('/create', async function (req, res) {
  try {
    const db = req.dbConnection;
    const { produto, cliente_id } = req.body;

    const estoqueSuficiente = await checkEstoque(produto);

    if (!estoqueSuficiente) return res.status(401).send('Stock below requested')

    const VendasId = await createVenda(cliente_id, db)

    for (const produto of produto) {
      await createPedido(produto, VendasId, db);
      await updateEstoque(produto.produto_id, produto.quantidade);
    }

    const total = await calculoTotal(produto);
    await updateTotalVendaValue(VendasId, total, db);

    res.status(200).send('Vendas inseridas com sucesso!');

  } catch (error) {
    console.error(`Erro na criacao da venda: ${error}`);
    res.status(500).json({ error: error.message })
  }
})

async function checkEstoque(produtos) {
  for (const produto of produtos) {
    try {
      const response = await axios.get(`http://localhost:8080/estoque/${produto.produto_id}`)
      const result = response.data.data;
      const quantidade = result[0].quantidade;

      if (product.quantity > quantity) {
        return false;
      }
    } catch (error) {
      throw new Error(`Erro ao verificar estoque${error}`)
    }
  }
  return true;
}

async function createVenda(client_id, db) {
  return new Promise((resolve, reject) => {
    const VendasQuery = 'INSERT INTO venda (cliente_id) VALUES (?)'
    const valorVendas = [client_id, 0];

    db.query(VendasQuery, valorVendas, (err, results) => {
      if (err) {
        reject(new Error(`Erro ao criar venda no banco de dados: ${err.message}`))
      } else resolve(results.insertId)
    });
  });
}

async function createPedido(produto, VendaId, db) {
  return new Promise((resolve, reject) => {
    const produtoVendaQuery = 'INSERT INTO pedido (venda_id, produto_id, quantidade) VALUES (?, ?, ?)';
    const valorProdVendas = [VendaId, produto.produto_id, produto.quantidade];

    db.query(produtoVendaQuery, valorProdVendas, (err, results) => {
      if (err) reject(new Error(`Erro ao criar produto no banco de dados: ${err.message}`))
      else resolve();
    });
  });
}

async function updateEstoque(produtoId, quantidade) {
  try {
    const requestBody = { "quantidade": quantidade };
    const response = await axios.put(`http://localhost:8080/estoque/update/${produtoId}`, requestBody)

    if (response.status !== 200) throw new Error(`Erro ao atualizar o inventário do produto ${produtoId}`)
    else console.log(`Estoque atualizado do produto com sucesso ${produtoId}`)

  } catch (error) {
    throw new Error(`Erro ao fazer a solicitação de atualização de estoque: ${error.message}`)
  }
}






module.exports = router;