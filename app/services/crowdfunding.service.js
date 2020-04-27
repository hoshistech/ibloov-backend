const CrowdFunding = require('@models/crowdFunding.model');

module.exports = {

    "model": CrowdFunding,

    /**
     * returns all crowdFunds
     * @param query object 
     * @param options object
     */
    all: async ( query , options ) => {

        let sort = {};
        const {limit, skip, sortBy, orderBy } = options;
        sort[ sortBy ] = orderBy;
        
        let crowdFunding = await CrowdFunding.find(query)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .populate('userId', '_id avatar local.firstName local.lastName')
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

        return await CrowdFunding.findById(crowdFundingId)
        .populate('userId', '_id avatar local.firstName local.lastName');
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
    softDeleteCrowdFunding: async (crowdFundingId, userId) => {

        const updateData = { deletedAt: Date.now(), deletedBy: userId };
        return await module.exports.updateCrowdFunding(crowdFundingId, updateData); 
    },


    /**
     * allows a user to pledge a certain amount to a crowdfuning campaign
     * if user has pleadged before, it updates the pledge, else, it adds the pledge to the set.
     * @param crowdFundingId integer - id of the crowdFunding model to be updated.
     * @param amount Number - amount to be pledged.
     * 
     */
    pledge: async (crowdFundingId, amount, userId) => {

        const crowdFunding = await CrowdFunding.findOne( { _id: crowdFundingId, "donors.userId": userId });

        if( ! crowdFunding ){

            const donor = { 
            
                pledge: amount,
                userId
            }

            return await CrowdFunding.findByIdAndUpdate( crowdFundingId , 
                //{ '$addToSet': { 'donors': donor }, $inc: { totalDonations: amount } }, 
                { '$addToSet': { 'donors': donor } }, 
                { runValidators: true, new: true }  );
        } 
        else {

            return await CrowdFunding
            .findOneAndUpdate( { _id: crowdFundingId, "donors.userId": userId } , 
            { $set : { 'donors.$.pledge' : amount } }, 
            //{ $set : { 'donors.$.pledge' : amount },  $inc: { totalDonations: amount } }, 
            { runValidators: true, new: true } );
        }
    },

    /**
     * allows a user to renege on a pledge.
     * @param crowdFundingId integer - the unique id of the crowdfuding model
     * @param userId integer - the unique ID of the user
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
    },

    /**
     * removes all documents in this colletion
     * This service cannot be exposed to a controller 
     * and should only be used during tests and on the test Db
     * 
     */
    removeAll: async () => {

        let env = process.env.NODE_ENV;

        if( env === 'test'){
            return await CrowdFunding.deleteMany({}) 
        }
    },
}