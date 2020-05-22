const Request = require('@models/request.model');

//notif
const { notify } = require('@services/notification/request/follow-request.notif');

const type = "follow-request";

module.exports = {

    createRequest: async ( requesteeId, accepteeId ) => {

        const followRequest = {

            requesteeId,
            accepteeId,
            type
        };

        let request = new Request( followRequest );

        let newReuest =  await request.save();

        notify( request._id );

        return newReuest;

    },


    acceptRequest: async ( callback ) => {

        callback();
    },

    denyRequest: ( callback ) => {

        callback()
    }
}