//services
const userService = require('@services/user.service');
const eventService = require('@services/event.service');
const wishlistService = require('@services/wishlist.service');
const crowdfundingService = require('@services/crowdfunding.service');

const uuidv4 = require('uuid/v4');


module.exports = {

/**
 * get users
 * @authlevel authenticated | admin
 */
    index: async (req, res) => {

        try {

            let users = await userService.all();
            return res.status(200).json({

                success: true,
                message: "users retreived successfully",
                data: users
            }); 
            
        } catch ( err ) {

            return res.status(400).json({

                success: false,
                message: "Error occured while trying to perform this operation",
                data: users
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
     * subscribes a user to an user
     * user would start receiving user notifications/updates
     * @authlevel authenticated
     */
    follow: async (req, res) => {

        let userId = req.params.userId;

        if( ! userId){
            return res.status(400).json({
                success: false,
                message: "required user id missing."
            });
        }
        
        try{
            let user = await userService.viewUser(userId);

            if( ! user ){
                return res.status(404).json({
                    success: false,
                    message: "invalid user."
                });
            }

            let follower = {
                userId: "98765tguif",
                email: "test@test.com",
                telephone: "09039015531"
            }

            let isFollowing = await userService.isFollowingUser(userId, follower.userId);

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

        let userId = req.params.userId;
        
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

        let userId = req.params.userId;
        
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

        let userId = req.params.userId;
        
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
    }
}