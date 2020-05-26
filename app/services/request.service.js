const Request = require('@models/request.model');

const followRequestModule = require('@user-request/follow.request');
const eventInviteRequestModule = require('@user-request/event-invite.request');
const extraInviteRequestModule = require('@user-request/extra-invite.request');
const eventCoordinatorRequestModule = require('@user-request/event-coordinator.request');


/**
 * maps the different request types to their handlers
 * 
 * Todo - find a way to lazy-load these modules
 */
const requestTypeModules = {

    "follow-request" : followRequestModule,
    "event-invite-request": eventInviteRequestModule,
    "extra-invite-request": extraInviteRequestModule,
    "event-coordinator-request": eventCoordinatorRequestModule
}



module.exports = {

    viewRequestById: async( requestId ) => {

        return await Request.findById( requestId )
        .populate("requesteeId", "_id avatar authMethod local.firstName local.lastName fullName")
        .populate("accepteeId", "_id avatar authMethod local.firstName local.lastName fullName");
    },



    viewRequest: async ( requesteeId, accepteeId, type ) => {

        const request = {

            requesteeId,
            accepteeId
        };

        if( type ) request["type"] = type;

        return await Request.findOne( request );
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

        const callback = requestTypeModules[ requestType ].acceptRequest;

        return await module.exports.processAcceptRequest( request, callback )
    },


    /**
     * deny a request
     * @param requestId
     * 
     */
    denyRequest: async( requestId ) => {

        const request = await module.exports.viewRequestById(  requestId );
        let requestType = request.type;

        const callback = requestTypeModules[ requestType ].denyRequest;
        return await module.exports.processDenyRequest( request, callback )
    },


    /**
     * process accept request
     * 
     * @param request object
     * @param callback function
     * 
     * Todo delete request after successful operation
     */
    processAcceptRequest: async( request, callback ) => {

        await callback( request );
        return await Request.findByIdAndUpdate( request._id, { accepted: true }, { runValidators: true , new: true });
    },


    /**
     * process deny request
     * 
     * @param request object
     * @param callback function
     * 
     * Todo delete request after successful operation
     */
    processDenyRequest: async( request, callback ) => {

        await callback( request );
        return await Request.findByIdAndUpdate( request._id, { accepted: false }, { runValidators: true , new: true });
    }

}



