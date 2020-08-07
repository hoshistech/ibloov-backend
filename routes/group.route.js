
const express = require('express');
const router = express.Router();
const groupController = require('@controllers/groups.controller');

//middlewares
const { validate } = require("@request-middleware/group.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");
const { checkAuth } = require("@middleware/auth.middleware");


router.patch('/:groupId', [ checkAuth, validate("updateGroup"), isValidRequest ], groupController.update );

router.delete('/:groupId', [ checkAuth, validate("deleteGroup"), isValidRequest ], groupController.softdelete );

router.get('/', [ checkAuth ], groupController.index ) ;

router.get('/:groupId', [ checkAuth, validate("viewGroup"), isValidRequest ], groupController.view );

router.post('/create', [ checkAuth, validate("createGroup"), isValidRequest ], groupController.create );

router.patch('/contact/add/:groupId', [ checkAuth, validate("addContact"), isValidRequest ], groupController.addContacts );

router.patch('/contact/remove/:groupId', [ checkAuth, validate("removeContact"), isValidRequest ], groupController.removeContacts );


module.exports = router; 
