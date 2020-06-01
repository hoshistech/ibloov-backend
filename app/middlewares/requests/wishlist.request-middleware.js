const { body, param } = require('express-validator')
const wishlistService = require('@services/wishlist.service');


exports.validate = (method) => {

  switch (method) {

    /**
     * @requestValidator
     * validates the request to remove an invite from the wishlis invites
     */
    case 'createWishlist': {

      return [ 

        body('name')
        .exists().withMessage("Required property name not found."),
       
      ]   
    }

    case 'viewWishlist': {

      return [ 

        param('wishlistId')
        .custom( value => {
          return itExists(value);
        })
       
      ]   
    }

    case 'deleteWishlist': {

      return [ 

        param('wishlistId')
        .custom( value => {
          return itExists(value);
        })
       
      ]   
    }

    /**
     * @requestValidator
     * validates the request to update a wishlist
     */
    case 'updateWishlist': {

      return [ 

        param('wishlistId').custom( value => {
          return itExists(value);
        })
       
      ]   
    }

    /**
     * @requestValidator
     * validates the request to pledge to an item on a wishlist
     */
    case 'pledgeItem': {

      return [ 

        param('wishlistId')
        .custom( value => {
          return itExists(value);
        }),

        body('itemId')
        .exists().withMessage("Required property 'itemId' not found.")
        .custom( value => {

          return wishlistService.all({"items._id": value}).then( result => {
    
            if ( ! result  || result.length < 1 ) {
              return Promise.reject("invalid ItemId provided");
            }
          });
        })
        
      ]   
    }


    /**
     * @requestValidator
     * validates the request to unpledge to an item on a wishlist
     */
    case 'unpledgeItem': {

      return [ 

        param('wishlistId')
        .custom( value => {
          return itExists(value);
        }),

        body('itemId')
        .exists().withMessage("Required property 'itemId' not found.")
        
      ]   
    }

    /**
     * @requestValidator
     * validates the request to remove an invite from the wishlis invites
     */
    case 'removeInvite': {

      return [ 

        param('wishlistId').custom( value => {
          return itExists(value);
        }),

        body("email")
        .exists().withMessage("Required property 'email' not provided")
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
          return itExists(value)
        }),

        body("invites")
        .exists().withMessage("Required property 'invite' not found.")
      ]   
    }

    /**
     * @requestValidator
     * validates the request to a add new item(s) to a wishlist
     */
    case 'addItem': {

      return [ 

        param('wishlistId').custom( value => {
          return itExists(value)
        }),

        body("item")
        .exists().withMessage("Required property 'item' not found.")
        
      ]   
    }

    /**
     * @requestValidator
     * validates the request to a remove new item(s) to a wishlist
     */
    case 'removeItem': {

      return [ 

        param('wishlistId').custom( value => {
          return itExists(value)
        }),

        body("itemId")
        .exists().withMessage("Required property 'itemId' not found.")
        
      ]   
    }
  }
}

const itExists = function( value ){

  return wishlistService.viewWishlist(value).then( wishlist => {
    
     if ( ! wishlist ) {
       return Promise.reject('Wishlist not found!');
     }
   });
}

