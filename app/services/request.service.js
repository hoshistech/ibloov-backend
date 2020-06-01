const Request = require('@models/request.model');

const followRequestModule = require('@user-request/follow.request');

const requestTypeModules = {

    "follow-request" : followRequestModule,
   // "event-invite-request": approveEventInviteRequestCallback
}



module.exports = {

    viewRequestById: async( requestId ) => {

        return await Request.findById( requestId )
        .populate("requesteeId", "_id avatar authMethod local.firstName local.lastName fullName")
        .populate("accepteeId", "_id avatar authMethod local.firstName local.lastName fullName");
    },


    /**
     * get the list of follow request for a user
     * 
     * @param accepteeId String userId of the acceptee
     * @param type String 
     */
    getUserRequests: async ( accepteeId, type ) => {

        let query = {
            accepteeId,
            accepted: null
        }

        if( type ) query["type"] = type;

        return await Request.find( query )
        .populate("requesteeId", "_id avatar authMethod local.firstName local.lastName fullName google")
        .populate("accepteeId", "_id avatar authMethod local.firstName local.lastName fullName google")
    },


    /**
     * accept a request
     * @param requestId
     */
    acceptRequest: async( requestId ) => {

        const request = await module.exports.viewRequestById(  requestId );
        let requestType = request.type;

        console.log("requestType")
        console.log(requestType);

        console.log( "requestTypeModules[ requestType ]" )
        console.log( requestTypeModules[ requestType ] )

        const callback = requestTypeModules[ requestType ].acceptRequest || module.exports.doNothingHandler;
        return await module.exports.processAcceptRequest( requestId, callback)
    },


    /**
     * deny a request
     * @param requestId
     */
    denyRequest: async( requestId ) => {

        const request = await module.exports.viewRequestById(  requestId );
        let requestType = request.type;

        const callback = requestTypeDenyCallbacks[ requestType ] || module.exports.doNothingHandler;
        return await module.exports.processDenyRequest( requestId, callback)
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



    processDenyRequest: async( requestId, callback ) => {

        await callback( requestId );
        const result = await Request.findByIdAndUpdate( requestId, { accepted: false }, { runValidators: true , new: true });
        return result;
    },


    /**
     * Defualt handler for unspecified request callbacks
     * 
     */
    doNothingHandler: () => {

        //do nothing
        console.log("I did nothing!")
        //notify admin of possible handler
        //consider throwing an error here for now
    }
}



