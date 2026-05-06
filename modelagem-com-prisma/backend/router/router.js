const express = require('express');
const UserController = require('../controller/UserController.js');
const UserControllerAdm = require('../controller/admin/adm-UserController.js');

const router = express.Router();

//leitura
router.get('/', UserController.main);
router.get('/:id', UserController.getById);

//Escrita e alteração
router.post('/', UserControllerAdm.save);
router.put('/:id', UserControllerAdm.update);
router.delete('/id', UserControllerAdm.delete);

module.exports = router;