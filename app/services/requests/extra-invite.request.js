//models
const Request = require('@models/request.model');

//notifs
const { notify } =  require('@request-notif/extra-invite-request.notif');

//request type constants
const type = "extra-invite-request";

module.exports = {


    /**
     * Creates a single extra-invite-request type request
     * @param requesteeId
     * @param accepteeId
     * @param eventId
     */
    createExtraInviteRequest: async ( requesteeId, accepteeId, eventId ) => {

        if(! eventId) throw new Error("eventId not provided");

        //if(! inviteId) throw new Error("inviteId not provided");

        const followRequest = {
            requesteeId,
            accepteeId,
            type,
            eventId
        };

        const request = new Request( followRequest );

        const resp =  await request.save();

        notify( resp );

        return resp;
    },


    /**
     * view a single instance of extra-invite-request type request
     * 
     * @param requesteeId
     * @param accepteeId
     */
    viewExtraInviteRequest: async ( requesteeId, accepteeId ) => {

        const request = {

            requesteeId,
            accepteeId,
            type
        };

        return await Request.findOne( request );
    },


    /**
     * function to be executed when this request is approved succesfully
     * 
     * @param requestId
     */
    acceptRequest: async ( request ) => {

        /**
         * @Todo add the person to the 
         */
    },


    /**
     * function to be executed when this request is approved succesfully
     * 
     * @param requestId
     */
    denyRequest: async ( request ) => {
        
    }
}