const FollowRequest = require('@models/followrequest.model');

module.exports = {

    createRequest: async ( requesteeId, accepteeId ) => {

        const followRequest = {

            requesteeId,
            accepteeId
        };

        let request = new FollowRequest( followRequest );
        return await request.save();
    },

    
    findRequest: async( requesteeId, accepteeId ) => {

        const followRequest = {

            requesteeId,
            accepteeId
        };

        return await FollowRequest.findOne( followRequest );  
    } 
}
