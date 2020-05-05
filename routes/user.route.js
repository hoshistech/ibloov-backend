var express = require('express');
var router = express.Router();

const UserController = require('@controllers/users.controller');

const { validate } = require("@request-middleware/user.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");
const { checkAuth } = require("@middleware/auth.middleware");



router.get('/', [ checkAuth ], UserController.index );

router.post('/register', [ validate("createUser"), isValidRequest ], UserController.create );

router.post('/mobilenumber/sendverificationcode/:userId', [ validate("sendTelephoneVerifcationCode"), isValidRequest ], UserController.sendTelephoneVerifcationCode );

router.get('/mobilenumber/verifycode/:userId/:code', [ validate("verifyTelephoneVerifcationCode"), isValidRequest ], UserController.verifyTelephoneVerifcationCode );

router.get('/wishlists/:userId?', [ checkAuth, validate("userWishlists"), isValidRequest ], UserController.wishlists );

router.get('/events/:userId?', [ checkAuth, validate("userEvents"), isValidRequest ], UserController.events );

router.get('/crowdfunds/:userId?', [ checkAuth, validate("userCrowdfunds"), isValidRequest ], UserController.crowdfunds );

router.get('/tickets/:userId?', [ checkAuth, validate("userTickets"), isValidRequest ], UserController.tickets );

router.get('/:userId', [ checkAuth, validate("viewUser"), isValidRequest ], UserController.view );

router.delete('/:userId',  [ checkAuth, validate("deleteUser"), isValidRequest ], UserController.softdelete );

router.patch('/:userId', [ checkAuth, validate("updateUser"), isValidRequest ], UserController.update );


module.exports = router;
