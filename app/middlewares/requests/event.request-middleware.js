const { body, param } = require('express-validator');

const eventService = require('@services/event.service');
const wishlistService = require('@services/wishlist.service');
const crowdfundingService = require('@services/crowdfunding.service');
const moment = require("moment");

const { validateCurrencyCode } = require("@helpers/currency.helper");


exports.validate = (method) => {

   switch (method) {

      case 'createEvent': {

         return [
      
            body('name')
            .exists().withMessage("Required body param 'name' not provided")
            .notEmpty().withMessage("name cannot be empty"),

            body('category', 'Invalid category provided.').exists()
            .notEmpty().withMessage("name cannot be empty"),

            body('address', "Required body property, 'address' not provided.")
            .exists()
            .notEmpty().withMessage("name cannot be empty"),

            body('startDate')
            .exists().withMessage('Invalid event start date provided.')
            .notEmpty().withMessage("name cannot be empty")
            .custom( value => {
               return isValidStartDate( value );
            }),
            
            // body('endDate') 
            // .exists().withMessage('Invalid event end date provided.')
            // .custom( (value, {req, loc, path }) => {

            //    if( ! moment(value ).isValid() ) return Promise.reject('Invalid end date provided. please make sure your date is valid.');

            //    let startDate = req.body.startDate;
            //    if ( moment(startDate).isAfter( value, "hour" ) ) return Promise.reject('Invalid end date. End date cannot greater than start date!');

            //    return true;
            // }),

            body("wishlistId")
            .optional()
            .custom( ( value, { req, loc, path } )=> {

               if( value ){

                  return wishlistService.viewWishlist(value).then( wishlist => {
     
                     if ( ! wishlist ) {
                       return Promise.reject("Invalid wishlist. Wishlist not found!");
                     }

                     if( wishlist.userId._id.toString() != req.authuser._id ){
                        return Promise.reject("Unable to add this wishlist to this event. Wishist does not belong to this user");
                     }
                  });
               } 
            }),

            body("crowdfundingId")
            .optional()
            .custom( ( value, {req, loc, path } )=> {

               if( value ){

                  return crowdfundingService.viewCrowdFunding(value).then( crowdfund => {
     
                     if ( ! crowdfund ) { 
                       return Promise.reject("Invalid crowdfund. C rowdfund not found!");
                     }

                     if( crowdfund.userId._id.toString() != req.authuser._id ){
                        return Promise.reject("Unable to add this crowdfund to this event. Crowdfund does not belong to this user");
                     }
                  });
               } 
            }),

            body("isPaid")
            .optional()
            .custom( ( value, { req, loc, path }) => {

               if( typeof value !== 'boolean') return Promise.reject("Invalid 'isPaid' value provided. boolean expected");

               if( value ){
                  
                  if( ! req.body.amount ) return Promise.reject("Body parameter, 'amount' is required for paid events ");

                  if( typeof req.body.amount !== "number" ) return Promise.reject("Invalid body parameter, 'amount' provided. Amount should be a number");

                  if( req.body.amount < 1 ) return Promise.reject("Invalid amount provided.");
                  
                  if( ! req.body.currency ) return Promise.reject("Body parameter, 'currency' is required for paid events "); 

                  if( ! validateCurrencyCode(req.body.currency) ) return Promise.reject("Invalid currency code provided."); 

               }

               return true;
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

      case 'toggleFollowEvent': {

         return [
            
            param('eventId').custom( value => {
               return itExists(value);
             }),
         ]
      }

      case 'toggleLikeEvent': {

         return [
            
            param('eventId').custom( value => {
               return itExists(value);
             }),
         ]
      }

      case 'deleteEvent': {

         return [
            
            param('eventId')
            .notEmpty().withMessage("missing eventId value")
            .custom( ( value, {req, loc, path } ) => {
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
            .exists().withMessage("Required body param, 'status' not provided")
            .custom( value => {

               const allowed = ["YES", "NO"];

               if( ! allowed.includes( value.toUpperCase() ) ){
                  return Promise.reject("Invlaid status provided, status can only be 'YES' or 'NO' ");
               }

               return true;

            }),

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


