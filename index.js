const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const cors = require('cors')
const routes = require('./src/rotas')


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`Servidor esta iniciado na porta: ${PORT}`)
});

module.exports = app;
