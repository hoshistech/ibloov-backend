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

        // body('target')
        // .exists().withMessage("target"),

        // body('upload')
        // .exists().withMessage("Required property 'upload' not found.")       
      ]   
    }
  }
}


