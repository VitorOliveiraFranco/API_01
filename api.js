//requires
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

//imports
const mysql_config = require('./imp/mysql_config');
const functions = require('./imp/functions');

//variáveis para disponibilidade e para versionamento
const API_AVAILABILITY = true;
const API_VERSION = '1.0.0';

//iniciar servidor
const app = express();

app.listen(3000, () => {

    console.log('API está executando');
});

//verificar a disponibilidade da API
app.use((req, res, next) => {

    if(API_AVAILABILITY){

        next();
    } else {

        res.json(functions.response('atenção', 'API está em manutenção. Sorry!', 0, null));
    }
});

//conexão com o mysql
const connection = mysql.createConnection(mysql_config);

//cors
app.use(cors());

//rotas
//rota inicial(entrada)
app.get('/', (req, res) => {

    res.json(functions.response('sucesso', 'API está rodando', 0, null));
});

//endpoint
//rota pra a consulta completa
app.get('/tasks', (req, res) => {

    connection.query('SELECT * FROM tasks', (err, rows) => {
        
        if(!err){

            res.json(functions.response('Sucesso', 'Sucesso na consulta', rows.length, rows));
        } else {

            res.json(functions.response('erro', err.message, 0, null));
        }
    });
});

//tratar o erro de rota
app.use((req, res) => {

    res.json(functions.response('atenção', 'rota não encontrada', 0, null));
});