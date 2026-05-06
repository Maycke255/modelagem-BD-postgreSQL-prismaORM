const UsersModel = require('../../model/UsersModel.js');

class UserControllerAdm {
    async save(req, res) {
        try {
            const { name, email } = req.body;

            if (!name || !email) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: 'Nome e email são obrigatórios'
                });
            }

            const result = await UsersModel.createUser(email, name);

            if (result.success) {
                return res.status(201).json(result);
            } else {
                return res.status(400).json(result);
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: `Erro: ${error.message}`
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, email } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: 'ID é obrigatório'
                });
            }

            const result = await UsersModel.updateUser(id, name, email);

            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json(result);
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: `Erro: ${error.message}`
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: 'ID é obrigatório'
                });
            }

            const result = await UsersModel.deleteUser(id);

            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json(result);
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: `Erro: ${error.message}`
            });
        }
    }
}

module.exports = new UserControllerAdm();