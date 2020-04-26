const User = require('@models/user.model');
const eventService = require('@services/event.service');
const moment = require("moment")
const { randomInt } = require("@helpers/number.helper");

module.exports = {

    "model": User,

    /**
     * returns all users given certain parameters
     * @param query object 
     * @param options object
     */
    all: async ( query = {}, options = {} ) =>{

        //const {limit, sort} = options;
        query["deletedAt"] = null;
        let users = await User.find(query).sort({ createdAt: -1 });
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
    viewUser: async (userId) => {

        let user = await User.findById(userId);
        return user;
    },

    getUser: async (query) => {

        let user = await User.findOne(query);
        return user;
    },


     /**
     * update a single user instance
     * @param userId integer
     * @param updateData object
     */
    updateUser: async ( userId, updateData ) => {

        return  await User.findByIdAndUpdate( userId, updateData, {new: true});
    },


    /**
     * performs a softDelete operation on a single instance of a user model
     * @param userId integer
     *
     */
    softDeleteUser: async (userId, deletedBy) => {

        const updateData = { deletedAt: Date.now(), deletedBy };
        return await User.findByIdAndUpdate(userId, updateData);  
    },

    
    /**
     * Gets all the events that are a user is subscribed to
     * 
     * @param userId string
     * 
     */
    getFollowingEvents: async (userId) => {

        query = {

        };

        options = {
            sort: -1
        }
        let events = await eventService.all(query, options);
        return events ? true : false;
    },


    /**
     * Gets all events liked by a user
     * @param userId String
     * 
     */
    getLikedEvents: async (userId) => {

        query = {

        };

        options = {
            sort: -1
        }
        let events = await eventService.all(query, sort);
        return events;
    },


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

    verifySmsCode: async ( userId, code ) => {


        let resp =  await User.findOne( {
            _id: userId, 
            "local.verificationCodes": { $elemMatch: { code} }
        }, {
            _id: 0,
            'local.verificationCodes.$': 1
        })
        
        return resp;
    }
}