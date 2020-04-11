const { body, param } = require('express-validator');
const eventService = require('@services/event.service');


exports.validate = (method) => {

   switch (method) {

      case 'createEvent': {

         return [
      
            body('name', 'Invalid email.').exists(),

            body('category', 'Invalid category provided.').exists(),

            body('location', "Required  property, 'location' not provided.")
            .exists(),

            body('startDate', 'Invalid event start date provided.')
            .exists(), //validDate | notInThePast | notGreaterThanEndDate
            
            body('endDate', 'Invalid event start date provided.')
            .exists()
         ]
      }

      case 'viewEvent': {

         return [

            param('eventId').custom(value => {
               return itExists(value);
            })
         ]
      }

      case 'followEvent': {

         return [
            
            param('eventId').custom( value => {
               return itExists(value);
             }),
         ]
      }

      case 'muteEventNotification': {

         return [
            
            param('eventId').custom( value => {
               return itExists(value);
             }),
         ]
      }

      case 'unfollowEvent': {

         return [
            
            param('eventId').custom( value => {
               return itExists(value);
             }),
         ]
      }


      case 'addInvite': {

         return [
            
            body('invites')
            .exists().withMessage("expected invite not found")
         ]
      }

   }
}

const itExists = function( value ){

   return eventService.viewEvent(value).then( event => {
     
      if ( ! event ) {
        return Promise.reject('Event not found!');
      }
    });
}

