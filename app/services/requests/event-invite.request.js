//models
const Request = require('@models/request.model');

//services
const { approveEventInviteRequest, denyEventInviteRequest } = require("@services/event.service")

//notifs
const { notify, notifyBulk } =  require('@request-notif/event-invite-request.notif');
const { eventAttendanceConfirmationNotification } = require('@info-notif/event-attendance-confirmation.notif');

//module constants
const type = "event-invite-request";

module.exports = {

    /**
     * create single event-invite request
     * @param requesteeId
     * @param accepteeId
     * @param eventId
     * 
     */
    createEventInviteRequest: async ( requesteeId, accepteeId, eventId ) => {

        if(! eventId) throw new Error("eventId not provided");

        const request = {

            requesteeId,
            accepteeId,
            type,
            eventId
        };

        const newRequest = new Request( request );
    
        const resp = await newRequest.save();
        
        notify( resp );
        return resp;
    },

    /**
     * sends a request to all the people invited to an event.
     * 
     * @param event Object
     */
    createEventInviteBulkRequest: async ( event ) => {

        let requests = [];

        const requesteeId = event.userId;
        const acceptees = event.invitees;
        const eventId = event._id;

        acceptees.map( acceptee => {

            if( acceptee.userId ){

                let followRequest = {

                    requesteeId,
                    accepteeId: acceptee.userId,
                    type,
                    eventId
                }

                requests.push( followRequest);
            }
        })

        if( requests.length > 0 ){

            const docs = await Request.insertMany(requests);
            notifyBulk( docs );
        }

        return [];
    },


    /**
     * function to be executed when this request is approved
     * 
     * @param requestId
     */
    acceptRequest: async ( request ) => {
        
        await approveEventInviteRequest( request.eventId, request.accepteeId._id );
        eventAttendanceConfirmationNotification( request.accepteeId._id, request.requesteeId._id, request.eventId )
    },

    /**
     * function to be executed when this request is denied
     * 
     * @param requestId
     */
    denyRequest: async ( request ) => {
        
        await denyEventInviteRequest( request.eventId, request.accepteeId._id );

    }
}