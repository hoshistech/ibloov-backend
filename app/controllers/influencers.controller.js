const influencerService = require('@services/influencer.service');
const mailer = require('@services/mail.service');
const uuidv4 = require('uuid/v4');

module.exports = {

    /**
     * @RESTCONTROLLER
     * endpoint to retreive a list of influencers
     * 
     * @authlevel authenticated
     */
    index: async (req, res) => {

        try {
            let influencers = await influencerService.all();

            res.status(200).send({
                success: true,
                message: "influencers retreived succesfully",
                data: influencers
            });

        } catch (e) {

            res.status(400).send({
                success: false,
                message: "error performing this operation",
                data: e.toString()
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
        
        /**
         * @todo replace this with the actual user
         */
        influencer.user = { 
            id: "ovmvmmvmvmmvmvmv", 
            fullName: "ninnvj nvvnjv", 
            phoneNumber: "090883747744", 
            email: "user@test.com"
        };

        try {

            await influencerService.createInfluencer(influencer);
            res.status(201).send({
                success: true,
                message: "influencer created successfully",
                data: influencer
            });

        } catch (e) {

            res.status(400).send({
                success: false,
                message: "Error performing this operation",
                data: e.toString()
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

        try {
            
            let resp = await influencerService.softDeleteInfluencer( influencerId );
            return res.status(200).json({
                success: true,
                message: "Influencer has been deleted successfully.",
                data: resp
            });

        } catch (e) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to perform this operation.",
                data: e.toString()
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

            let user = {

                _id: "5e74a056a1d062242108b211",
                fullName: "Imogene Lebsack",
                email: "Mike_Powlowski12@yahoo.com"
            };

            let influencerId = req.params.influencerId;
            let influencer = await influencerService.viewInfluencer(influencerId);

            if (! influencer) {
                return res.status(404).json({
                    success: false,
                    message: "Influencer not found."
                });
            };

            await influencerService.followInfluencer(influencerId, user);
            return res.status(200).json({
                successful: true,
                message: `you are now following ${ influencer.user.fullName }`
            });

        } catch (err) {

            return res.status(400).json({

                data: err.toString(),
                successful: false,
                message: "Error performing this request."
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

            let user = {

                _id: "5e74a056a1d062242108b211",
                fullName: "Imogene Lebsack",
                email: "Mike_Powlowski12@yahoo.com"
            };

            let influencerId = req.params.influencerId;
            let influencer = await influencerService.viewInfluencer(influencerId);

            if (! influencer) {
                return res.status(404).json({
                    success: false,
                    message: "Influencer not found."
                });
            };

            await influencerService.unfollowInfluencer(influencerId, user);
            return res.status(200).json({
                successful: true,
                message: `you have unfollowed ${ influencer.user.fullName } successfully.`
            });

        } catch (err) {

            return res.status(400).json({

                data: err.toString(),
                successful: false,
                message: "Error performing this request."
            });
        }
    },
}