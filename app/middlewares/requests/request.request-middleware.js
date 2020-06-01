const { body, param } = require('express-validator')
const requestService = require('@services/request.service');


exports.validate = (method) => {

  switch (method) {

    /**
     * @requestValidator
     * validates the request to remove an invite from the wishlis invites
     */
    case 'denyRequest': {

      return [ 

        param('requestId')
        .exists().withMessage("Required param 'requestId' not found.")
        .custom( (value) => {
            return itExists(value);
        })
       
      ]   
    }

    case 'acceptRequest': {

        return [ 
  
          param('requestId')
          .exists().withMessage("Required param 'requestId' not found.")
          .custom( (value) => {
              return itExists(value);
          })
         
        ]   
      }
  }
}

const itExists = function( value ){

  return requestService.viewRequestById(value).then( user => {
    
     if ( ! user ) {
       return Promise.reject('user not found!');
     }
   });
}

