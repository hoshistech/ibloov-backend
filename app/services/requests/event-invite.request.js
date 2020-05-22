const Request = require('@models/request.model');

const type = "event-invite-request";

module.exports = {

    createRequest: ( requesteeId, accepteeId, eventId ) => {

        if(! eventId) throw new Error("eventId not provided");

        const request = {

            requesteeId,
            accepteeId,
            type,
            eventId
        };

        let newRequest = new Request( request );
        return await newRequest.save();
    },

    acceptRequest: () => {

    },

    denyRequest: () => {
        
    }
}