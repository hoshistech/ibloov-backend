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

    case 'updateUser': {

      return [ 

        param('userId')
        .exists().withMessage("Required parameter 'userId' not found.")
        .custom( (value) => {
          return itExists(value);
        })     
      ]   
    }

    case 'viewUser': {

      return [ 

        param('userId')
        .exists().withMessage("Required parameter 'userId' not found.")
        .custom( (value) => {
          return itExists(value);
        })     
      ]   
    }

    case 'deleteUser': {

      return [ 

        param('userId')
        .exists().withMessage("Required parameter 'userId' not found.")
        .custom( (value) => {
          return itExists(value);
        })     
      ]   
    }

    case 'userEvents': {

      return [ 

        param('userId')
        .optional()
        .custom( (value) => {
          if( value ) return itExists(value);
        })     
      ]   
    }

    case 'userWishlists': {

      return [ 

        param('userId')
        .optional()
        .custom( (value) => {
          if( value ) return itExists(value);
        })     
      ]   
    }

    case 'userCrowdfunds': {

      return [ 

        param('userId')
        .optional()
        .custom( (value) => {

          if( value ) return itExists(value);
          
        })     
      ]   
    }

    case 'sendTelephoneVerifcationCode': {

      return [ 

        param('userId')
        .exists().withMessage("Required parameter, 'userId' not found.")
        .custom( (value) => {
          return itExists(value);
        })

      ]   
    } 
    case 'verifyTelephoneVerifcationCode': {

      return [ 

        param('userId')
        .exists().withMessage("Required parameter, 'userId' not found.")
        .custom( (value) => {
          return itExists(value);
        }),

        param('code')
        .exists().withMessage("Required parameter, 'code' not found.")

      ]   
    }
  }
}

const itExists = function( value ){

  return userService.viewUser(value).then( user => {
    
     if ( ! user ) {
       return Promise.reject('user not found!');
     }
   });
}

