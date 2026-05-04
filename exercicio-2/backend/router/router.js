const express = require('express');
const router = express.Router();
const customersControll = require('../controller/CustomersController.js');
const CustomersControllAdm = require('../controller/admin/adm_CustomersController.js');

// ROTAS GET leitura
router.get('/api/customers', customersControll.index);
router.get('/api/customers/:id', customersControll.indexById);

// ROTAS ADMIN (mutações)
router.post('/api/customers', CustomersControllAdm.save);
router.put('/api/customers/:id', CustomersControllAdm.update);

// DELETE ADMIN exclusão
router.delete('/api/customers/:id', CustomersControllAdm.delete);

module.exports = router;