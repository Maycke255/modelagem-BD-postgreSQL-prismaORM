const pg = require('pg');
require('dotenv').config({ path: './.env' });

const connectionString = process.env.CONNECTION_STRING;

// Connection String: protocolo_bd://usuario:senha@host:porta/nome_do_banco

const db = new pg.Pool({ connectionString,
    max: 3
});

// Jeito padrão de abria uma conexão
async function openConnection () {
    await client.connect();

    const result = await client.query("SELECT 1 + 1 AS soma;");
    console.log(result.rows);

    setTimeout(() => {
        client.end();
        console.log("Fechando conexão...")
    }, 5000);
}

// openConnection();

// // Tentar abrir uma segunda conexão com o cliente resulta em erro
// openConnection();

async function openConnectionPool () {
  const client = await db.connect();

  const result = await client.query("SELECT 1 + 1 AS soma;");
  console.log(result.rows);

  setTimeout(() => {
    // Esse método não fecha a conexão instantaneamente assim como no end, ela fica pendurada para ter a possibilidade de uma
    // nova conexão
    client.release();
    console.log("Fechando conexão...")
  }, 5000);
}

openConnectionPool();
openConnectionPool();
// Abrir uma nova conexão não funciona imediatamente, mas não lança erro
// Quando uma conexão é liberada na pool, uma nova pode ser aberta
openConnectionPool();