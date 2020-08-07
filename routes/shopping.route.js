const express = require('express');
const router = express.Router();
const ShoppingController = require('@controllers/shopping.controller');

router.get('/product', ShoppingController.searchProduct);

module.exports = router;