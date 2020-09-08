const feedbackService = require('@services/feedback.service');
const { getOptions, getMatch } = require('@helpers/request.helper');
const uuidv4 = require('uuid/v4');


module.exports = {

    /**
     * @RESTCONTROLLER
     * endpoint to retreive a list of feedbacks
     * 
     * @authlevel authenticated | isAdmin
     */
    index: async (req, res ) => {

        let filter = getMatch(req);
        let options = getOptions(req);

        filter["deletedAt"] = null; 
        filter["userId"] = req.authuser._id; 

        try {
            let feedbacks = await feedbackService.all(filter, options);

            res.status(200).send({
                success: true,
                message: "feedbacks retreived succesfully",
                data: feedbacks
            });

        } catch ( err ) {

            res.status(400).send({
                success: false,
                message: "error performing this operation",
                data: err.toString()
            });
        }
    },


    /**
     * @RESTCONTROLLER
     * endpoint to create a new feedback.
     * 
     * @authlevel authenticated
     */
    create: async (req, res) => { 

        let feedback = req.body;
        feedback.uuid = uuidv4();
        feedback.userId = req.authuser._id;
        
        try {

            let resp = await feedbackService.createFeedback(feedback);
            res.status(201).send({
                success: true,
                message: "feedback created successfully",
                data: resp
            });

        } catch ( err ) {

            res.status(400).send({
                success: false,
                message: "Error performing this operation",
                data: err.toString()
            });
        }
    },


    /**
     * @RESTCONTROLLER
     * endpoint to update a single feedback model
     * 
     * @authlevel authenticated | isOwner
     */
    update: async (req, res) => {

        let feedbackId = req.params.feedbackId;
        let feedbackData = req.body;

        try {

            let resp = await feedbackService.updateFeedback(feedbackId, feedbackData);
            feedbackService.addFeedbackHistory(feedbackId, "FEEDBSCK_UPDATE", req.authuser._id);

            return res.status(200).json({
                success: true,
                message: "feedback information has been updated successfully.",
                data: resp
            });

        } catch ( err ) {

            return res.status(400).json({
                success: false,
                message: "Error occured while trying to update this feedback.",
                data: err.toString()
            });
        }
    },


    /**
     * @RESTCONTROLLER
     * endpoint to retreive a single feedback instance
     * 
     * @authlevel authenticated | isAdmin | isOwner
     */
    view: async (req, res) => {

        let feedbackId = req.params.feedbackId;

        try {
            let feedback = await feedbackService.viewFeedback(feedbackId);

            return res.status(200).json({

                success: true,
                message: "Feedback retreived successfully.",
                data: feedback
            });

        } catch ( err ) {
            return res.status(400).json({
                success: false,
                message: "Error occured while performing this operation.",
                data: err.toString()
            });
        }
    },


    /**
     * @RESTCONTROLLER
     * softDeletes a single feedback instance.
     * 
     * @authLevel - authenticated | isOwner 
     */
    softdelete: async (req, res) => { 

        let feedbackId = req.params.feedbackId;
        let userId = req.authuser._id;

        try {
            
            let resp = await feedbackService.softDeleteFeedback( feedbackId, userId );

            return res.status(200).json({
                success: true,
                message: "Feedback has been deleted successfully.",
                data: resp
            });

        } catch ( err ) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to perform this operation.",
                data: err.toString()
            });
        }
    }
}