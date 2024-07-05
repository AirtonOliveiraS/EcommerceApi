const express = require('express');
const router = express.Router();
const connectDatabase = require('../middlewares/connectDB');
router.use(express.json())
router.use(connectDatabase);

router.post('/create', (req, res) => {
  try {
    const db = req.dbConnection;
    const { nome, email, telefone } = req.body;

    const sql = "INSERT INTO cliente (nome, email, telefone) VALUES (?, ?, ?)";
    const values = [nome, email, telefone];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(`Erro ao criar cliente no banco de dados: ${err}`);
        return res.status(500).json({ error: err });
      } else {
        res.status(201).json({ status: 'Criado', message: "Cliente criado com sucesso", cliente_id: result.insertId });
        db.release()
      }
    })
  } catch (error) {
    console.error(`Erro ao inserir dados na tabela de clientes: ${error}`)
    res.status(500).json({ error: `Erro interno no servidor` })
  }
})


router.get('/', (req, res) => {
  try {
    const db = req.dbConnection;
    const sql = "SELECT * FROM cliente"

    db.query(sql, (err, results) => {
      if (err) {
        console.error(`Erro na constulta do banco: ${err}`);
        return res.status(500).json({ error: `Erro interno no servidor` })
      } else {
        res.status(200).json({ status: 'Ok', message: "Busca concluída com sucesso", data: results });
        db.release();
      }
    })

  } catch (error) {
    console.error(`Erro na constulta do banco: ${error}`)
    res.status(500).json({ error: `Erro na constulta do banco` })
  }
});

router.get('/:id', (req, res) => {
  try {
    const db = req.dbConnection;
    const id = req.params.id;
    const sql = "SELECT * FROM cliente WHERE id = ?"

    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error(`Erro na constulta do banco: ${err}`);
        return res.status(500).json({ error: `Erro interno no servidor` })
      } else {
        res.status(200).json({ status: 'Ok', message: "Busca concluída com sucesso", data: results });
        db.release();
      }
    })

  } catch (error) {
    console.error(`Erro na constulta do banco: ${error}`)
    res.status(500).json({ error: `Erro na constulta do banco` })
  }
});

router.put('/:id', (req, res) => {
  try {
    const db = req.dbConnection;
    const id = req.params.id;
    const updatedInfo = req.body;
    const sql = "UPDATE cliente SET ? WHERE id = ?"
    const values = [updatedInfo, id]

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error(`Erro ao editar cliente na base de dados: ${err}`);
        return res.status(500).json({ error: `Erro interno no servidor` })
      } else {
        res.status(200).json({ status: 'Ok', message: "Atualização realizada com sucesso", data: updatedInfo, results });
        db.release();
      }
    });

  } catch (error) {
    console.error(`Erro na constulta do banco: ${error}`)
    res.status(500).json({ error: `Erro na constulta do banco` })
  }
});

router.delete('/:id', (req, res) => {
  try {
    const db = req.dbConnection;
    const id = req.params.id
    const sql = "DELETE FROM cliente WHERE id = ?"

    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error(`Erro na deleção de usuario: ${err}`);
        return res.status(500).json({ error: `Erro interno no servidor` })
      } else {
        res.status(200).json({ status: 'Ok', message: 'Usuario deletado com sucesso', data: results });
        db.release();
      }
    })

  } catch (error) {
    console.error(`Erro na constulta do banco: ${error}`)
    res.status(500).json({ error: `Erro na constulta do banco` })
  }
})

module.exports = router;