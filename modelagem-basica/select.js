const pg = require('pg');
require('dotenv').config({ path: './.env' });

const connectionString = process.env.CONNECTION_STRING;

// Connection String: protocolo_bd://usuario:senha@host:porta/nome_do_banco

const db = new pg.Client({ connectionString });

async function selectPokemon () {
    await db.connect();

    const query = 'SELECT * FROM public.pokemon;';
    const result = await db.query(query);
    console.log(result);
    console.log(result.rows);
    console.table(result.rows)

    await db.end();
}

selectPokemon();