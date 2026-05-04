const customers = require('../../model/CustomersModel.js');

class CustomersControllAdm {
    async save (req, res) {
        try {
            const { name, phone, email, type } = req.body;

            if (!name || !phone || !type) {
                return res.status(406).json({
                    success: false,
                    message: 'Requisitos para o cadastros inadequados'
                });
            }

            const result = await customers.createNewCustomer(name, phone, email, type);

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

    async update (req, res) {
        try {
            const { id } = req.params;
            const { name, phone, email, type } = req.body;
    
            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: 'ID informado incorretamente'
                });
            }
    
            const result = await customers.updateCustomer(id, name, phone, email, type);

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

    async delete (req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: 'ID informado incorretamente'
                });
            }

            const result = await customers.deleteCustomer(id);

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

module.exports = new CustomersControllAdm ();