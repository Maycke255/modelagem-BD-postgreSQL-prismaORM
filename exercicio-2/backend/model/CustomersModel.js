const { query } = require('../database/conection.js')

class Customers {
    constructor (clientRow) {
        this.id = clientRow.id,
        this.name = clientRow.name,
        this.phone = clientRow.phone,
        this.email = clientRow.email,
        this.type = clientRow.type,
        this.createAt = new Date(clientRow.created_at),
        this.updateAt = new Date(clientRow.update_at)
    }

    // GET obter toda a lista
    static async findAll () {
        try {
            const result = await query('SELECT * FROM customers ORDER BY id');

            if (result.rows.length === 0) {
                return { success: false, data: null, message: 'Nenhum cliente cadastrado.' };
            }

            const res = result.rows.map((row) => new Customers(row));

            return { success: true, data: res };
        } catch (error) {
            return { success: false, data: null, message: `Erro ao listar clientes: ${error.message}` };
        }
    }

    //GET obter cliente especifico
    static async findById (id) {
        try {
            const result = await query(`SELECT * FROM customers WHERE id = $1;`, [id]);

            if (result.rows.length === 0) {
                return { success: false, data: null, message: 'Cliente informado inexistente.' };
            }

            const res = new Customers(result.rows[0]);

            return { success: true, data: res };
        } catch (error) {
            return { success: false, data: null, message: `Erro ao listar cliente: ${error.message}` };
        }
    }

    // POST criar novo customer
    static async createNewCustomer (name, phone, email, type) {
        try {
            const result = await query(`INSERT INTO customers (name, phone, email, type)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            ;`,
            [name, phone, email, type]);

            const res = new Customers(result.rows[0]);

            return { success: true, data: res, message: 'Novo cliente cadastrado com sucesso!' };
        } catch (error) {
            return { success: false, data: null, message: `Erro ao criar novo cliente: ${error.message}` };
        }
    }

    // PUT atualizar cliente
    static async updateCustomer (id, name, phone, email, type) {
        try {
            const result = await query(`SELECT * FROM customers WHERE id = $1;`, [id]);

            if (result.rows.length === 0) {
                return { success: false, data: null, message: 'Cliente informado inexistente.' };
            }

            const updates = {};
            if (name !== undefined) updates.name = name;
            if (phone !== undefined) updates.phone = phone;
            if (email !== undefined) updates.email = email;
            if (type !== undefined) updates.type = type;

            // Verifica se há algo para atualizar
            if (Object.keys(updates).length === 0) {
                return { success: false, data: null, message: 'Nenhum campo fornecido para atualizar.' };
            }

            const currentData = result.rows[0];
            const updateData = { ...currentData, ...updates };

            await query(`
                UPDATE customers SET
                    name = $1,
                    phone = $2,
                    email = $3,
                    type = $4,
                    update_at = CURRENT_TIMESTAMP
                WHERE id = $5  
            ;`, [
                updateData.name,
                updateData.phone,
                updateData.email,
                updateData.type,
                id
            ]);

            const updatedResult = await query(`SELECT * FROM customers WHERE id = $1;`, [id]);
            const res = new Customers(updatedResult.rows[0]);

            return { success: true, data: res, message: 'Cliente atualizado com sucesso!' };
        } catch (error) {
            return { success: false, data: null, message: `Erro ao atualizar cliente: ${error.message}` };
        }
    }

    static async deleteCustomer (id) {
        try {
            const selectResult = await query(`SELECT name FROM customers WHERE id = $1;`, [id]);
    
            if (selectResult.rows.length === 0) {
                return { success: false, data: null, message: 'Cliente informado inexistente.' };
            }
    
            const nameCustomer = selectResult.rows[0].name;
    
            await query(`DELETE FROM customers WHERE id = $1;`, [id]);
    
            return { success: true, message: `Cliente ${nameCustomer} deletado com sucesso.`}
        } catch (error) {
            return { success: false, data: null, message: `Erro ao deletar cliente: ${error.message}` };
        }
    }
}

module.exports = Customers;