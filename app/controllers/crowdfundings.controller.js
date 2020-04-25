const crowdFundingService = require('@services/crowdfunding.service');
const uuidv4 = require('uuid/v4');


module.exports = {


    /**
     * get crowdFundings
     * @authLevel - authenticated | isAdmin 
     */
    index: async (req, res) => {

        try{
            let crowdFundings = await crowdFundingService.all();
            res.status(200).send({
                success: true,
                message: "crowdFundings retreived succesfully",
                data: crowdFundings
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
            let resp = await crowdFundingService.createCrowdFunding(crowdFunding);
            res.status(201).send({
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

        let crowdFundingId = req.params.crowdFundingId;
        let crowdFundingData = req.body.data;

        try {
            
            let resp = await crowdFundingService.updateCrowdFunding(crowdFundingId, crowdFundingData);
            //crowdFundingService.addCrowdFundingHistory(crowdFundingId, "CROWDFUNDING_UPDATE")
            
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

        let crowdFundingId = req.params.crowdFundingId;

        try {
            let crowdFunding = await crowdFundingService.viewCrowdFunding(crowdFundingId);
            let totalDonations = crowdFunding.totalDonated;
            
            let data = crowdFunding.toJSON();
            data.totalDonations = totalDonations;

            return res.status(200).json({
                success: true,
                message: "CrowdFunding retreived successfully.",
                data
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

        let crowdFundingId = req.params.crowdFundingId;
        let userId = req.authuser._id;

        try {
            
            let resp = await crowdFundingService.softDeleteCrowdFunding(crowdFundingId, userId);
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

        let crowdFundingId = req.params.crowdFundingId;
        let pledge = parseFloat( req.body.pledge );
        let userId = req.authuser._id;

        try {

            let resp = await crowdFundingService.pledge(crowdFundingId, pledge, userId);

            return res.status(200).json({
                success: true,
                message: "Pledge has been added successfully.",
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
     * removes a single pledge object from a single crowdFunding instance.
     * @authLevel - authenticated
     */
    unpledge: async (req, res) => { 

        let crowdFundingId = req.params.crowdFundingId;
        let userId = req.authuser._id;

        if( ! crowdFundingId ){
            return res.status(400).json({
                success: false,
                message: "required crowdFunding id missing."
            });
        }

        try {
            
            let resp = await crowdFundingService.unPledge(crowdFundingId, userId);
            return res.status(200).json({
                success: true,
                message: "Pledge has been added successfully.",
                data: resp
            });

        } catch ( err ) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to update this crowdFunding.",
                data: err.toString()
            });
        }
    }
}