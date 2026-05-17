const express = require('express');

const router = express.Router();

const {
    processInventoryCommand
} = require('../controllers/inventoryController');

router.post('/update', processInventoryCommand);

module.exports = router;