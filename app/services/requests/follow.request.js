
//models
const Request = require('@models/request.model');
const User = require('@models/user.model');

//notifs
const { notify } = require('@request-notif/follow-request.notif');
const { followAcceptNotification } = require('@info-notif/follow-accept.notif');

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

        notify( newRequest );

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

        let follower = { "userId": request.requesteeId._id }; 

        let setData = { "followers": follower };
        
        const resp =  await User.findByIdAndUpdate( request.accepteeId._id , { '$addToSet': setData }, { runValidators: true , new: true} );

        followAcceptNotification(request.requesteeId._id, request.accepteeId._id);

        return resp;
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