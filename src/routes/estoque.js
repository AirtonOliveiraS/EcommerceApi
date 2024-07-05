const express = require('express');
const router = express.Router();
const connectDatabase = require('../middlewares/connectDB');
router.use(express.json());
router.use(connectDatabase);


router.put('/ajuste/:id', (req, res) => {
  try {
    const db = req.dbConnection;
    const id = req.params.id;
    const body = req.body;
    const updateEstoqueQuery = 'UPDATE estoque SET ? WHERE produto_id = ?'
    const values = [body, id]

    db.query(updateEstoqueQuery, values, (err, result) => {
      if (err) {
        console.error(`Erro ao atualizar o produto de banco de dados: ${err}`);
        return res.status(500).json({ error: "Erro interno no servidor" });
      } else {
        res.status(200).json({ status: 'Ok', message: "Produdo atualizado com sucesso", data: result });
        db.release();
      }
    })

  } catch (error) {
    console.error(`Erro na consulta do banco: ${error}`);
    res.status(500).json({ error: `Erro interno no servidor` })
  }
})

router.put('/update/:id', (req, res) => {
  const db = req.dbConnection;
  const id = req.params.id;
  const { quantidade } = req.body;
  const quantidadeAtual = 'SELECT quantidade FROM estoque WHERE produto_id = ?';

  db.query(quantidadeAtual, [id], (err, result) => {
    if (err) {
      console.error("Erro na query do estoque:", err);
      return res.status(500).json({ error: "Erro interno no servidor" });
    } else {
      const estoqueAtual = result[0].quantidade;
      if (estoqueAtual < quantidade) {
        res.status(400).send("Erro na quantidade do estoque");
      } else {
        const newestoque = estoqueAtual - quantidade;
        const sql = "UPDATE estoque SET quantidade = ? WHERE produto_id = ?"

        db.query(sql, [novoEstoque, id], (err, result) => {
          if (err) {
            console.error("Erro no inventario:", err);
            res.status(500).json({ error: 'Erro na alteração do estoque' });
          } else {
            console.log("Estoque atualizado");
            res.status(200).send("Estoque atualizado");
            db.release();
          }
        })
      }
    }
  })
})

router.get('/', (req, res) => {
  try {
    const db = req.dbConnection;
    const sql = "SELECT * FROM estoque";

    db.query(sql, (err, result) => {
      if (err) {
        console.error(`Erro na consuta do banco de dados ${err}`);
        return res.status(500).json({ error: "Erro interno no servidor" })
      } else {
        res.status(200).json({ status: 'Ok', message: "Sucesso na consuta do estoque", data: result })
        db.release();
      }
    })

  } catch (error) {
    console.error(`Erro na consuta do banco de dados: ${error}`);
    res.status(500).json({ error: `Erro interno no servidor` })
  }
})

router.get('/:id', (req, res) => {
  try {
    const db = req.dbConnection;
    const id = req.params.id
    const sql = "SELECT * FROM estoque WHERE produto_id = ?"

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(`Erro na consulta do banco: ${err}`)
        return res.status(500).json({ error: "Erro interno no servidor" })
      }
      else {
        res.status(200).json({ status: 'Ok', message: "Successo na consulta do  estoque", data: result })
        db.release();
      }
    })

  } catch (error) {
    console.error(`Error na consulta do banco: ${error}`);
    res.status(500).json({ error: `Erro interno no servidor` })
  }
})

module.exports = router;