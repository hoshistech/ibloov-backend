const {
  body,
  param
} = require('express-validator')
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
        .custom((value) => {

          return userService.getUser({
            email: value
          }).then(user => {

            if (user) {
              return Promise.reject('This email already exists!');
            }
          });
        }),

        body('phoneNumber')
        .exists().withMessage("Required body property 'phoneNumber' not found.") 
        .custom( (value) => {

          return userService.getUser({ phoneNumber: value }).then( user => {

            if ( user ) {
              return Promise.reject('This phoneNumber already exists!');
            }
          });
        }),

        body('password')
        .exists().withMessage("Required body property 'password' not found.")

      ]
    }

    case 'updateUser': {

      return [

        param('userId')
        .exists().withMessage("Required parameter 'userId' not found.")
        .custom((value) => {
          return itExists(value);
        })
      ]
    }

    case 'viewUser': {

      return [

        param('userId')
        .exists().withMessage("Required parameter 'userId' not found.")
        .custom((value) => {
          return itExists(value);
        })
      ]
    }

    case 'deleteUser': {

      return [

        param('userId')
        .exists().withMessage("Required parameter 'userId' not found.")
        .custom((value) => {
          return itExists(value);
        })
      ]
    }

    case 'userEvents': {

      return [

        param('userId')
        .optional()
        .custom((value) => {
          if (value) return itExists(value);
        })
      ]
    }

    case 'userWishlists': {

      return [

        param('userId')
        .optional()
        .custom((value) => {
          if (value) return itExists(value);
        })
      ]
    }

    case 'userCrowdfunds': {

      return [

        param('userId')
        .optional()
        .custom((value) => {

          if (value) return itExists(value);

        })
      ]
    }

    case 'userTickets': {

      return [

        param('userId')
        .optional()
        .custom((value) => {

          if (value) return itExists(value);

        })
      ]
    }

    case 'sendTelephoneVerifcationCode': {

      return [

        param('userId')
        .exists().withMessage("Required parameter, 'userId' not found.")
        .custom((value) => {
          return itExists(value);
        })

      ]
    }

    case 'verifyTelephoneVerifcationCode': {

      return [

        param('userId')
        .exists().withMessage("Required parameter, 'userId' not found.")
        .custom((value) => {
          return itExists(value);
        }),

        param('code')
        .exists().withMessage("Required parameter, 'code' not found.")

      ]
    }

    case 'unfollowUser': {

      return [

        param('userId')
        .custom((value) => {
          if (value) return itExists(value);
        })
      ]
    }

    case 'followUser': {

      return [

        param('userId')
        .custom((value, {
          req,
          loc,
          path
        }) => {

          if (value == req.authuser._id.toString()) {
            return Promise.reject('unable to process this request. Target user same as auth user');
          }

          if (value) return itExists(value);

        })
      ]
    }

    case 'acceptFollowRequest': {

      return [

        param('userId')
        .custom((value) => {
          if (value) return itExists(value);
        })
      ]
    }

    case 'toggleFollowUser': {

      return [

        param('userId').custom(value => {
          return itExists(value);
        }),
      ]
    }

    case 'userFriends': {

      return [

        param('userId').custom( value => {

          if( value ) return itExists(value);

          return true;
          
        }),
      ]
    }

    case 'socialUser': {

      return [

        param('scope')
        .exists().withMessage("Expected param 'scope' not provided"),

        /**
         * Todo - add the allowed scopes here e.g - facebook, google, twitter
         */

        body('id')
        .exists().withMessage("Expected body param 'id' not provided"),

        // body('email')
        // .exists().withMessage("Expected bpdy param 'email' not provided")
        // .isEmail().withMessage("Invalid email provided"),

        body('fullName')
        .custom(( value, { req, loc, path }) => {

          if ( ! value ) {

            if( ! req.body.firstName || ! req.body.lastName )
              return Promise.reject("missing parameter. 'fullName' shoud be provided if 'firstName' and 'lastName' are not provided");
          }

          return true;

        })
      ]
    }


  }
}

const itExists = function (value) {

  return userService.viewUser(value).then(user => {

    if (!user) {
      return Promise.reject('user not found!');
    }
  });
}