const Request = require('@models/request.model');

const followRequestType = "follow-request";
const extraInviteRequestType = "extra-invite-request";

const { approveFollowRequest } = require("@services/user.service");

const requestTypeCallbacks = {

    "follow-request" : approveFollowRequest
}

module.exports = {

    viewRequestById: async( requestId ) => {

        return await Request.findById( requestId )
        .populate("requesteeId", "_id avatar authMethod local.firstName local.lastName fullName")
        .populate("accepteeId", "_id avatar authMethod local.firstName local.lastName fullName");
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

        let request = new Request( followRequest );
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

        return await Request.findOne( followRequest );  
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


    /**
     * accept a request
     * @param requestId
     */
    acceptRequest: async( requestId ) => {

        const request = await module.exports.viewRequestById(  requestId );
        let requestType = request.type;

        const callback = requestTypeCallbacks[ requestType ] || module.exports.doNothingHandler;
        return await module.exports.processAcceptRequest( requestId, approveFollowRequest)
    },


    /**
     * deny a request
     * @param requestId
     */
    denyRequest: async( requestId ) => {

        const result = await Request.findByIdAndUpdate( requestId, { accepted: false }, { runValidators: true , new: true });
        return result;
    },


    /**
     * process accept request
     * 
     * @param requestId function
     * @param callback function
     */
    processAcceptRequest: async( requestId, callback ) => {

        await callback( requestId );
        const result = await Request.findByIdAndUpdate( requestId, { accepted: true }, { runValidators: true , new: true });
        return result;
    },


    /**
     * Defualt handler for unspecified request callbacks
     * 
     */
    doNothingHandler: () => {

        //do nothing
        console.log("I did nothing!")
    },


    /**
     * get the list of follow request for a user
     * 
     * @param accepteeId String userId of the acceptee
     * @param type String
     */
    getUserRequestByType: async ( accepteeId, type ) => {

        return await Request.find( { accepteeId, type, accepted: null} );
    }   
}



