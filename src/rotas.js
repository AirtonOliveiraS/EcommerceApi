function routes(app) {
  app.use('/clientes', require('./routes/clientes.js'));
  app.use('/estoque', require('./routes/estoque.js'));
  app.use('/produtos', require('./routes/produtos.js'));
  app.use('/vendas', require('./routes/vendaPedido.js'));
  
}

module.exports = routes;