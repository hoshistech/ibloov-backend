
const { viewEvent } = require("@services/event.service");
const { viewCrowdFunding } = require("@services/crowdfunding.service");



/**
 * payment resources are resources within the application that a payment transaction can occur for
 * e.g you can pay for an event - therefore event is a valid payment resource
 * you can decide to pledge to a crowdfund, which also makes crowdfund a valid payment resource
 * this module also allows us to to expand the scop of payment resources
 * so if tomorrow there is a new resource that could require payment in one if its operations, we ooly need to configure it here.
 */
module.exports = {


/**
 * when adding a new payment resource to this list
 * make sure to import the service to validate the resourceId and add it to the switch statment in "getCallback" function
 */
allowedPaymentResources: [ 

    'event',
    'crowdfund'  
],


/**
 * checks that the resourceId exists for the provided resource
 * @param resource
 * @param resourceId
 * 
 * @returns Boolean
 */
isValidResource: async ( resource, resourceId ) => {

    const callback = getValidatorCallback(resource);

    if( ! callback ) return false;

    const data = await callback( resourceId );

    return ( data ) ? true : false;
}

}


/**
 * returns what serice to be called, dependent on the resource provided.
 * 
 * @param resource String.
 */
const getValidatorCallback = function( resource ){

    let callback;

    switch ( resource ) {

        case "event":
            callback = viewEvent
            break;

        case "crowdfund":
            callback = viewCrowdFunding
            break;
    
        default:
            callback = null;
            break;
    }

    return callback;
}