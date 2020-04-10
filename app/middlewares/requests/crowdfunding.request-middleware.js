const { body, param } = require('express-validator');

const crowdfundService = require('@services/crowdfunding.service');

exports.validate = (method) => {

    switch (method) {

        case 'createCrowdfund': {

            return [

                body('name', 'Invalid email.').exists()
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