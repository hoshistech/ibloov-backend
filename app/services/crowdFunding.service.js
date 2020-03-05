const CrowdFunding = require('@models/crowdFunding.model');

module.exports = {

    /**
     * returns all crowdFunds
     * @param query object 
     * @param options object
     */
    all: async ( query = {}, options = {} ) => {

        //const {limit, sort} =  options;
        query["deletedAt"] = null;
        query["dueDate"] = { "$gte": new Date };

        console.log(query);

        let crowdFunding = await CrowdFunding.find(query);
        return crowdFunding;
    },

    /**
     * creates a single crowdFunding instance
     * @param crowdFundingData object
     * 
     */
    createCrowdFunding: async (crowdFundingData) => {

        let crowdFunding = new CrowdFunding(crowdFundingData);
        return await crowdFunding.save(); 
    },


    /**
     * returns a single instance of a crowdFund
     * @param crowdFundingId String
     */
    viewCrowdFunding: async (crowdFundingId) => {

        let query = {};
        query["_id"] = crowdFundingId;
        query["deletedAt"] = null;

        let crowdFunding = await CrowdFunding.findOne(query);
        return crowdFunding;
    },


    /**
     * update a single crowdFunding instance
     * @param crowdFundingId integer
     * @param updateData object
     * 
     */
    updateCrowdFunding: async (crowdFundingId, updateData) => {

        return await CrowdFunding.findByIdAndUpdate( crowdFundingId, updateData, {new: true});
    },


    /**
     * performs a softDelete operation on a single instance of a  model
     * @param crowdFundingId integer
     *
     */
    softDeleteCrowdFunding: async (crowdFundingId) => {

        console.log(crowdFundingId);
        const updateData = { deletedAt: Date.now(), deletedBy: '1edfhuio3ifj' };
        return await module.exports.updateCrowdFunding(crowdFundingId, updateData); 
    },


    /**
     * allows a user to pledge a certain amount to a crowdfuning campaign
     * if user has pleadged before, it updates the pledge, else, it adds the pledge to the set.
     * @param crowdFundingId integer - id of the crowdFunding model to be updated.
     * @param amount Number - amount to be pledged.
     * 
     */
    pledge: async (crowdFundingId, amount) => {

        const userId = "userId";
        const crowdFunding = await CrowdFunding.findOne( { _id: crowdFundingId, "donors.userId": userId });

        if( ! crowdFunding ){

            const donor = { 
                name: "name",
                email: "email",
                pledge: amount,
                userId
            }

            return await CrowdFunding.findByIdAndUpdate( crowdFundingId , { '$addToSet': { 'donors': donor } });
        } 
        else {

            return await CrowdFunding
            .findOneAndUpdate( { _id: crowdFundingId, "donors.userId": userId } , 
            { $set : { 'donors.$.pledge' : amount }}, 
            { runValidators: true } );
        }
    },

    /**
     * allows a user to renege on a pledge.
     * @param crowdFundingId integer
     * @param userId integer
     */
    unPledge: async(crowdFundingId, userId) => {
        
        let update = await CrowdFunding.findByIdAndUpdate( crowdFundingId, { $pull: { 'donors':  { "userId": userId }  } }, 
        { new: true} );
        return update
    },


    /**
     * allows a user to update their pledge for a crowdfunding campaign
     * @usercase - user mistakenly pledges $1000 insead of $100 - this methos allows the user to update the pledge.
     * @param crowdFundingId integer
     * @param userId integer
     * @param newPledge number - The updated pledge by the donor
     */
    updatePledge: async(crowdFundingId, userId, newPledge) => {

        return await CrowdFunding
        .findOneAndUpdate( { _id: crowdFundingId, "donors.userId": userId }, 
        { $set : { 'donors.$.pledge' : newPledge }}, 
        { runValidators: true } );

    }
}