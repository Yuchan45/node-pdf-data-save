const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

const { index, processData } = mainController;

router.get('/', index);
router.post('/processData', processData);


module.exports = router;