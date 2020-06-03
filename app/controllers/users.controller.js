const moment = require("moment");
const uuidv4 = require('uuid/v4');

//services
const userService = require('@services/user.service');
const eventService = require('@services/event.service');
const wishlistService = require('@services/wishlist.service');
const crowdfundingService = require('@services/crowdfunding.service');
const ticketService = require('@services/ticket.service');
const smsService = require('@services/sms.service');
const authService = require("@services/auth.service");
const notificationService = require("@services/notification.service");
const requestService = require("@services/request.service");

const { createFollowRequest } = require("@user-request/follow.request");

//helpers
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
    followUser: async (req, res) => {
        
        //send notification of request
        //add to requestModel 
        const requestee = req.authuser._id;
        const acceptee = req.params.userId;

        try {

            const status = await userService.isFollowingStatus( requestee, acceptee );

            //only send request if status is false.
            if( status === "false"){

                await createFollowRequest( requestee, acceptee );
            }
            
            return res.status(200).json({

                success: true,
                message: "Request has been sent succesfully",
            });
         
        } catch ( err ) {
            
            return res.status(400).json({
                success: false,
                message: "There was an error performing this operation",
                data: err.toString()
            });
        }
    },


    /**
     * unsubscribes a user from an user.
     * user no longer gets user notification/updates
     * 
     * @authlevel authenticated
     */
    unfollowUser: async (req, res ) => {

        let followingId = req.params.userId;
        let userId = req.authuser._id;

        try{
        
            let resp = await userService.unfollowUser( userId, followingId ); 

            return res.status(200).json({

                success: true,
                message: "Operation successful.",
                data: resp
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

            let user = await userService.viewUser( userId );
            const token = await authService.signToken(user);

            return res.status(200).json({
                success: true,
                message: "Verification code validated sucessfully",
                data: token
            });
    
            
        } catch ( err ) {
            
            return res.status(400).json({

                success: false,
                message: "An error occured while trying to carry out this operation.",
                data: err.toString()
            });
        }

    },


    getUserByToken: async ( req, res ) => {

        const userId = req.authuser._id; 

        try {
            
            let data = await userService.viewUser( userId );

            return res.status(200).json({

                success: true,
                message: "Operation successful",
                data
            });
             
        } catch ( err ) {

            return res.status(400).json({
                success: false,
                message: err.toString()
            }); 
        }
    },


    getNotifications: async( req, res ) => {

        const userId = req.authuser._id;

        try {
            // let filter = getMatch(req);
            // let options = getOptions(req);
            // filter["deletedAt"] = null; 
            
            const notifications = await notificationService.getUserNotifications( userId );
            return res.status(200).json({

                success: true,
                message: "Operation successful", 
                data: notifications
            });

        } catch ( err ) {

            return res.status(400).json({
                success: false,
                message: err.toString()
            }); 
            
        }
    },


    getFollowing: async ( req, res ) => {

        const userId = req.params.userId || req.authuser._id;

        try {
            
            let data = await userService.getUserFollowing( userId );

            return res.status(200).json({

                success: true,
                message: "Operation successful",
                data
            });
             
        } catch ( err ) {

            return res.status(400).json({
                success: false,
                message: err.toString()
            }); 
        }
    }, 


    followRequests: async (req, res) => {

        const userId = req.authuser._id;

        try {
            const requests = await requestService.getUserRequests(userId, 'follow-request');

            res.status(200).send({
                success: true,
                message: "Operation successful",
                data: requests
            });

        } catch ( err ) {

            res.status(400).send({
                success: false,
                message: "error performing this operation",
                data: err.toString()
            });
        }
    },


    followStatus: async (req, res) => {

        const authuser = req.authuser._id;
        const isFollowingUser = req.params.userId;

        try {
            const status = await userService.isFollowingStatus( authuser, isFollowingUser );

            res.status(200).json({

                success: true,
                message: "Operation successful",
                data: status
            })

        } catch ( err ) {

            res.status(400).send({
                success: false,
                message: "error performing this operation",
                data: err.toString()
            });
        }
    },


    getRequests: async (req, res) => {

        try {
            const requests = await requestService.getUserRequests(req.authuser._id);

            res.status(200).send({
                success: true,
                message: "Operation successful",
                data: requests
            });

        } catch ( err ) {

            res.status(400).send({
                success: false,
                message: "error performing this operation",
                data: err.toString()
            });
        }
    },


    /**
     * toggles the follow state of a user
     * if user A is following userB, then this endpoint unfollows the userA
     * if userA is not following userB, then it sends userB a follow request
     * 
     * for pending or denied status - nothing happens
     */
    toggleFollow: async( req, res) => {

        const isFollowingUserId = req.params.userId;

        try{
            const userId = req.authuser._id;
            let message;

            const isFollowing = await userService.isFollowingStatus( userId, isFollowingUserId );

            if( isFollowing === "true" ){

                await userService.unfollowUser( userId, isFollowingUserId );
                message = "you have unfollowed this user successfully";

            } 
            else if( isFollowing === "false" ) {

                await createFollowRequest(userId, isFollowingUserId );
                message = "A follow request has been sent to user successfully ";
            } 
            else if( isFollowing === "pending" ) {
                
                message = "Follow Request pending";
            } 

            return res.status(200).json({
                success: true,
                message
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


    friends: async( req, res) => {

        try {
            
            const userId = req.authuser._id;

            const contacts = await userService.getPlatformContacts( userId );

            return res.status(200).json({
                success: true,
                message: "Operation successful.",
                data: contacts

            });
        } catch ( err ) {

            return res.status(400).json({

                success: false,
                message: "There was an error performing this operation",
                data: err.toString()
            });
            
        }
    }

    
}