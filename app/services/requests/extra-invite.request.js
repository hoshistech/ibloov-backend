const Request = require('@models/request.model');

const type = "extra-invite-request";

module.exports = {

    createRequest: async ( requesteeId, accepteeId, eventId ) => {

        if(! eventId) throw new Error("eventId not provided");

        const followRequest = {
            requesteeId,
            accepteeId,
            type,
            eventId
        };

        let request = new Request( followRequest );
        return await request.save();
    },

    acceptRequest: () => {

    },

    denyRequest: () => {
        
    }
}