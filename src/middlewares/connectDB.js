const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce',
};

const pool = mysql.createPool(dbConfig);

async function connectDatabase(req, res, next) {
  await pool.getConnection((error, connection) => {
    if (error) {
      console.error(`Erro na conexão ${error}`);
      return res.status(500).json({ error: 'Error' })
    }
    else {
      req.dbConnection = connection;
      console.log(`Conexão feita!`)
      next();
    }
  })
}

module.exports = connectDatabase;