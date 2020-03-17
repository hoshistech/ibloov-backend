const userService = require('@services/user.service');
const uuidv4 = require('uuid/v4');

// const Event = require('@models/event.model');
// var JsBarcode = require('jsbarcode');
// var Canvas = require("canvas");


/**
 * get users
 * @authlevel authenticated | admin
 */
index = async (req, res) => {
    
},


/**
 * create a new user.
 */
create = async (req, res) => {

};


/**
 * update a single user model
 * 
 */
update = async (req, res) => {

    let userId = req.params.userId;
    let userData = req.body;

    if( ! userId){
        return res.status(400).json({
            success: false,
            message: "required User id missing."
        });
    }

    let user = await userService.viewUser(userId);
    
    if( ! user ){
        return res.status(404).json({
            success: false,
            message: "invalid user."
        });
    }

    try {
        
        let resp = await userService.updateUser(userId, userData);
        // userService.addEventHistory( userId, "USER_UPDATE")
        return res.status(200).json({
            success: true,
            message: "User information has been updated successfully.",
            data: resp
        });
    } catch (e) {
        
        return res.status(400).json({
            success: false,
            message: "Error occured while trying to update this user.",
            data: e
        });
    }
};


view = async (req, res) => {

    let eventId = req.params.eventId;

    if( ! eventId ){

        return res.status(400).json({
            success: false,
            message: "invalid event id provided.",
        });
    }

    try {
        let event = await userService.viewEvent(eventId);

        if( ! event){

            return res.status(404).json({
                success: true,
                message: "Event not found!."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event retreived successfully.",
            data: event
        });
        
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: "Error occured while performing this operation.",
            data: e
        });
    }
};


/**
 * softDeletes a single event instance.
 * @authLevel - authenticated | isEventAdmin | isEventCreator
 */
softdelete = async (req, res) => { 

    
    let eventId = req.params.eventId;
    let eventData = req.body;

    if( ! eventId){
        return res.status(400).json({
            success: false,
            message: "required event id missing."
        });
    }

    let event = await userService.viewEvent(eventId);
    if( ! event ){
        return res.status(404).json({
            success: false,
            message: "invalid event."
        });
    }

    try {
        
        let resp = await userService.softDeleteEvent(eventId, eventData);
        return res.status(200).json({
            success: true,
            message: "Event information has been deleted successfully.",
            data: resp
        });
    } catch (e) {
        

        console.log(e)
        return res.status(400).json({
            success: false,
            message: "Error occured while trying to update this event.",
            data: e
        });
    }
};

/**
 * Generates a single code for an event
 * most likely used when genrating an event
 * @authlevel - no auth
 * @returns String
 */
generateEventCode = (req, res) => {

    let code = generateCode();
    res.status(200).json({
        success: true,
        message: "Event code generated successfully",
        data: code
    });
}


/**
 * sunscribes a user to an event
 * user would start receiving event notifications/updates
 * @authlevel authenticated
 */
follow = async (req, res) => {

    let eventId = req.params.eventId;

    if( ! eventId){
        return res.status(400).json({
            success: false,
            message: "required event id missing."
        });
    }
    
    try{
        let event = await userService.viewEvent(eventId);

        if( ! event ){
            return res.status(404).json({
                success: false,
                message: "invalid event."
            });
        }

        let follower = {
            userId: "98765tguif",
            email: "test@test.com",
            telephone: "09039015531"
        }

        let isFollowing = await userService.isFollowingEvent(eventId, follower.userId);

        if( ! isFollowing){
            userService.updateEventSet(eventId, {"followers": follower }); 
        }

        return res.status(200).json({

            success: true,
            message: "Operation successful",
            data: event
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
 * unsubscribes a user from an event.
 * user no longer gets event notification/updates
 * 
 * @authlevel authenticated
 */
unfollow = async (req, res) => {

    let eventId = req.params.eventId;

    if( ! eventId){
        return res.status(400).json({
            success: false,
            message: "required event id missing."
        });
    }
    
    try{
        let event = await userService.viewEvent(eventId);

        if( ! event ){
            return res.status(404).json({
                success: false,
                message: "invalid event."
            });
        }

        //userId to be gotten from the user token
        let follower = {
            userId: "98765tguik",
            email: "test@test.com",
            telephone: "09039015531"
        }

        let isFollowing = await userService.isFollowingEvent(eventId, follower.userId);

        if( ! isFollowing ){

            return res.status(422).json({
                success: false,
                message: "user is currently not following event!"
            });
        }

        await userService.unfollowEvent(eventId, follower.userId); 

        return res.status(200).json({

            success: true,
            message: "User has been unsubscribed from event sucessfully.",
            data: event
        });
    }
    catch(e){

        return res.status(400).json({
            success: false,
            message: "There was an error performing this operation",
            data: e.toString()
        });
    }
    
}


generateCode = () => {

    return Math.random().toString(36).slice(3);
}

module.exports = {index, create, view, update, softdelete, generateEventCode, follow, unfollow}