const express = require('express');
const router = express.Router();
const PaymentController = require('@controllers/payments.controller');

router.post('/checkout', PaymentController.checkout);

module.exports = router;