const influencerService = require('@services/influencer.service');
const mailer = require('@services/mail.service');
const uuidv4 = require('uuid/v4');
const userService = require('@services/user.service');
const { getOptions, getMatch } = require('@helpers/request.helper');

module.exports = {

    /**
     * @RESTCONTROLLER
     * endpoint to retreive a list of influencers
     * 
     * @authlevel authenticated
     */
    index: async (req, res) => {

        let filter = getMatch(req);
        let options = getOptions(req);
        filter["deletedAt"] = null; 

        try {
            let influencers = await influencerService.all(filter, options);

            res.status(200).send({
                success: true,
                message: "influencers retreived succesfully",
                data: influencers
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
     * endpoint to create a new influencer.
     */
    create: async (req, res) => { 

        let influencer = req.body;
        influencer.uuid = uuidv4();
        influencer.userId = req.authuser._id;
        
        try {

            let resp = await influencerService.createInfluencer(influencer);
            res.status(201).send({
                success: true,
                message: "influencer created successfully",
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
     * endpoint to update a single influencer model
     * 
     * @authlevel authenticated
     */
    update: async (req, res) => {

        let influencerId = req.params.influencerId;
        let influencerData = req.body;

        if (! influencerData ) {

            return res.status(400).json({

                success: false,
                message: "required update data missing."
            });
        }

        try {

            let influencer = await influencerService.viewInfluencer(influencerId);

            if (! influencer) {
                return res.status(404).json({
                    success: false,
                    message: "Influencer not found."
                });
            }

            let resp = await influencerService.updateInfluencer(influencerId, influencerData);
            influencerService.addInfluencerHistory(influencerId, "INFLUENCER_UPDATE");

            return res.status(200).json({
                success: true,
                message: "influencer information has been updated successfully.",
                data: resp
            });
        } catch (e) {

            return res.status(400).json({
                success: false,
                message: "Error occured while trying to update this influencer.",
                data: e
            });
        }
    },


    /**
     * @RESTCONTROLLER
     * endpoint to retreive a single influencer instance
     * 
     * @authlevel authenticated isAdmin|isSelf
     */
    view: async (req, res) => {

        let influencerId = req.params.influencerId;

        try {
            let influencer = await influencerService.viewInfluencer(influencerId);

            if (!influencer) {

                return res.status(404).json({
                    success: true,
                    message: "influencer not found!."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Influencer retreived successfully.",
                data: influencer
            });

        } catch (e) {
            return res.status(400).json({
                success: false,
                message: "Error occured while performing this operation.",
                data: e
            });
        }
    },


    /**
     * @RESTCONTROLLER
     * softDeletes a single influencer instance.
     * 
     * @authLevel - authenticated | isEventAdmin 
     */
    softdelete: async (req, res) => { 

        let influencerId = req.params.influencerId;
        let userId = req.authuser._id;

        try {
            
            let resp = await influencerService.softDeleteInfluencer( influencerId, userId );
            return res.status(200).json({
                success: true,
                message: "Influencer has been deleted successfully.",
                data: resp
            });

        } catch ( err ) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to perform this operation.",
                data: err.toString()
            });
        }
    },


    /**
     * @RESTCONTROLLER
     * endpoint to add a new follower to the followers of an influencer
     * 
     * @authlevel authenticated
     */
    follow: async (req, res) => {

        try {
            
            influencerId = req.params.influencerId;

            let follower = await userService.viewUser( req.authuser._id );
            let resp = await influencerService.followInfluencer(influencerId, follower);

            return res.status(200).json({

                successful: true,
                message: `you are now following ${ follower.fullName }`,
                data: resp
            });

        } catch ( err ) {

            return res.status(400).json({

                successful: false,
                message: "Error performing this request.",
                data: err.toString(),
            });
        }
    },

    /**
     * @RESTCONTROLLER
     * endpoint to add a new follower to the followers of an influencer
     * 
     * @authlevel authenticated|isSelf
     */
    unfollow: async (req, res) => {

        try {

            let influencerId = req.params.influencerId;

            let resp = await influencerService.unfollowInfluencer(influencerId, req.authuser._id);

            return res.status(200).json({

                successful: true,
                message: `you have unfollowed successfully.`,
                data: resp
            });

        } catch ( err ) {

            return res.status(400).json({

                data: err.toString(),
                successful: false,
                message: "Error performing this request."
            });
        }
    },

    verifyInfluencer: async (req, res) => {

        let influencerId = req.params.influencerId

        try{
            
            let influencer = await influencerService.verifyInfluencer(influencerId);

            return res.status(200).json({
                success: true,
                message: "Influencer verified successfully",
                data: influencer
            });

        } catch (err) {

            return res.status(400).json({
                success: false,
                message: "oops! An errocured while carrying out this operation",
                data: err.toString()
            });
        }

    }
}