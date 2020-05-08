//services
const userService = require('@services/user.service');
const eventService = require('@services/event.service');
const wishlistService = require('@services/wishlist.service');
const crowdfundingService = require('@services/crowdfunding.service');
const ticketService = require('@services/ticket.service');
const smsService = require('@services/sms.service');

const uuidv4 = require('uuid/v4');

const { getOptions, getMatch } = require('@helpers/request.helper');


module.exports = {

/**
 * get users
 * @authlevel authenticated | admin
 */
    index: async (req, res) => {

        let filter = getMatch(req);
        let options = getOptions(req);
        filter["deletedAt"] = null;

        try {

            let users = await userService.all(filter, options);
            return res.status(200).json({

                success: true,
                message: "users retreived successfully",
                data: users
            }); 
            
        } catch ( err ) {

            return res.status(400).json({

                success: false,
                message: "Error occured while trying to perform this operation",
                data: err.toString()
            }); 
        }
    },


    /**
     * create a new user.
     */
    create: async (req, res) => {

        let user = req.body;
        
        try {

            let local = {
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName
            }

            user.uuid = uuidv4();
            user.authMethod = "local";
            user.local= local;

            let resp = await userService.createUser(user);

            return res.status(201).json({
                success: true,
                message: "user created successfully",
                data: resp
            });
        } catch ( err ) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to perform this operation",
                data: err.toString()
            });
        }
    },


    /**
     * update a single user model
     * 
     */
    update: async (req, res) => {

        let userId = req.params.userId;
        let userData = req.body;

        try {
            
            let resp = await userService.updateUser( userId, userData );
            // userService.addUserHistory( userId, "USER_UPDATE")
            return res.status(200).json({
                success: true,
                message: "User information has been updated successfully.",
                data: resp
            });

        } catch ( err ) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to update this user.",
                data: err.toString()
            });
        }
    },


    view: async (req, res) => {

        let userId = req.params.userId;

        try {
            let user = await userService.viewUser(userId);

            return res.status(200).json({
                success: true,
                message: "User retreived successfully.",
                data: user
            });
            
        } catch ( err ) {

            return res.status(400).json({
                success: false,
                message: "Error occured while performing this operation.",
                data: err.toString()
            });
        }
    },


    /**
     * softDeletes a single user instance.
     * @authLevel - authenticated | isUserAdmin | isUserCreator
     */
    softdelete: async (req, res) => { 

        let userId = req.params.userId;

        try {
            
            let resp = await userService.softDeleteUser( userId, req.authuser._id );

            return res.status(200).json({
                success: true,
                message: "User has been deleted successfully.",
                data: resp
            });

        } catch ( err ) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to update this user.",
                data: err.toString()
            });
        }
    },



    /**
     * subscribes a user to another user
     * user would start receiving user notifications/updates
     * @authlevel authenticated
     */
    follow: async (req, res) => {

        let userId = req.params.userId;
        let followerId = req.authuser._id;
        
        try{

            let follower = req.authuser._id;

            //let isFollowing = await userService.isFollowingUser(userId, followerId );


            //also check if there is a pending request
            //also check if there is a denied request 
            //also check if follower has been blocked.

            if( ! isFollowing){
                userService.updateUserSet(userId, {"followers": follower }); 
            }

            return res.status(200).json({

                success: true,
                message: "Operation successful",
                data: user
            });
        }
        catch(e){

            return res.status(400).json({
                success: false,
                message: "There was an error performing this operation",
                data: e.toString()
            });
        }
        
    },


    /**
     * unsubscribes a user from an user.
     * user no longer gets user notification/updates
     * 
     * @authlevel authenticated
     */
    unfollow: async (req, res) => {

        let userId = req.params.userId;

        try{
            
            let follower = req.authuser._id;

            await userService.unfollowUser(userId, follower._id); 

            return res.status(200).json({

                success: true,
                message: "User has been unsubscribed from user sucessfully.",
                data: user
            });
        }
        catch( err ){

            return res.status(400).json({
                success: false,
                message: "There was an error performing this operation",
                data: err.toString()
            });
        }
        
    },

    events: async (req, res) => {

        let userId = req.params.userId || req.authuser._id;
        
        try{
            let events = await eventService.all({userId});

            return res.status(200).json({

                success: true,
                message: "User's events retreived successfully.",
                data: events
            });
        }
        catch( err ){

            return res.status(400).json({
                success: false,
                message: "There was an error performing this operation",
                data: err.toString()
            });
        }
        
    },

    wishlists: async (req, res) => {

        let userId = req.params.userId || req.authuser._id;
        
        try{
            let wishlists = await wishlistService.all({userId});

            return res.status(200).json({

                success: true,
                message: "Wishlists retreived successfully.",
                data: wishlists
            });
        }
        catch( err ){

            return res.status(400).json({
                success: false,
                message: "There was an error performing this operation",
                data: err.toString()
            });
        }
    },

    crowdfunds: async (req, res) => {

        let userId = req.params.userId || req.authuser._id;
        
        try{
            let crowdfunds = await crowdfundingService.all({userId});

            return res.status(200).json({

                success: true,
                message: "Crowdfunds retreived successfully.",
                data: crowdfunds
            });
        }
        catch( err ){

            return res.status(400).json({
                success: false,
                message: "There was an error performing this operation",
                data: err.toString()
            });
        }
    },

    tickets: async (req, res) => {

        let userId = req.params.userId || req.authuser._id;
        
        try{
            let tickets = await ticketService.userTickets( userId );

            return res.status(200).json({

                success: true,
                message: "Tickets retreived successfully.",
                data: tickets
            });
        }
        catch( err ){

            return res.status(400).json({

                success: false,
                message: "There was an error performing this operation",
                data: err.toString()
            });
        }
    },

    sendTelephoneVerifcationCode: async (req, res) => {

        const userId = req.params.userId;
        
        try{

            const user = await userService.viewUser( userId );

            const mobilenumber = user.phoneNumber; 

            if( ! mobilenumber){

                return res.status(400).json({
                    success: false,
                    message: "Unable to complete this operation. No mobile number found for this user."
                });
            }
            let code = await userService.setVerfificationCode( userId );

            if( ! code ){

                return res.status(400).json({
                    success: false,
                    message: "Unable to complete this operation. Error generating verifiacation code."
                });
            }

            await smsService.phoneNumberVerification( mobilenumber, code  );

            return res.status(200).json({

                success: true,
                message: "Code has been generated and sent to user's phone succesfully"
            });
        }
        catch( err ){

            return res.status(400).json({
                success: false,
                message: "There was an error performing this operation",
                data: err.toString()
            });
        }
    },

    verifyTelephoneVerifcationCode: async (req, res) => {

        const userId = req.params.userId;
        const code = req.params.code;

        try {

            let resp = await userService.verifySmsCode( userId, code);

            if( ! resp ){

                return res.status(400).json({
                    success: false,
                    message: "Invalid verification code provided."
                });
            }

            let codeExpiryDate = resp.local.verificationCodes[0].expiryDate;

            if( moment().isAfter(codeExpiryDate, 'minute') ){

                return res.status(400).json({
                    success: false,
                    message: "Error: Verification code has expired."
                });
            }

            await userService.updateUser(userId, { "isPhoneNumberVerified": true });

            return res.status(200).json({
                success: true,
                message: "Verification code validated sucessfully"
            });
    
            
        } catch ( err ) {
            
            return res.status(400).json({

                success: false,
                message: "An error occured while trying to carry out this operation.",
                data: err.toString()
            });
        }

    }

    
}