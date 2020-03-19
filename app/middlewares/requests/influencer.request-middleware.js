const { body, param } = require('express-validator')

exports.validate = (method) => {

  switch (method) {

    case 'viewInfluencer': {

      return [ 
        param('influencerId')
        .exists().withMessage("Expected inflencerId parameter not found!")
      ]   
    }

    case 'followInfluencer': {

      return [ 
        param('influencerId')
        .exists().withMessage("Expected inflencerId parameter not found!")
      ]   
    }

  }
}