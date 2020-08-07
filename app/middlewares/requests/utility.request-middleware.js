const { param } = require('express-validator')
const groupService = require('@services/group.service');


exports.validate = (method) => {

  switch (method) {


    /**
     * @requestValidator
     * validates the request to create a new group
     */ 
    case 'qrresource': { 

      return [ 

        param('qr')
        .exists().withMessage("Expected param 'qr' not found!")
        .custom( async ( value ) => {

            if( value ){

                const qrEnabledResources = [ 'user', 'event', 'crowdfund' ];
                //if( ! qrEnabledResources.includes(value) ) return Promise.reject(`${value } is not a valid/enabled QR resoure!`);
            }

            return true;
        })
      ]   
    }
  }
}

