const express = require('express');
const router = express.Router();
const PromotionController = require('@controllers/promotions.controller');

router.get('/', PromotionController.index);

module.exports = router;