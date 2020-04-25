const { body, param } = require('express-validator');

const crowdfundService = require('@services/crowdfunding.service');

exports.validate = (method) => {

    switch (method) {

        case 'createCrowdfund': {

            return [

                body('name')
                .exists().withMessage("Required body parameter, 'name' not found"),

                body('currency')
                .exists().withMessage("Required body parameter, 'currency' not found."),

                body('amount')
                .exists().withMessage("Required body parameter, 'amount' not found")
            ]
        }

        case 'viewCrowdfund': {

            return [

                param('crowdFundingId').custom(value => {
                    return itExists(value);
                })
            ]
        }

        case 'deleteCrowdfund': {

            return [

                param('crowdFundingId').custom(value => {
                    return itExists(value);
                })
            ]
        }

        case 'updateCrowdfund': {

            return [

                param('crowdFundingId').custom(value => {
                    return itExists(value);
                }),
            ]
        }

        case 'crowdfundPledge': {

            return [

                body("pledge")
                .exists("Required body paramter 'pledge' not found."),

                param('crowdFundingId').custom(value => {
                    return itExists(value);
                }),
            ]
        }

        case 'crowdfundUnpledge': {

            return [

                param('crowdFundingId').custom(value => {
                    return itExists(value);
                }),
            ]
        }

        case 'muteCrowdfundNotification': {

            return [

                param('crowdFundingId').custom(value => {
                    return itExists(value);
                }),
            ]
        }

        case 'unfollowCrowdfund': {

            return [

                param('crowdFundingId').custom(value => {
                    return itExists(value);
                }),
            ]
        }

        case 'addInvite': {

            return [

                body('crowdFundingId')
                .exists().withMessage("expected invite not found")
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