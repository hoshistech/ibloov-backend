const Request = require('@models/request.model');

const followRequestType = "follow-request";
const extraInviteRequestType = "extra-invite-request";
const eventInviteRequestType = "event-invite-request";
const eventCoordinatorRequestType = "event-coordinator-request";

const { approveFollowRequestCallback, 
        approveEventInviteRequestCallback, 
        denyEventInviteRequestCallback } = require("@services/requestcallbacks.service"); 

const requestTypeApproveCallbacks = {

    "follow-request" : approveFollowRequestCallback,
    "event-invite-request": approveEventInviteRequestCallback
}

const requestTypeDenyCallbacks = {

    "event-invite-request": denyEventInviteRequestCallback
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

        const newRequest = {

            requesteeId,
            accepteeId,
            type
        };

        let request = new Request( newRequest );
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


    /********************* USER FOLLOW REQUEST *****************************/


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


     /********************* EXTRA INVITE REQUEST *****************************/


    /**
     * Request to bring along somone not on the original invite list.
     * 
     * @param requesteeId String
     * @param accepteeId String
     */
    createExtraInviteRequest: async ( requesteeId, accepteeId, eventId ) => {

        const followRequest = {

            requesteeId,
            accepteeId,
            type: extraInviteRequestType,
            eventId
        };

        let request = new Request( followRequest );
        return await request.save();
    },


    viewExtraInviteRequest: async ( requesteeId, accepteeId ) => {

        return await module.exports.viewRequest(requesteeId, accepteeId, extraInviteRequestType );
    },


    /********************* EVENT INVITE *****************************/

    createEventInviteRequest: async ( requesteeId, accepteeId, eventId ) => {

        const followRequest = {

            requesteeId,
            accepteeId,
            type: eventInviteRequestType,
            eventId
        };

        let request = new Request( followRequest );
        return await request.save();
    },


    createEventCoordinatorRequest: async ( requesteeId, accepteeId, eventId ) => {

        const followRequest = {

            requesteeId,
            accepteeId,
            type: eventCoordinatorRequestType,
            eventId
        };

        let request = new Request( followRequest );
        return await request.save();
    },


    /**
     * create bulk requests for the invitees when an event is created.
     * @param {*} event 
     */
    createEventInviteRequestBulk: async function( event ){

        let requests = [];

        const requesteeId = event.userId;
        const acceptees = event.invitees;
        const eventId = event._id;

        acceptees.map( acceptee => {

            if( acceptee.userId ){

                let followRequest = {

                    requesteeId,
                    accepteeId: acceptee.userId,
                    type: eventInviteRequestType,
                    eventId
                }

                requests.push( followRequest);
            }

        })


        if( requests.length > 0 ){
            const docs = await Request.insertMany(requests);
            return docs
        }

        return [];
    },


    viewEventInviteRequest: async ( requesteeId, accepteeId ) => {

        return await module.exports.viewRequest(requesteeId, accepteeId, eventInviteRequestType );
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

        console.log( "requestTypeApproveCallbacks[ requestType ]" )
        console.log( requestTypeApproveCallbacks[ requestType ] )

        const callback = requestTypeApproveCallbacks[ requestType ] || module.exports.doNothingHandler;
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
  
}



