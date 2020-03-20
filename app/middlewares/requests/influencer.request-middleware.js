const { body, param } = require('express-validator')
const influencerService = require('@services/influencer.service');


exports.validate = (method) => {

  switch (method) {

    /**
     * @requestValidator
     * validates the request to view an influencer
     * 
     */
    case 'viewInfluencer': {

      return [ 
        param('influencerId')
        .exists().withMessage("Expected inflencerId parameter not found!")
      ]   
    }

    /**
     * @requestValidator
     * validates the request to follow an influencer
     */
    case 'followInfluencer': {

      return [ 
        param('influencerId')
        .exists().withMessage("Expected inflencerId parameter not found!")
      ]   
    }

    /**
     * @requestValidator
     * validates the request to unfollow an influencer
     */
    case 'unfollowInfluencer': {

      return [ 

        param('influencerId').custom( value => {

          return influencerService.viewInfluencer(value).then( influencer => {

            if ( ! influencer ) {
              return Promise.reject('Influencer not found!');
            }
          });
        })
        
      ]   
    }

    /**
     * @requestValidator
     * validates the request to create an influencer
     */
    case 'createInfluencer': { 

      return [ 
        body('fee')
        .exists().withMessage("Expected inflencer fee not found!")
        .toFloat(),

        body('category')
        .exists().withMessage("Expected inflencer category not found!"),

        body('username')
        .exists().withMessage("Expected username not found!")
      ]   
    }

    /**
     * @requestValidator
     * validates the request to update an influencer
     */
    case 'updateInfluencer': { 

      return [ 
        param('influencerId')
        .exists().withMessage("Expected influencerId not found!")
      ]   
    }

    /**
     * @requestValidator
     * validates the request to delete an influencer
     */
    case 'deleteInfluencer': {

      return [ 

        param('influencerId').custom( value => {

          return influencerService.viewInfluencer(value).then( influencer => {

            if ( ! influencer ) {
              return Promise.reject('Influencer not found!');
            }
          });
        })
        
      ]   
    }

  }
}

