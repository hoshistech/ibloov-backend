const { body, param } = require('express-validator')
const userService = require('@services/user.service');


exports.validate = (method) => {

  switch (method) {

    /**
     * @requestValidator
     * validates the request to remove an invite from the wishlis invites
     */
    case 'createUser': {

      return [ 

        body('firstName')
        .exists().withMessage("Required property 'firstName' not found."),

        body('lastName')
        .exists().withMessage("Required property 'lastName' not found."),

        body('email')
        .exists().withMessage("Required property 'email' not found.")
        .isEmail().withMessage("invalid email property provided")
        .custom( (value) => {

          return userService.getUser({ email: value}).then( user => {
    
            if ( user ) {
              return Promise.reject('This email already exists!');
            }
          });
        }),

        body('password')
        .exists().withMessage("Required property 'password' not found.")
       
      ]   
    }
  }
}

const itExists = function( value ){

  return userService.viewUser(value).then( user => {
    
     if ( ! user ) {
       return Promise.reject('Wishlist not found!');
     }
   });
}

