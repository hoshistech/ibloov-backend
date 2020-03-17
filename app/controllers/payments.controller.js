const paymentService = require('@services/payment.service');

module.exports = {

    checkout: async (req, res) => {

        paymentService.checkout();

    }
}