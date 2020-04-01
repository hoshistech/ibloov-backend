const { body, param } = require('express-validator')
const wishlistService = require('@services/wishlist.service');


exports.validate = (method) => {

  switch (method) {

    /**
     * @requestValidator
     * validates the request to remove an invite from the wishlis invites
     */
    case 'removeInvite': {

      return [ 

        param('wishlistId').custom( value => {

          return wishlistService.viewWishlist(value).then( wishlist => {

            if ( ! wishlist ) {
              return Promise.reject('wishlist not found!');
            }
          });
        }),

        body("email")
        .exists().withMessage("email not provided")
        .isEmail().withMessage("invalid email value provided")        
      ]   
    }

    /**
     * @requestValidator
     * validates the request to a add new invite(s) to a wishlist
     */
    case 'addInvites': {

      return [ 

        param('wishlistId').custom( value => {

          return wishlistService.viewWishlist(value).then( wishlist => {

            if ( ! wishlist ) {
              return Promise.reject('wishlist not found!');
            }
          });
        })
        
      ]   
    }
  }
}

