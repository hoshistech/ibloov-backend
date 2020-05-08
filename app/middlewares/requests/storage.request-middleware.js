const { body, param } = require('express-validator')
const userService = require('@services/user.service');


exports.validate = (method) => {

  switch (method) {

    /**
     * @requestValidator
     * validates the request to upload a file
     */
    case 'upload': {

      return [ 

        param('resource')
        .exists().withMessage("Required parameter 'resource' not found.") 
        .custom( value => {

          const allowedResources = ["avatar", 'event', 'wishlist', 'crowdfund'];
          
          if ( ! allowedResources.includes( value )){
            return Promise.reject('invalid resource provided.');
          }

          return true;
        })      
      ]   
    }
  }
}


