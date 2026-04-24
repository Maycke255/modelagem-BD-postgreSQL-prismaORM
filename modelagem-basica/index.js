/* Testando github... */
/* Exemplos de relacionamentos:
=================================
---->  1:1
🧠 O que e?
- Um registro em uma tabela está ligado a exatamente um registro em outra tabela

🍔 Exemplo na lanchonete
🧍 Cliente → Perfil do Cliente

👉 Um cliente tem um único perfil
👉 Um perfil pertence a um único cliente

🧩 Estrutura

🧍 Tabela clients
id | nome
1  | João
2  | Maria

📄 Tabela client_profile
id | client_id | telefone | cpf
1  | 1         | 9999-9999 | 123...
2  | 2         | 8888-8888 | 456...

🔥 O segredo do 1:1

👉 O campo:

client_id

tem que ser:

FOREIGN KEY ✔️
UNIQUE ✔️ (ou PRIMARY KEY)

🧠 Por quê?

Se NÃO for UNIQUE:

client_id = 1
client_id = 1

👉 Viraria 1:N ❌

=================================
---->  1:n
🍔 Exemplo clássico: Cliente → Pedidos
🧠 Regra do 1:N

Um cliente pode ter vários pedidos
Um pedido pertence a um único cliente

🧩 Estrutura

🧍 Tabela clients
id | nome
1  | João
2  | Maria

🧾 Tabela orders
id | client_id | total
1  | 1         | 25.00
2  | 1         | 30.00
3  | 2         | 15.00

🔥 O relacionamento

👉 orders.client_id é a foreign key

Ele aponta para:
clients.id

🧠 Visual
clients           orders
--------          --------
João (id=1)  →    pedido 1
                → pedido 2

Maria (id=2) →    pedido 3

👉 1 cliente → vários pedidos ✔️

=================================
----> n:n

👉 Você cria uma tabela intermediária

🧩 Estrutura correta

🍔 Tabela lanches
id | nome
1  | X-Burger

🥬 Tabela ingredients
id | nome
1  | Carne
2  | Alface
3  | Tomate

🔗 Nova tabela: lanches_ingredients
id | lanche_id | ingredient_id
1  | 1         | 1
2  | 1         | 2
3  | 1         | 3

🧠 O que isso significa?

👉 O lanche 1 (X-Burger) tem:

ingrediente 1 (Carne)
ingrediente 2 (Alface)
ingrediente 3 (Tomate)
🔥 Nome disso

Isso é um relacionamento:

N:N (muitos para muitos)
Um lanche tem vários ingredientes
Um ingrediente pode estar em vários lanches

*/
const pg = require('pg');
require('dotenv').config({ path: './.env' });

const connectionString = process.env.CONNECTION_STRING;

// Connection String: protocolo_bd://usuario:senha@host:porta/nome_do_banco

const db = new pg.Client({ connectionString });

async function inserPokemon () {
    await db.connect();

    // Forma básica
    const query = `INSERT INTO public.pokemon (name, type) VALUES ('Solgaleo', 'Fire, Pisiquico');`;

    // const result1 = await db.query(query);
    // console.log(result1);


    // Forma dinamica ERRADA
    const name = "Fuecoco";
    const type = "Fogo";
    // const result2 = await db.query(
    //     `INSERT INTO public.pokemon (name, type) VALUES ('${name}', '${type}');`
    // );
    // console.log(result2);


    // Dados dinâmicos da forma CORRETA
    const pokemon = { name: "Quaxly", type: "Água" };
    const result3 = await db.query(
        `INSERT INTO public.pokemon (name, type) VALUES ($1, $2);`,
        [pokemon.name, pokemon.type]
    );
    console.log(result3);

    await db.end();
}

inserPokemon();