const express = require('express');
const router = express.Router();
const PaymentController = require('@controllers/payments.controller');
const { validate } = require("@request-middleware/payment.request-middleware")
const { isValidRequest } = require("@middleware/isRequestValid.middleware")


router.post('/checkout', [ validate("paymentCheckout"), isValidRequest ], PaymentController.checkout);

router.get('/braintree/generate/client_token', PaymentController.generate_client_token);

module.exports = router;