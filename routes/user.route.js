var express = require('express');
var router = express.Router();

const UserController = require('@controllers/users.controller');

const { validate } = require("@request-middleware/user.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");



router.get('/',  UserController.index );

router.post('/register', [ validate("createUser"), isValidRequest], UserController.create );

router.get('/:userId', UserController.view );

router.delete('/:userId', UserController.softdelete );

router.patch('/:userId', UserController.update );


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });



module.exports = router;
