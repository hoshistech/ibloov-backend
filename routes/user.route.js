var express = require('express');
var router = express.Router();

const UserController = require('@controllers/users.controller');

const { validate } = require("@request-middleware/user.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");



router.post('/register', [ validate("createUser"), isValidRequest], UserController.create );


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });



module.exports = router;
