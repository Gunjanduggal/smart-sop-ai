const express = require('express');
const router = express.Router();
const { processInventoryCommand } = require('../controllers/inventorycontroller');

router.post('/update', processInventoryCommand);

module.exports = router;
