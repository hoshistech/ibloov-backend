const FollowRequest = require('@models/followrequest.model');

const followRequestType = "follow-request";
const extraInviteRequestType = "extra-invite-request";

module.exports = {

    viewRequestById: async( requestId ) => {

        return await FollowRequest.findById( requestId )
        .populate("requesteeId", "_id authMethod local.firstName local.lastName")
        .populate("accepteeId", "_id authMethod local.firstName local.lastName");
    },


    /**
     * Base method for creating a request 
     * NB: Not to be used directly in a controller.
     * 
     * @param requesteeId String
     * @param accepteeId String
     * @param type String
     */
    createRequest: async ( requesteeId, accepteeId, type ) => {

        const followRequest = {

            requesteeId,
            accepteeId,
            type
        };

        let request = new FollowRequest( followRequest );
        return await request.save();
    },


    /**
     * Base method for retreiving reqeust info
     * NB: Not to be used directly in a controller.
     * 
     * @param requesteeId String
     * @param accepteeId String
     * @param type String
     * 
     */
    viewRequest: async( requesteeId, accepteeId, type ) => {

        const followRequest = {

            requesteeId,
            accepteeId,
            type,
            status: null
        };

        return await FollowRequest.findOne( followRequest );  
    },


    /**
     * Create a new user-follow request.
     * 
     * @param requesteeId String
     * @param accepteeId String
     */
    createFollowRequest: async ( requesteeId, accepteeId ) => {

        return await module.exports.createRequest(requesteeId, accepteeId, followRequestType );
    },


    /**
     * view a new user-follow request type.
     * 
     * @param requesteeId String
     * @param accepteeId String
     */
    viewFollowRequest: async ( requesteeId, accepteeId ) => {

        return await module.exports.viewRequest(requesteeId, accepteeId, followRequestType );
    },


    /**
     * Request to bring along somone not on the original invite list.
     * 
     * @param requesteeId String
     * @param accepteeId String
     */
    createExtraInviteRequest: async ( requesteeId, accepteeId ) => {

        return await module.exports.createRequest(requesteeId, accepteeId, extraInviteRequestType );
    },


    viewExtraInviteRequest: async ( requesteeId, accepteeId ) => {

        return await module.exports.viewRequest(requesteeId, accepteeId, extraInviteRequestType );
    },

    
     
}
