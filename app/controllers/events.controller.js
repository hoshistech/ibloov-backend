const eventService = require('@services/event.service');
const userService = require('@services/user.service');

//requests 
const { createEventInviteBulkRequest } = require('@user-request/event-invite.request');
const { createEventCoordinatorBulkRequest } = require('@user-request/event-coordinator.request');

const { geocode } = require("@providers/location/node-geocoder.provider")


//notifs

const { eventLikedNotification } = require('@info-notif/event-like.notif');

const uuidv4 = require('uuid/v4');

//helpers
const { getOptions, getMatch } = require('@helpers/request.helper');
const pagination = require('@helpers/pagination.helper');


module.exports = {

    /**
     * get events
     */ 
    index: async (req, res) => {

        let filter = getMatch(req);
        let options = getOptions(req);
        filter["deletedAt"] = null; 
        let resp = {};
    
        try{
            let events = await eventService.all(filter, options);
            let authUser = req.authuser ? req.authuser._id : null;

            //let pg = await eventService.paginatedQuery(filter);
            //console.log(  pagination( pg,  options.limit) ); 

            //revisit this

            if( authUser ){

                const processEvent = async () => {

                    return Promise.all( events.map( async event => {

                        let isFollowing = await eventService.isFollowingEvent( event._id, authUser);
                        event["isFollowing"] = isFollowing; 
                        
                        let invitees = event.invitees;

                        const checkBlooverstFollowingStatus = async () => {

                            return Promise.all( invitees.map( async invitee => {

                                if( invitee.userId ){
            
                                    let isFollowing = await userService.isFollowingUser( authUser,  invitee.userId._id);
                                    invitee.isFollowing = isFollowing;    
                                }
    
                                return invitee;
                            }))
                        }
                        
                        let processedInvitees = await checkBlooverstFollowingStatus();
                        event['invitees'] = processedInvitees
                        return event;
                    }))
                }
    
                events = await processEvent();

                let likedEvents = await eventService.likedByUser( authUser );

                likedEvents = likedEvents.reduce( ( acc, event) => {
                    acc.push(event._id);
                    return acc; 
                }, [] )

                resp["events"] = events;
                resp["likedEvents"] = likedEvents;

                return res.status(200).send({
                    success: true,
                    message: "events retreived succesfully",
                    data: resp
                });
            }

            return res.status(200).send({
                success: true,
                message: "events retreived succesfully",
                data: events
            });
        }
        catch( err ){

            res.status(400).send({
                success: false,
                message: "error performing this operation",
                data: err.toString()
            });
        }
    },


    /**
     * @RESTCONTROLLER
     * create a new event.
     * 
     */
    create: async (req, res) => {

        try{
            let event = req.body;
            event.uuid = uuidv4();
            event.userId = req.authuser._id;

            let geoCode = await geocode( event.address );

            event.location = {
                address: geoCode[0].formattedAddress,
                coordinates: [ geoCode[0].longitude, geoCode[0].latitude ]
            }

            
            let result = await eventService.createEvent(event);
            createEventInviteBulkRequest( result );
            createEventCoordinatorBulkRequest(result);
            
            //sendAccountConfirmationNotification();
            res.status(201).send({
                success: true,
                message: "Event created successfully",
                data: result
            });
        }
        catch( err ){

            res.status(400).send({
                success: false,
                message: "Error performing this operation",
                data: err.toString()
            });
        }
    },

    
    /**
     * @RESTCONTROLLER
     * update a single event model
     * 
     */
    update: async (req, res) => {

        let eventId = req.params.eventId;
        let eventData = req.body;

        try {
            
            let resp = await eventService.updateEvent(eventId, eventData);
            //eventService.addEventHistory(eventId, "EVENT_UPDATE")
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
    },

    /**
     * @RESTCONTROLLER
     * view a single event instance
     */
    view: async (req, res) => {

        let eventId = req.params.eventId;
        const authUser = req.authuser._id;

        try {
            let event = await eventService.viewEvent(eventId);
            event["isFollowing"] = await eventService.isFollowingEvent( eventId, authUser);

            const checkBlooverstFollowingStatus = async () => {

                return Promise.all(  event.invitees.map( async invitee => {

                    if( invitee.userId._id){

                        let isFollowing = await userService.isFollowingUser( authUser,  invitee.userId._id);
                        invitee["isFollowing"] = isFollowing;
                    }

                    return invitee;
    
                }))
            }

            event["invitees"] = await checkBlooverstFollowingStatus();

            return res.status(200).json({
                success: true,
                message: "Event retreived successfully.",
                data: event
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
     * @RESTCONTROLLER
     * softDeletes a single event instance.
     * @authLevel - authenticated | isEventAdmin | isEventCreator
     */
    softdelete: async (req, res) => { 

        let eventId = req.params.eventId;
        let eventData = req.body;

        try {
            
            let resp = await eventService.softDeleteEvent(eventId, eventData);

            return res.status(200).json({
                success: true,
                message: "Event information has been deleted successfully.",
                data: resp
            });

        } catch ( err ) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to process this event.",
                data: err.toString()
            });
        }
    },


    /**
     * @RESTCONTROLLER
     * Generates a single code for an event
     * most likely used when genrating an event
     * @authlevel - no auth
     * @returns String
     */
    generateEventCode: (req, res) => {

        let code = eventService.generateCode();

        res.status(200).json({
            success: true,
            message: "Event code generated successfully",
            data: code
        });
    },


    /**
     * @RESTCONTROLLER
     * sunscribes a user to an event
     * user would start receiving event notifications/updates
     * @authlevel authenticated
     */
    follow: async (req, res) => {

        let eventId = req.params.eventId;
        
        try{
            let followerId = req.authuser._id;
            let result = await eventService.followEvent( eventId, followerId ); 

            return res.status(200).json({
                success: true,
                message: `You are now following this event.`,
                data: result
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


    /**
     * @RESTCONTROLLER
     * Disables notifications for an event
     * user would no longer receive event notifications even if they are the creators, following the event etc..
     * 
     * We should consider if we want event notification mutable for event creators/coordinators
     * 
     * @authlevel authenticated 
     */
    muteNotifications: async (req, res) => {

        const eventId = req.params.eventId;
        const userId = req.authuser._id;
        
        try{

            let result = await eventService.muteEventNotification(eventId, userId ); 

            return res.status(200).json({

                success: true,
                message: "Notification has been muted successfully.",
                data: result
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


    /**
     * @RESTCONTROLLER
     * unsubscribes a user from an event.
     * user no longer gets event notification/updates
     * 
     * @authlevel authenticated
     */
    unfollow: async (req, res) => {

        let eventId = req.params.eventId;
        
        try{
            
            let userId = req.authuser._id; 
            let result = await eventService.unfollowEvent( eventId, userId ); 

            return res.status(200).json({

                success: true,
                message: "You have unsubscribed from this event sucessfully.",
                data: result
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


    toggleFollow: async( req, res) => {

        let eventId = req.params.eventId;

        try{
            const userId = req.authuser._id;
            let message;
            let data;

            let isFollowing = await eventService.isFollowingEvent( eventId, userId);

            if( isFollowing ){

                data = await eventService.unfollowEvent( eventId, userId );
                message = "You have unfollowed this event successfully";

            } else {
                data = await eventService.followEvent( eventId, userId );
                message = "You have followed this event successfully";
            } 

            data.isFollowing = await eventService.isFollowingEvent( eventId, userId );
        

            return res.status(200).json({
                success: true,
                message,
                data
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

    /**
     * @RESTCONTROLLER
     * sets the status of a user's attendance for an event based on the user's response
     */
    confirmAttendance: async (req, res) => {

        const eventId = req.params.eventId;
        const status = req.body.status;
        const userId = req.authuser._id

        try{

            let resp = await eventService.confirmEventAttendance( eventId, userId, status.toUpperCase() );
            
            return res.status(200).json({
                success: true,
                message: "Attendance status set successfully!.",
                data: resp
            });
        }
        catch( err ){
            return res.status(400).json({
                success: false,
                message: "Error performing this operation.",
                data: err.toString()
            });
        }
    },

    /**
     * @RESTCONTROLLER
     * events happening right now
     */
    live: async (req, res) => {

        let filter = getMatch(req);
        let options = getOptions(req); 
        let resp = {};

        const authUser = req.authuser._id;

        try{
            let events = await eventService.liveEvents( filter, options );

            const checkBlooverstFollowingStatus = async () => {

                return Promise.all( events.map( async event => {

                    let isFollowing = await eventService.isFollowingEvent( event._id, authUser);
                    event["isFollowing"] = isFollowing;
                    
                    let invitees = event.invitees;

                    Promise.all( invitees.map( async invitee => {

                        if( invitee.userId ){
    
                            let isFollowing = await userService.isFollowingUser( authUser,  invitee.userId._id);
                            invitee["isFollowing"] = isFollowing;
                        }

                        return invitee;
                    }))

                    return event;
                }))
            }

            events = await checkBlooverstFollowingStatus();

            let result =  await checkBlooverstFollowingStatus();
            let likedEvents = await eventService.likedByUser( req.authuser._id );

            resp["events"] = result;
            resp["likedEvents"] = likedEvents;
            
            return res.status(200).json({
                success: true,
                message: "Live events retreived successfully!.",
                data: resp
            });
        }
        catch( err ){
            return res.status(400).json({
                success: false,
                message: "Error performing this operation.",
                data: err.toString()
            });
        }
    },


    /**
     * adds new invitees to the event invitees
     * @TODO - only the creator or admins of an event should be able to do this
     */
    addInvites: async ( req, res) => {

        let eventId = req.params.eventId;
        let invites = req.body.invites;

        if( invites.constructor !== Array ){

            return res.status(400).json({

                success: false,
                message: `Expected body to be an array, ${typeof invites} provided.`
            });
        }
        
        try {
            let result = await eventService.addInvitees(eventId, invites);

            return res.status(200).json({
                success: true,
                message: "invites have been add successfully. An email has been sent to notify the recepient.",
                data: result
            });
            
        } catch (err) {

            return res.status(400).json({

                success: false,
                message: "Error occured while performing this operation.",
                data: err.toString() 
            });
        }
    },

    /**
     * removes an invite from the list of invites for an event
     * @TODO - only the creator or admins of an event should be able to do this
     */
    removeInvites: async ( req, res) => {

        let eventId = req.params.eventId;
        let invite = req.body.email;
        
        try {
            let result = await eventService.removeInvitees(eventId, invite);

            return res.status(200).json({
                success: true,
                message: "Invite has been removed successfully.",
                data: result
            });
            
        } catch ( err ) {

            return res.status(400).json({

                success: false,
                message: "Error occured while performing this operation.",
                data: err.toString()
            });
        }

    },


    toggleLike: async( req, res) => {

        let eventId = req.params.eventId;

        try{
            const userId = req.authuser._id;
            let data;

            let isLiked = await eventService.hasLikedEvent( eventId, userId);

            if( isLiked ){

                data = await eventService.unlikeEvent( eventId, userId );

            } else {
                data = await eventService.likeEvent( eventId, userId );
                eventLikedNotification( userId, data.userId, eventId);
            } 

            data.isFollowing = await eventService.isFollowingEvent( eventId, userId );

            return res.status(200).json({
                success: true,
                message: "operation successful",
                data
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


    inviteLink: async( req, res) => {

        try {
            let link = await eventService.generateInviteLink();
            return res.status(200).json({

                success: true,
                message: "Operation successful",
                data: link
            });
            
        } catch ( err ) {
            
            return res.status(200).json({

                success: false,
                message: "There was an error performing this operation.",
                data: err.toString()
            });
        }
    }
}
