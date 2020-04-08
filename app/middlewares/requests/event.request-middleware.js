const { body, param } = require('express-validator');
const eventService = require('@services/event.service');


exports.validate = (method) => {

   switch (method) {

      case 'createEvent': {

         return [
            param('inflencerId', "userName doesn't exists.").exists(),
            body('name', 'Invalid email.').exists()
            .isEmail(),

            body('category', 'Invalid category provided.').exists(),

            body('eventStartDate', 'Invalid event start date provided.').exists(), //validDate | notInThePast | notGreaterThanEndDate 
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

