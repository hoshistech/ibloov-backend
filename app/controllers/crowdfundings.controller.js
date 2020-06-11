const uuidv4 = require('uuid/v4');
const pagination = require('@helpers/pagination.helper'); 

//services
const crowdfundingService = require('@services/crowdfunding.service');

//helpers
const { getOptions, getMatch } = require('@helpers/request.helper');

//notifs
const { crowdfundPledgeNotification } = require("@info-notif/crowdfund-pledge.notif");

module.exports = {


    /**
     * get crowdFundings
     * @authLevel - authenticated | isAdmin 
     */
    index: async (req, res) => {

        let filter = getMatch(req);
        let options = getOptions(req);
        filter["deletedAt"] = null;

        try{

            let [ crowdFundings, crowdfundCount ] = await Promise.all([
                crowdfundingService.all(filter, options),
                crowdfundingService.allCount(filter)
              ]);

            return res.status(200).send({
                success: true,
                message: "crowdFundings retreived succesfully",
                data: crowdFundings,
                pagination: pagination( crowdfundCount, options, filter, "crowdfunding" )
            });
        }
        catch( err ){

            res.status(400).send({
                success: false,
                message: "error performing this operation",
                data: err.toString()
            });
        }
        
    },


    /**
     * creates a new crowdFunding instance.
     * @authLevel - authenticated
     */
    create: async (req, res) => {

        let crowdFunding = req.body;
        crowdFunding.userId = req.authuser._id; 
        crowdFunding.uuid = uuidv4();

        try{
            let resp = await crowdfundingService.createCrowdFunding(crowdFunding);
            return res.status(201).send({
                success: true,
                message: "CrowdFunding created successfully",
                data: resp
            });
        }
        catch( err ){

            res.status(400).send({
                success: false,
                message: "Error performing this operation",
                data: err.toString()
            });
        }
    },


    /**
     * update a single crowdFunding model instance
     * @authLevel - authenticated | isCrowdFundingCreator
     * 
     */
    update:  async (req, res) => {

        let crowdfundingId = req.params.crowdfundingId;
        let crowdFundingData = req.body.data;

        try {
            
            let resp = await crowdfundingService.updateCrowdFunding(crowdfundingId, crowdFundingData);
            //crowdfundingService.addCrowdFundingHistory(crowdfundingId, "CROWDFUNDING_UPDATE")
            
            return res.status(200).json({
                success: true,
                message: "CrowdFunding information has been updated successfully.",
                data: resp
            });

        } catch ( err ) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to update this crowdFunding.",
                data: err.toString()
            });
        }
    },


    /**
     * returns data of a single crowdFunding instance
     * @authLevel - authenticated | isCrowdFundingCreator | isPublicCrowdFunding
     * 
     */
    view:  async (req, res) => {

        let crowdfundingId = req.params.crowdfundingId;

        try {
            let crowdFunding = await crowdfundingService.viewCrowdFunding(crowdfundingId);

            return res.status(200).json({
                success: true,
                message: "CrowdFunding retreived successfully.",
                data: crowdFunding
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
     * softDeletes a single crowdFunding instance.
     * @authLevel - authenticated | isCrowdFundingCreator
     */
    softdelete: async (req, res) => { 

        let crowdfundingId = req.params.crowdfundingId;
        let userId = req.authuser._id;

        try {
            
            let resp = await crowdfundingService.softDeleteCrowdFunding(crowdfundingId, userId);
            return res.status(200).json({
                success: true,
                message: "CrowdFunding information has been deleted successfully.",
                data: resp
            });

        } catch ( err ) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to update this crowdFunding.",
                data: err.toString()
            });
        }
    },


    /**
     * adds a new pledge to a single crowdFunding instance.
     * @authLevel - authenticated | isPledgeOwner
     */
    pledge: async (req, res) => { 

        let crowdfundingId = req.params.crowdfundingId;
        let pledge = parseFloat( req.body.pledge );
        let userId = req.authuser._id;

        try {

            /**
             * Todo - check that there is a log of the payment before committing it here 
             * or better still, send a notification (or a query log ) if no log of the payment was found.
             */
            let resp = await crowdfundingService.pledge( crowdfundingId, pledge, userId );

            crowdfundPledgeNotification( userId, resp.userId, resp  );

            return res.status(200).json({
                success: true,
                message: "Pledge has been added successfully.",
                data: resp
            });

        } catch ( err ) {

            /**
             * Todo - log failed pledges
             * why? pledges are saved only after the user successfully donates
             * if there is a problem during commiting the pledge, then some extra measures have to be put in place to make sure it is later saved
             */
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to update this crowdFunding.",
                data: err.toString()
            });
        }
    },


    /**
     * removes a single pledge object from a single crowdFunding instance.
     * @authLevel - authenticated
     */
    unpledge: async (req, res) => { 

        const crowdfundingId = req.params.crowdfundingId;
        const pledgeId = req.params.pledgeId;

        try {
            
            let resp = await crowdfundingService.unPledge(crowdfundingId, pledgeId);

            return res.status(200).json({
                success: true,
                message: "Pledge has been removed successfully.",
                data: resp
            });

        } catch ( err ) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to update this crowdFunding.",
                data: err.toString()
            });
        }
    },


    /**
     * adds new invitees to the event invitees
     * Todo - only the creator or admins of an event should be able to do this
     */
    addInvites: async ( req, res) => {

        let crowdfundingId = req.params.crowdfundingId;
        let invites = req.body.invites;

        if( invites.constructor !== Array ){

            return res.status(400).json({

                success: false,
                message: `Expected body to be an array, ${typeof invites} provided.`
            });
        }
        
        try {
            let result = await crowdfundingService.addInvitees( crowdfundingId, invites );

            return res.status(200).json({
                success: true,
                message: "invites have been add successfully. An email has been sent to notify the recepient.",
                data: result
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
     * removes an invite from the list of invites for an event
     * Todo - only the creator or admins of an event should be able to do this
     */
    removeInvites: async ( req, res) => {

        let crowdfundingId = req.params.crowdfundingId;
        let invite = req.body.email;
        
        try {
            let result = await crowdfundingService.removeInvitees(crowdfundingId, invite);

            return res.status(200).json({
                success: true,
                message: "Invite has been removed successfully.",
                data: result
            });
            
        } catch ( err ) {

            return res.status(400).json({

                success: false,
                message: "Error occured while performing this operation.",
                data: err.toString()
            });
        }

    },


    inviteLink: async( req, res) => {

        try {
            let link = await crowdfundingService.generateInviteLink();
            return res.status(200).json({

                success: true,
                message: "Operation successful",
                data: link
            });
            
        } catch ( err ) {
            
            return res.status(200).json({

                success: false,
                message: "There was an error performing this operation.",
                data: err.toString()
            });
        }
    }
}