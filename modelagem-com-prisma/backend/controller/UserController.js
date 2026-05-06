const UsersModel = require('../model/UsersModel.js');

//Controller apenas para leitura de dados
class UserController {
    async main(req, res) {
        try {
            const result = await UsersModel.findAll();

            if (result.success) {
                return res.status(200).json(result);
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

    async getById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: 'ID é obrigatório'
                });
            }

            const result = await UsersModel.findById(id);

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

module.exports = new UserController();