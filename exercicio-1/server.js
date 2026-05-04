/* ​Crie as seguintes funções usando Node.js e a biblioteca “pg”:

Uma função que cria uma tabela de eventos com as colunas id, nome, data do evento, total de ingressos e ingressos vendidos.
Uma função que cria um novo evento, salvando-o no banco de dados.
Uma função que obtém todos os eventos salvos no banco de dados.
Uma função que obtém as informações de um evento a partir do seu nome.
Uma função que obtém os eventos de um determinado dia;
Uma função que realiza a venda de um ingresso, ou seja, adiciona +1 aos ingressos vendidos. A venda só poderá ser executada
 se o número de ingressos vendidos não exceder o total de ingressos e se o evento ainda não aconteceu.
Obs.: Para testar as funções você pode utilizar um script ou o próprio console interativo do Node.js. */

const pg = require('pg');
require('dotenv').config({ path: './.env' });

console.log('URL de conexão: ', process.env.DATABASE_URL);
const connectionString = process.env.DATABASE_URL;

const db = new pg.Pool({ connectionString,
    max: 3
});

// =================
// CRIAÇÃO DA TABELA
// =================

// Criação de uma tabela, usamos uma verificação padrão para verificar se a tabela que estamos criando já existe ou não, assim não corremos riscos de repetir a criação
// da mesma tabela
async function createTableEvent () {
    const query = `CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR (250),
        dateOfEvent TIMESTAMP WITH TIME ZONE DEFAULT now(),
        totalTickets NUMERIC (10, 2) NOT NULL,
        totalTicketsSold NUMERIC (10, 2) NOT NULL);
    `;
    
    try {
        const result = await db.query(query);
        console.log(result.rows);
    } catch (error) {
        console.error('Erro ao criar tabela: ', error.message)
    }
}

// ===============================================
// INSERÇÃO DE UMA NOVA LINHA NA TABELA DE EVENTOS
// ===============================================

async function createNewEvent (name, date, total) {
    // Nesse caso estamos indicando a posição dos parametros dos VALUES para passa-los dinamicamente:

    /*  - Posicionamento: O $1 será substituído pelo primeiro elemento da array que você passa logo após a query, o $2 pelo segundo, e assim por diante.
        - O valor 0: No exemplo anterior, o 0 foi colocado diretamente no SQL porque o número de ingressos vendidos de um evento novo é sempre zero. 
        Não era necessário torná-lo dinâmico via parâmetro da função. */
    const query = `INSERT INTO public.events (name, dateOfEvent, totalTickets, totalTicketsSold)
        VALUES ($1, $2, $3, 0);
    `;

    try {
        // Para passar os valores dinamicos, primeiro passamos a query, que seria a indicação da tabela e os campos que desejamos inserir valores, apos isso
        // passamos os valores entre colchetes, como uma array
        const result = await db.query(query, [name, date, total]);
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao inserir linha no banco de dados: ', error.message);
    }
}

// =======================================
// OBTER DADOS DE TODA A TABELA DE EVENTOS
// =======================================
async function getAllEvents () {
    const query = `SELECT * FROM public.events ORDER BY dateOfEvent`; // Ordernar por data de evento

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Erro ao retornar todos os eventos: ', error.message);
    }
}

// ==========================
// BUSCAR UM EVENTO PELO NOME
// ==========================
async function getEventByName (name) {
    const query = `SELECT * FROM public.events WHERE name = $1`;

    try {
        const result = await db.query(query, [name]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Erro ao consultar evento: ', error.message);
    }
}

// ============================
// PROCURAR UM EVENTO PELA DATA
// ============================
async function getEventsByDate (date) {
    //Conversão para Date: Você transforma o campo do banco em apenas data durante a busca.
    const query = `SELECT * FROM public.events WHERE dateOfEvent::date = $1`;

    try {
        const result = await db.query(query, [date]);
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao consultar evento: ', error.message);
    }
}

// =============================
// VENDER TICKET
// =============================
async function sellTicket (id) {
    const query = `SELECT * FROM events WHERE id = $1 FOR UPDATE`

    try {
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return { success: false, error: 'Event não registrado' };
        }

        const event = result.rows[0];
        const today = new Date().toISOString().split('T')[0];

        if (event.dateOfEvent <= today) {
            return { success: false, error: 'O evento ainda vai acontecer.' };
        }

        if (event.totalTicketsSold >= event.totalTickets) {
            return { success: false, error: 'Ingressos esgotados' };
        }

        const update = await db.query(
            `UPDATE events SET totalTicketsSold = totalTicketsSold + 1 WHERE id = $1 RETURNING *`, [id]
        );

        return { success: true, event: update.rows[0] };
    } catch (error) {
        return { success: false, error: error.message };
        console.error('Erro ao vender evento: ', error.message);
    }
}


// ==============================
// FUNÇÃO PARA EXECUTAR TUDO
// ==============================
async function run() {
    try {
        await createTableEvent();
        
        // Comente ou remova após a primeira execução bem-sucedida
        // await createNewEvent('Semifinal Champions: Bayern X PSG', '2026-04-28 16:00:00', 60000);
        
        const events = await getAllEvents();
        // console.log('Eventos encontrados:', events);

        // console.log(await getEventByName('Semifinal champions league, Bayern X PSG'));
        // console.log(await getEventsByDate('2026-04-28'));

        console.log(await sellTicket (1));
    } catch (err) {
        console.error(err);
    } finally {
        await db.end(); // Fecha a conexão com o pool
    }
}

run();