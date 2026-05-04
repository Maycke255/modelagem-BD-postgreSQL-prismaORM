const { query } = require('./conection.js');

async function syncDatabase() {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS customers (
                id SERIAL PRIMARY KEY NOT NULL,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                email VARCHAR(330),
                type VARCHAR(4) NOT NULL CHECK (type IN ('CPF', 'CNPJ')),
                created_at TIMESTAMP DEFAULT now(),
                update_at TIMESTAMP DEFAULT now()
            );
        `);
    
        await query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                stock_quantity INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE
            );
        `);
    
      console.log('Created "products" and "custormers" table, in "node_postgres".');
    } catch (error) {
        console.error('Error during database sync: ', error.message);
    } finally {
        process.exit(0);
    }
}

syncDatabase();