
const express = require('express');
const router = express.Router();
const feedbackController = require('@controllers/feedbacks.controller');

//middlewares
const { validate } = require("@request-middleware/feedback.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");
const { checkAuth } = require("@middleware/auth.middleware");


router.patch('/:feedbackId', [ checkAuth, validate("updateFeedback"), isValidRequest ], feedbackController.update );

router.delete('/:feedbackId', [ checkAuth, validate("deleteFeedback"), isValidRequest ], feedbackController.softdelete );

router.get('/', [ checkAuth ], feedbackController.index ) ;

router.get('/:feedbackId', [ checkAuth, validate("viewFeedback"), isValidRequest ], feedbackController.view );

router.post('/create', [ checkAuth, validate("createFeedback"), isValidRequest ], feedbackController.create );

module.exports = router; 
