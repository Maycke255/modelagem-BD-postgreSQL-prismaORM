const customers = require('../model/CustomersModel.js');

class CustomersControll {
    async index (req, res) {
        try {
            const result = await customers.findAll();

            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(400).json(result);
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async indexById (req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: 'ID informado incorretamente'
                });
            }

            const result = await customers.findById(id);

            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(400).json(result);
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new CustomersControll();