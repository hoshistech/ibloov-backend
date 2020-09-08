const {
    body,
    param
} = require('express-validator')
const feedbackService = require('@services/feedback.service');


exports.validate = (method) => {

    switch (method) {

        /**
         * @requestValidator
         * validates the request to view an feedback
         * 
         */
        case 'viewFeedback': {

            return [
                param('feedbackId')
                .exists().withMessage("Expected param 'feedbackId' not found!")
                .custom(value => {
                    return itExists(value);
                })

            ]
        }


        /**
         * @requestValidator
         * validates the request to create a new feedback
         */
        case 'createFeedback': {

            return [

                body('message')
                .exists().withMessage("Expected body param 'message' not found!")
            ]
        }

        /**
         * @requestValidator
         * validates the request to update an feedback
         */
        case 'updateFeedback': {

            return [

                param('feedbackId')
                .custom(value => {
                    return itExists(value);
                })
            ]
        }

        /**
         * @requestValidator
         * validates the request to delete an feedback
         */
        case 'deleteFeedback': {

            return [

                param('feedbackId')
                .custom(value => {
                    return itExists(value);
                })

            ]
        }
    }
}


const itExists = function (value) {

    return feedbackService.viewFeedback(value).then(feedback => {

        if (!feedback) {
            return Promise.reject('Feedback not found!');
        }
    });
}