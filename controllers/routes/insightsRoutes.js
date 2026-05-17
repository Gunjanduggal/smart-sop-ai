const express = require('express');

const router = express.Router();

const {
    getBusinessInsights
} = require('../controllers/insightsController');

router.get('/', getBusinessInsights);

module.exports = router;