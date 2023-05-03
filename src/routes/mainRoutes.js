const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

const { index } = mainController;

router.get('/', index);


module.exports = router;