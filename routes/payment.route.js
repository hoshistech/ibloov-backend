const express = require('express');
const router = express.Router();
const PaymentController = require('@controllers/payments.controller');

const { checkAuth } = require("@middleware/auth.middleware");

const { validate } = require("@request-middleware/payment.request-middleware")
const { isValidRequest } = require("@middleware/isRequestValid.middleware")


router.post('/checkout', [ checkAuth, validate("paymentCheckout"), isValidRequest ], PaymentController.checkout);

router.get('/braintree/generate/client_token', [ checkAuth ], PaymentController.generate_client_token);

router.post('/stripe/token', [ checkAuth, validate("stripeToken"), isValidRequest ], PaymentController.stipePaymentIntent);

router.post('/stripe/capture', [ checkAuth ], PaymentController.capturePayment);

module.exports = router;