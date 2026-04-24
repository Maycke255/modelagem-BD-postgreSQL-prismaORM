// No caso da biblioteca “pg”, existe um método query() no objeto pool para executar consultas de forma simplificada em alguma conexão da pool que
// estiver disponível sem precisar tocar diretamente no cliente:Obs.: de acordo com a documentação, este é o método recomendado caso você não 
// precise executar uma transaction, apenas consultas individuais.
// const { Pool } = require("pg");

const pg = require('pg');
require('dotenv').config({ path: './.env' });

const connectionString = process.env.CONNECTION_STRING;

// Connection String: protocolo_bd://usuario:senha@host:porta/nome_do_banco

const db = new pg.Pool({ connectionString,
    max: 3
});

async function openConnection() {
  const result = await pool.query("SELECT 1 + 1 AS soma;");
  console.log(result.rows);

  setTimeout(() => {
    console.log("Fechando conexão...")
  }, 5000);
}

openConnection();
openConnection();
// Abrir uma nova conexão não funciona imediatamente, mas não lança erro
// Quando uma conexão é liberada na pool, uma nova pode ser aberta
openConnection();