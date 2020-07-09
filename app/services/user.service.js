const User = require('@models/user.model');
const moment = require("moment");
const jwt = require("jsonwebtoken");

//services
const eventService = require('@services/event.service'); 

const { viewRequest } = require("@services/request.service")

//helpers
const { randomInt } = require("@helpers/number.helper");
const { setDefaultOptions  } = require('@helpers/request.helper');

module.exports = {

    "model": User,

    /**
     * returns all users given certain parameters
     * @param query object 
     * @param options object
     */
    all: async ( query, options) =>{

        let sort = {};
        options = options || setDefaultOptions();
        
        const { limit, skip, sortBy, orderBy } = options;
        sort[ sortBy ] = orderBy;

        let users = await User.find(query)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .populate('followers.userId', '_id authMethod avatar bio local.firstName local.lastName google facebook email fullName phoneNumber');


        return users;
    },

    /**
     * creates a new user
     * @param userData object
     */
    createUser: async ( user  ) =>{
        
        return await User.create( user );
    },

    /**
     * returns a single instance of a user
     * @param userId String
     */
    viewUser: async ( userId ) => {

        let user = await User.findById(userId)
        .populate('followers.userId', '_id authMethod avatar bio local.firstName local.lastName google facebook email fullName phoneNumber');
        return user;
    },

    /**
     * returns a single instance of a user using a query instead of _id
     * @param userId String
     */
    getUser: async ( query ) => {

        let user = await User.findOne(query)
        .select("-phoneNumber") /** Todo - remove this  */
        return user;
    },


     /**
     * update a single user instance
     * @param userId integer
     * @param updateData object
     */
    updateUser: async ( userId, updateData ) => {

        return  await User.findByIdAndUpdate( userId, updateData, { new: true  }); 
    },


    /**
     * performs a softDelete operation on a single instance of a user model
     * @param userId integer
     * @param deletedBy String 
     *
     */
    softDeleteUser: async (userId, deletedBy) => {

        const updateData = { deletedAt: Date.now(), deletedBy };
        return await User.findByIdAndUpdate(userId, updateData);  
    },

    
    /**
     * Gets all the events that are a user is following
     * 
     * @param userId string
     * 
     */
    getFollowingEvents: async (userId) => {

        query = {
            "followers.userId": userId
        };

        options = {
            sort: -1
        }
        let events = await eventService.all(query, options);
        return events ? true : false;
    },


    /**
     * creates phonenumber verification code 
     * used majorly during signup
     * 
     * @param userId
     */
    setVerfificationCode: async ( userId ) => {

        const code = randomInt( 1222, 9999 );
        let smsExpirationTime = process.env.SMS_VERIFICATION_CODE_DURATION;

        let verificationCode = {
            code,
            expiryDate: moment().add( smsExpirationTime, 'm' )
        }

        let setData = { 'local.verificationCodes' : verificationCode };

        try{
            await User.findOneAndUpdate( { _id: userId }, { '$addToSet': setData }, { runValidators: true , new: true} );

            return code;

        } catch( err ) {

            throw new Error( err );
        }
        

        
    },
    

    /**
     * confirms that the verification inputed by the user during phonenumber verification is valid
     */
    verifySmsCode: async ( userId, code ) => {


        let resp =  await User.findOne( {
            _id: userId, 
            "local.verificationCodes": { $elemMatch: { code} }
        }, {
            _id: 0,
            'local.verificationCodes.$': 1
        })
        
        return resp;
    },


    /**
     * Block a follower
     * 
     * @param userId the blockee
     * @param 
     */
    block: async( userId, blockedUserId ) => {

        let blocked = { userId: blockedUserId };
        return await User.findByIdAndUpdate( userId , { '$addToSet': { blocked } }, { runValidators: true , new: true} ); 
    },


    /**
     * unblock a user
     * 
     * @param userId
     * @param blockedUserId - the user to be unblocked
     */
    unblock: async( userId, blockedUserId) => {

        return await User.findByIdAndUpdate( userId, { $pull: { 'blocked':  { "userId": blockedUserId }  } }, 
        { new: true } );
    },

    /**
     * unfollow a user
     * 
     * how connections is currenlty implemented is explained below 
     * if userA requests to follow userB - and user B accepts
     * userA is added to the followers array of userB
     * 
     * so to unfollow userB, we have to go to userA's follower array to remove userB's _id
     * 
     */
    unfollowUser: async( userId, followingId ) => {

        return await User.findByIdAndUpdate( followingId, { $pull: { 'followers':  { userId }  } }, 
        { new: true} );
    },



    /**
     * Retreive the user info using the req auth token.
     * 
     * @param token
     */
    getUserFromToken: async ( token ) => {

        return jwt.verify( token, process.env.JWT_SECRET_KEY, ( err, data ) => {

            if( err ) throw new Error(err);

            return data;
        });
    },


    /**
     * Get the users a user is following
     * @param userId String
     * 
     */
    getUserFollowing: async ( userId ) => {

        return await User.find( { "followers.userId": userId } )
        .select("_id authMethod bio local.firstName local.lastName google facebook email avatar fullName phoneNumber");
    },


    /**
     * follow a user 
     * 
     * @param requesteeId
     * @param accepteeId
     */
    followUser: async( requesteeId, accepteeId ) => {

        let follower = { "userId": requesteeId }; 

        let setData = { "followers": follower };
        
        return await User.findByIdAndUpdate( accepteeId , { '$addToSet': setData }, { runValidators: true , new: true} );
    },



    /**
     * checks if a user is in "followers" array of another user
     * @param userId
     * @param isFollowingUserId
     * 
     * @return boolean 
     */
    isFollowingUser: async( userId, isFollowingUserId ) => {

        let resp =  await User.findOne( {
            _id: isFollowingUserId,  
            "followers": { $elemMatch: { userId } } 
        }, {
            _id: 0,
            'followers.$': 1
        })
        .lean();

        if( resp && resp["followers"].length > 0 ){
            return true;
        } 

        return false;
    },


    /**
     * checks the following status, system-wide between 2 users
     * @param userId
     * @param isFollowingUserId
     * 
     * @return String either of "true", "false" or "pending" 
     */
    isFollowingStatus: async( userId, isFollowingUserId ) => {

        //console.log( "userservice called for ", isFollowingUserId.toString() )

        const resp = await module.exports.isFollowingUser( userId, isFollowingUserId );

        if( resp ){

            return "true";

        } else {

            /**
             * Todo decide if it is better to get pending requests only here
             */
            let hasFollowRequest = await viewRequest( userId, isFollowingUserId, "follow-request" );

            if( hasFollowRequest ){

                let status = hasFollowRequest.accepted;

                if( status == null ) return "pending";

                /**
                 * Todo remove this status
                 * if a request is denied, remove it after executing its callback successfully
                 */
                if( status == false ) return "denied";

                if( status == true ) return "true";

            }

            return "false";
        }
        
    },


    /**
     * get platform contacts
     * @param userId
     * 
     * @return String either of "true", "false" or "pending" 
     */
    getPlatformContacts: async( userId ) => {

        const platformContacts = {};
        const user = await module.exports.viewUser( userId );
       
        let followers = user.followers;
        const following = await module.exports.getUserFollowing( userId );

        followers = followers.reduce( (acc, follower) => {

            acc.push(follower.userId);

            return acc;

        }, [])

        platformContacts["followers"] = followers;
        platformContacts["following"] = following;

        let all = [ ...followers, ...following ]; 
        
        const arrayUniqueByKey = [ ...new Map( all.map( item => [item["_id"].toString(), item ] ) ).values() ];

        platformContacts["all"] = arrayUniqueByKey;
        
        return platformContacts;
    }
}