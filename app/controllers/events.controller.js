const eventService = require('@services/event.service');
const { sendAccountConfirmationNotification } = require('@services/mail.service');
const uuidv4 = require('uuid/v4');


/**
 * get events
 */
index = async (req, res) => {

    try{
        let events = await eventService.all();
        res.status(200).send({
            success: true,
            message: "events retreived succesfully",
            data: events
        });
    }
    catch(e){

        res.status(400).send({
            success: false,
            message: "error performing this operation",
            data: e.toString()
        });
    }
    
},


/**
 * @RESTCONTROLLER
 * create a new event.
 * 
 * @TODO add middleware to ensure that the start date is not in the past
 * @TODO add middleware to ensure that the end date is not greater than the start date
 */
create = async (req, res) => {

    let event = req.body;
    event.createdBy = "76trfguiolk";
    event.uuid = uuidv4();

    try{
        await eventService.createEvent(event);
        //sendAccountConfirmationNotification();
        res.status(201).send({
            success: true,
            message: "Event created successfully",
            data: event
        });
    }
    catch(e){

        res.status(400).send({
            success: false,
            message: "Error performing this operation",
            data: e
        });
    }
};

 
/**
 * @RESTCONTROLLER
 * update a single event model
 * 
 */
update = async (req, res) => {

    let eventId = req.params.eventId;
    let eventData = req.body;

    if( ! eventId){
        return res.status(400).json({
            success: false,
            message: "required event id missing."
        });
    }

    let event = await eventService.viewEvent(eventId);
    
    if( !event ){
        return res.status(404).json({
            success: false,
            message: "invalid event."
        });
    }

    try {
        
        let resp = await eventService.updateEvent(eventId, eventData);
        eventService.addEventHistory(eventId, "EVENT_UPDATE")
        return res.status(200).json({
            success: true,
            message: "Event information has been updated successfully.",
            data: resp
        });
    } catch (e) {
        
        return res.status(400).json({
            success: false,
            message: "Error occured while trying to update this event.",
            data: e
        });
    }
};

/**
 * @RESTCONTROLLER
 * view a single event instance
 */
view = async (req, res) => {

    let eventId = req.params.eventId;

    if( ! eventId ){

        return res.status(400).json({
            success: false,
            message: "invalid event id provided.",
        });
    }

    try {
        let event = await eventService.viewEvent(eventId);

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
 * @RESTCONTROLLER
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

    let event = await eventService.viewEvent(eventId);
    if( ! event ){
        return res.status(404).json({
            success: false,
            message: "invalid event."
        });
    }

    try {
        
        let resp = await eventService.softDeleteEvent(eventId, eventData);
        return res.status(200).json({
            success: true,
            message: "Event information has been deleted successfully.",
            data: resp
        });
    } catch (e) {
        

        console.log(e)
        return res.status(400).json({
            success: false,
            message: "Error occured while trying to process this event.",
            data: e
        });
    }
};


/**
 * @RESTCONTROLLER
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
 * @RESTCONTROLLER
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
        let event = await eventService.viewEvent(eventId);

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

        let isFollowing = await eventService.isFollowingEvent(eventId, follower.userId);

        if( ! isFollowing){
            eventService.updateEventSet(eventId, {"followers": follower }); 
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
 * @RESTCONTROLLER
 * Disables notifications for an event
 * user would no longer receive event notifications even if they are the creators, following the event etc..
 * 
 * We should consider if we want event notification mutable for event creators/coordinators
 * 
 * @authlevel authenticated 
 */
muteNotifications = async (req, res) => {

    const eventId = req.params.eventId;
    const userId = "98765tguif";

    if( ! eventId){
        return res.status(400).json({
            success: false,
            message: "required event id missing."
        });
    }
    
    try{
        let event = await eventService.viewEvent(eventId);

        if( ! event ){
            return res.status(404).json({
                success: false,
                message: "Event not found!."
            });
        }

        eventService.muteEventNotification(eventId, userId ); 

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
 * @RESTCONTROLLER
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
        let event = await eventService.viewEvent(eventId);

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

        let isFollowing = await eventService.isFollowingEvent(eventId, follower.userId);

        if( ! isFollowing ){

            return res.status(422).json({
                success: false,
                message: "user is currently not following event!"
            });
        }

        await eventService.unfollowEvent(eventId, follower.userId); 

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
    
},


/**
 * @RESTCONTROLLER
 * sets the status of a user's attendance for an event based on the user's response
 */
confirmAttendance = async (req, res) => {

    const eventId = req.params.eventId;
    const status = req.body.status;
    const userId = "1234561"

    if( ! eventId ){
        return res.status(400).json({
            success: false,
            message: "required event id missing."
        });
    }

    if( ! status ){
        return res.status(400).json({
            success: false,
            message: "required status missing."
        });
    }


    try{

        let event = await eventService.viewEvent(eventId);
        if( ! event ){
            return res.status(404).json({
                success: false,
                message: "invalid event."
            });
        }

        await eventService.confirmEventAttendance( eventId, userId, status.toUpperCase() );
        
        return res.status(200).json({
            success: true,
            message: "Event invitation accepted successfully!."
        });
    }
    catch(e){
        return res.status(400).json({
            success: false,
            message: "Error performing this operation.",
            data: e.toString()
        });
    }
}

/**
 * @RESTCONTROLLER
 * events happening right now
 */
live = async (req, res) => {

    try{
        let events = await eventService.liveEvents();
        
        return res.status(200).json({
            success: true,
            message: "Live events retreived successfully!.",
            data: events
        });
    }
    catch(e){
        return res.status(400).json({
            success: false,
            message: "Error performing this operation.",
            data: e.toString()
        });
    }
}


/**
 * adds new invitees to the event invitees
 * @TODO - only the creator or admins of an event should be able to do this
 */
addInvites = async ( req, res) => {

    let eventId = req.params.eventId;
    let invites = req.body.invites;

    if( invites.constructor !== Array ){

        return res.status(400).json({

            success: false,
            message: `Expected body to be an array, ${typeof invites} provided.`
        });
    }
    
    try {
        await eventService.addInvitees(eventId, invites);

        return res.status(200).json({
            success: true,
            message: "invites have been add successfully. An email has been sent to notify the recepient."
        });
        
    } catch (err) {

        return res.status(400).json({

            success: false,
            message: "Error occured while performing this operation.",
            data: err.toString()
        });
    }

}

/**
 * removes an invite from the list of invites for an event
 * @TODO - only the creator or admins of an event should be able to do this
 */
removeInvites = async ( req, res) => {

    let eventId = req.params.eventId;
    let invite = req.body.email;
    
    try {
        await eventService.removeInvitees(eventId, invite);

        return res.status(200).json({
            success: true,
            message: "Invite has been removed successfully."
        });
        
    } catch (err) {

        return res.status(400).json({

            success: false,
            message: "Error occured while performing this operation.",
            data: err.toString()
        });
    }

}

/**
 * helper to generate event codes.
 */
generateCode = () => {

    return Math.random().toString(36).slice(3);
}

module.exports = {index, create, view, update, softdelete, generateEventCode, follow, unfollow, confirmAttendance, muteNotifications, live, addInvites, removeInvites}