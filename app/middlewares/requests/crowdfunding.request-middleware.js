const { body, param } = require('express-validator');

const crowdfundService = require('@services/crowdfunding.service');
const moment = require("moment");

const { validateCurrencyCode } = require("@helpers/currency.helper");


exports.validate = (method) => {

    switch (method) {

        case 'createCrowdfund': {

            return [

                body('name')
                .exists().withMessage("Required body parameter, 'name' not found")
                .custom( async (value, {req, loc, path }) => {

                    let funds = await crowdfundService.all( {name: value, userId: req.authuser._id});

                    if( funds.length > 0){
                        return Promise.reject('Invalid name. Crowdfund with this name already exits!');
                    }
     
                    return true;
                }),

                body('currency')
                .exists().withMessage("Required body parameter, 'currency' not found.")
                .custom( value => {

                    if( ! validateCurrencyCode(value) ) return Promise.reject("Invalid currency code provided");

                    return true;
                }),

                body('amount')
                .exists().withMessage("Required body parameter, 'amount' not found"),

                body('endDate')
                .exists().withMessage("Required body, 'endDate' not found")
                .custom( (value, {req, loc, path }) => {


                    if( ! moment(value ).isValid() ) return Promise.reject('Invalid endDate provided. please make sure your date is valid.');
     
                    let startDate = req.body.startDate || Date.now();
                    let startDateText = req.body.startDate ? "startDate" : "today";
                    if ( moment(startDate).isAfter( value, "hour" ) ) return Promise.reject(`Invalid end date. End date cannot be a date before ${startDateText}!`);
     
                    return true;
                }),

                body('startDate')
                .optional()
                .custom( (value, {req, loc, path }) => {


                    if( value ){
                        if( ! moment(value ).isValid() ) return Promise.reject('Invalid startDate provided. please make sure your date is valid.');

                        if ( moment().isAfter( value, "hour") ) return Promise.reject('Invalid start date. Start date cannot be in the past!');
                    }
                    return true;
                })
            ]
        }

        case 'viewCrowdfund': {

            return [

                param('crowdfundingId').custom(value => {
                    return itExists(value);
                })
            ]
        }

        case 'deleteCrowdfund': {

            return [

                param('crowdfundingId').custom(value => {
                    return itExists(value);
                })
            ]
        }

        case 'updateCrowdfund': {

            return [

                param('crowdfundingId').custom(value => {
                    return itExists(value);
                }),
            ]
        }

        case 'crowdfundPledge': {

            return [

                body("pledge")
                .exists("Required body paramter 'pledge' not found."),

                param('crowdfundingId').custom(value => {
                    return itExists(value);
                }),
            ]
        }

        case 'crowdfundUnpledge': {

            return [

                param('crowdfundingId')
                .exists().withMessage("Expected param 'crowdfundingId' not provided")
                .custom( value => {
                    return itExists( value );
                }),


                param('pledgeId')
                .exists().withMessage("Expected param 'pledgeId' not provided")
                .custom( async ( value, { req, loc, path } ) => {

                    const crowdfund = await crowdfundService.all({ _id: req.params.crowdfundingId, "donors._id": value });

                    if( crowdfund.length < 1 ){

                        return Promise.reject('Donation not found!');
                    }

                    return true;
                }),
            ]
        }

        case 'addInvite': {

            return [

                body('invites')
                .exists().withMessage("Required property, 'invites' not provided"),

                param('crowdfundingId')
                .exists().withMessage("Required 'crowdfundingId' not found!")
                .custom( value => {
                    return itExists(value);
                })
            ]
        }

        case 'removeInvite': {

            return [
                
                body('email')
                .exists().withMessage("Required property, 'email' not provided"),

                param('crowdfundingId')
                .exists().withMessage("Required 'crowdfundingId' not found!")
                .custom( value => {
                    return itExists(value);
                }),
            ]
        }
    }
}


const itExists = function (value) {

    return crowdfundService.viewCrowdFunding(value).then(crowdfund => {

        if (!crowdfund) {
            return Promise.reject('Crowdfund not found!');
        }
    });
}