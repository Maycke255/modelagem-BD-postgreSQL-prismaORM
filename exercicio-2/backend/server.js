/* ​Seguindo o projeto da aula anterior, implemente rotas para criação, leitura, atualização e exclusão de clientes em uma tabela “customers” com 
colunas para nome e email. Você deverá criar a tabela programaticamente através do arquivo “sync-database.js”, uma classe de modelo para 
integração com o banco de dados e as rotas na API feita com Express. */
const express = require('express');
const path = require('path');
require('dotenv').config({ path: './.env' });
const router = require('./router/router.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(router);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Api rodando na porta: <http://localhost>:${PORT}`));