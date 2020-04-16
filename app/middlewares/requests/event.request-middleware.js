const { body, param } = require('express-validator');

const eventService = require('@services/event.service');
const wishlistService = require('@services/wishlist.service');

const moment = require("moment");


exports.validate = (method) => {

   switch (method) {

      case 'createEvent': {

         return [
      
            body('name', 'Invalid email.').exists(),

            body('category', 'Invalid category provided.').exists(),

            body('address', "Required  body property, 'address' not provided.")
            .exists(),

            body('startDate')
            .exists().withMessage('Invalid event start date provided.') //validDate | notInThePast | notGreaterThanEndDate
            .custom( value => {
               return isValidStartDate( value );
            }),
            
            body('endDate') 
            .exists().withMessage('Invalid event end date provided.')
            .custom( (value, {req, loc, path }) => {

               if( ! moment(value ).isValid() ) return Promise.reject('Invalid end date provided. please make sure your date is valid.');

               let startDate = req.body.startDate;
               if ( moment(startDate).isAfter( value, "hour" ) ) return Promise.reject('Invalid end date. End date cannot greater than start date!');

               return true;
            }),


            body("wishlistId")
            .optional()
            .custom( ( value, {req, loc, path } )=> {

               if( value ){

                  return wishlistService.viewWishlist(value).then( wishlist => {
     
                     if ( ! wishlist ) {
                       return Promise.reject("Invalid wishlist. Wishlist not found!");
                     }

                     if( wishlist.userId.toString() != req.authuser._id ){
                        return Promise.reject("Unable to add this wishlist to this event. Wishist does not belong to this user");
                     }
                  });
               }
               
            })
         ]
      }

      case 'viewEvent': {

         return [

            param('eventId')
            .custom(value => {
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

      case 'deleteEvent': {

         return [
            
            param('eventId').custom( value => {
               return itExists(value);
             }),
         ]
      }
 
      case 'updateEvent': {

         return [
            
            param('eventId').custom( value => {
               return itExists(value);
             }),
         ]
      }


      case 'addInvite': {

         return [
            
            body('invites')
            .exists().withMessage("Required property, 'invites' not provided"),

            param('eventId')
            .custom( value => {
               return itExists(value)
            })
         ]
      }

      case 'removeInvite': {

         return [
            
            body('email')
            .exists().withMessage("Required property, 'email' not provided"),

            param('eventId')
            .custom( value => {
               return itExists(value)
            })
         ]
      }

      case 'confirmAttendance': {

         return [ 
            
            body('status')
            .exists().withMessage("Required body param, 'status' not provided"),

            param('eventId')
            .custom( value => {
               return itExists(value)
            })
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

const isValidStartDate = function( value ){

   if( ! moment(value ).isValid() ) return Promise.reject('Invalid start date provided. please make sure your date is valid.');

   if ( moment().isAfter( value, "hour") ) return Promise.reject('Invalid start date. Start date cannot be in the past!');

   return true;
}


