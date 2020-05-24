
//models
const Request = require('@models/request.model');

//service
const { followUser }  = require('@services/user.service');

//notifs
const { notify } = require('@request-notif/follow-request.notif');

//request module constants 
const type = "follow-request";

module.exports = {

    createFollowRequest: async ( requesteeId, accepteeId ) => {

        const followRequest = {

            requesteeId,
            accepteeId,
            type
        };

        const request = new Request( followRequest );
        const newRequest =  await request.save();

        notify( newRequest._id );

        return newRequest;
    },


    viewFollowRequest: async ( requesteeId, accepteeId ) => {

        const request = {

            requesteeId,
            accepteeId,
            type
        };

        return await Request.findOne( request );
    },


    /**
     * accept a follow request
     * this simply invovles adding the requestee to the list of the acceptee's follower's array
     * 
     * @param requestId
     */
    acceptRequest: async ( request ) => {

        await followUser(request.requesteeId._id, request.accepteeId._id)
    },


    /**
     * denies the request
     * this simply invovles adding the requestee to the list of the acceptee's follower's array
     * 
     * @param requestId
     */
    denyRequest: ( request ) => {

        //do nothing
       
    }
}