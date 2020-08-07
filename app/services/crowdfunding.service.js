const CrowdFunding = require('@models/crowdFunding.model');


//helpers
const { setDefaultOptions  } = require('@helpers/request.helper');
const { randomInt } = require("@helpers/number.helper");

module.exports = {

    "model": CrowdFunding,


    allCount: async ( query ) => {
        
        return CrowdFunding.find(query).countDocuments();
    },

    /**
     * returns all crowdFunds
     * @param query object 
     * @param options object
     */
    all: async ( query , options ) => {

        let sort = {};
        options = options || setDefaultOptions();
        
        const {limit, skip, sortBy, orderBy } = options;
        sort[ sortBy ] = orderBy;
        
        let crowdFunding = await CrowdFunding.find(query)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .populate('userId', '_id avatar authMethod local.firstName local.lastName google facebook fullName')
        .populate('donors.userId', '_id avatar authMethod local.firstName local.lastName google facebook fullName')
        .lean({ virtuals: true });

        return crowdFunding;
    },

    /**
     * creates a single crowdFunding instance
     * @param crowdFundingData object
     * 
     */
    createCrowdFunding: async (crowdFundingData) => {

        let crowdFunding = new CrowdFunding(crowdFundingData);
        return await crowdFunding.save()
        //.populate("userId", "_id avatar authMethod local.firstName local.lastName google facebook fullName");
    },
 

    /**
     * returns a single instance of a crowdFund
     * @param crowdfundingId String
     */
    viewCrowdFunding: async (crowdfundingId) => {

        return await CrowdFunding.findById(crowdfundingId)
        .populate('userId', '_id avatar authMethod local.firstName local.lastName google facebook fullName')
        .populate('donors.userId', '_id avatar authMethod local.firstName local.lastName google facebook fullName')
        .lean({ virtuals: true });
    },


    /**
     * update a single crowdFunding instance
     * @param crowdfundingId integer
     * @param updateData object
     * 
     */
    updateCrowdFunding: async (crowdfundingId, updateData) => {

        return await CrowdFunding.findByIdAndUpdate( crowdfundingId, updateData, {new: true});
    },


    /**
     * performs a softDelete operation on a single instance of a  model
     * @param crowdfundingId integer
     *
     */
    softDeleteCrowdFunding: async (crowdfundingId, userId) => {

        const updateData = { deletedAt: Date.now(), deletedBy: userId };
        return await module.exports.updateCrowdFunding(crowdfundingId, updateData); 
    },


    /**
     * allows a user to pledge a certain amount to a crowdfuning campaign 
     * if user has pledged before, it updates the pledge, else, it adds the pledge to the set.
     * @param crowdfundingId integer - id of the crowdFunding model to be updated.
     * @param amount Number - amount to be pledged.
     * 
     */
    pledge: async (crowdfundingId, amount, userId) => {

        const crowdfudingExists = await CrowdFunding.findOne( { _id: crowdfundingId, "donors.userId": userId });

        /**
         * Todo - check that there is a record of the payment log here, preferrably using the paymentid
         */

        const transaction = { 
            
            pledge: amount,
            userId,
            transactionId: `CF-${randomInt(111111111, 999999999)}`
        }

        if( ! crowdfudingExists ){

            const donor = { 
            
                pledge: amount,
                userId,
                updatedAt: Date.now()
            }

            return await CrowdFunding.findByIdAndUpdate( crowdfundingId , 
                { $addToSet : { 'transactions' : transaction,  'donors': donor  } },
                { runValidators: true, new: true }  );
        } 
        else {

            let res =  await CrowdFunding.findOneAndUpdate( { _id: crowdfundingId, "donors.userId": userId }, 
            { 
                $addToSet : { 'transactions' : transaction }, 
                $inc: { 'donors.$.pledge': amount  }, 
                $set: { "donors.$.updatedAt": Date.now() }  
            }, 
            { runValidators: true, new: true } );

            return res;
        }
    },

    /**
     * allows a user to renege on a pledge.
     * @param crowdfundingId integer - the unique id of the crowdfuding model
     * @param userId integer - the unique ID of the user
     * 
     * Note: This should not be allowed, because pledges are saved after payment.
     * Todo - look into a refund settlement module.
     */
    unPledge: async( crowdfundingId, pledgeId ) => {
        
        // let update = await CrowdFunding.findByIdAndUpdate( crowdfundingId, { $pull: { 'donors':  { "_id": pledgeId }  } }, 
        // { new: true} );
        // return update
    },


    /**
     * allows a user to update their pledge for a crowdfunding campaign
     * @usercase - user mistakenly pledges $1000 insead of $100 - this methos allows the user to update the pledge.
     * @param crowdfundingId integer
     * @param userId integer
     * @param newPledge number - The updated pledge by the donor
     */
    updatePledge: async(crowdfundingId, userId, newPledge) => {

        return await CrowdFunding
        .findOneAndUpdate( { _id: crowdfundingId, "donors.userId": userId }, 
        { $set : { 'donors.$.pledge' : newPledge }}, 
        { runValidators: true } );
    },


    /**
     * add new invitees to an crowdfund
     * @param crowdfundingId String
     * @param invitees array
     */
    addInvitees: async( crowdfundingId, invites = [] ) => {

        return await CrowdFunding.findOneAndUpdate(
            { "_id" : crowdfundingId },
            { 
                "$addToSet": { 
                    invitees : { 
                        "$each": invites
                    } 
                } 
            }, 
            { runValidators: true, new: true }
        );
    },


    /**
     * Remove an invitee from an crowdfund.
     * @param crowdfundingId string
     * @param userId string - this could later be the user's email, yet to decide
     */
    removeInvitees: async( crowdfundingId, email ) => {

        let update = await CrowdFunding.findByIdAndUpdate( crowdfundingId, { $pull: { 'invitees':  { "email": email }  } }, 
        { new: true} );
        return update;
    },

    /**
     * check if a user is following an crowdfund
     * 
     * @param crowdfundingId string
     * @param userId string
     * 
     * @return boolean
     */
    isInvited: async (crowdfundingId, userId) => {

        let crowdfund = await CrowdFunding.findOne({ _id: crowdfundingId, 'invitees.userId': userId });
        return crowdfund ? true : false;
    },


    generateInviteLink: async() => {

        const baseUrl = process.env.FRONTEND_BASE_URL;
        randomString = (+new Date).toString(36).slice();
        let link = `${baseUrl}/wishist/${randomString}`;
        return link
    },
}