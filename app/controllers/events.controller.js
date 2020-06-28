const uuidv4 = require('uuid/v4');

//services
const eventService = require('@services/event.service');
const userService = require('@services/user.service');

//requests 
const { createEventInviteBulkRequest } = require('@user-request/event-invite.request');
const { createEventCoordinatorBulkRequest } = require('@user-request/event-coordinator.request');

//providers
const { geocode } = require("@providers/location/node-geocoder.provider")

//notifs
const { eventLikedNotification } = require('@info-notif/event-like.notif');
const { eventAttendanceConfirmationNotification } = require('@info-notif/event-attendance-confirmation.notif');

//helpers
const { getOptions, getMatch } = require('@helpers/request.helper');
const pagination = require('@helpers/pagination.helper'); 


module.exports = {

    /**
     * @RESTCONTROLLER
     * get all events
     */ 
    index: async (req, res) => {

        let filter = getMatch(req);
        let options = getOptions(req);
        filter["deletedAt"] = null; 
    
        try{
              
            let authUser = req.authuser ? req.authuser._id : null;

            let [ events, eventCount ] = await Promise.all([
                eventService.all( filter, options, authUser ),
                eventService.allCount( filter, authUser )
            ]);

            if( authUser ){

                const processEvent = async () => {

                    const userPlatformContacts = await userService.getPlatformContacts( authUser );

                    return Promise.all( events.map( async event => { 

                        let isFollowing = await eventService.isFollowingEvent( event._id, authUser);
                        event["isFollowing"] = isFollowing; 
                        
                        let invitees = event.invitees || [];
                        let coordinators = (event.coordinators) ? ( event.coordinators.filter( coordinator =>  coordinator.accepted === "YES" ) ) : [];

                        let userFollowing = userPlatformContacts.following;
                    
                        //this simply checks the following status betweeen the authuser and each of the hosts
                        const checkCoordinatorsFollowingStatus = async () => {
                    
                    
                            return Promise.all( coordinators.map( async coordinator => {
                    
                                if( coordinator.userId ){
                                    
                                    //convert the value to string, makes it easier for comparisons since some of the values come as objects
                                    let currentCoordinatorAsString = coordinator.userId._id.toString();

                                    //check if the coordinator is in the authuser's following list
                                    let isFollowingFromFollowingArray = userFollowing.filter( following => following._id.toString() == currentCoordinatorAsString );

                                    //set the value of the tracker value to "true" if the use exists in the following array
                                    //if not check the tracker array.
                                    coordinator.isFollowing = isFollowingFromFollowingArray.length > 0 ? "true" : "false";                      
                                }
                                return coordinator;  
                            }))
                        }
                    
                        //this simply checks the following status betweeen the authuser and each of the invitees
                        const checkBlooversFollowingStatus = async () => {
                    
                            return Promise.all( invitees.map( async invitee => {
                    
                                if( invitee.userId ){
                                    
                                    let currentInviteeAsString = invitee.userId._id.toString();

                                    let isFollowingFromFollowingArray = userFollowing.filter( following => following._id.toString() == currentInviteeAsString );

                                    invitee.isFollowing = isFollowingFromFollowingArray.length > 0 ? "true" : "false";
                                }
                    
                                return invitee;
                            }))
                        }
                    
                        let processedCoordinators = await checkCoordinatorsFollowingStatus();
                        let processedInvitees = await checkBlooversFollowingStatus();
                        
                        event['invitees'] = processedInvitees;
                        event['coordinators'] = processedCoordinators;
                    
                        return event;
                    }))
                }

                events = await processEvent();

                let likedEvents = await eventService.likedByUser( authUser );

                likedEvents = likedEvents.reduce( ( acc, event) => { 
                    acc.push(event._id);
                    return acc; 
                }, [] )

                let resp = {};

                resp["events"] = events;
                resp["likedEvents"] = likedEvents;

                return res.status(200).send({
                    success: true,
                    message: "events retreived succesfully",
                    data: resp,
                    pagination: pagination( eventCount, options, filter, req.originalUrl )
                });

            }

            return res.status(200).send({
                success: true,
                message: "events retreived succesfully",
                data: events,
                pagination: pagination( eventCount, options, filter, req.originalUrl )
            });
        }
        catch( err ){

            console.log(err);

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
                city: geoCode[0].city,
                country: geoCode[0].country,
                countryCode: geoCode[0].countryCode,
                coordinates: [ geoCode[0].longitude, geoCode[0].latitude ]
            }

           event.invitees = await processContacts(event.invitees);
           event.coordinators = await processContacts(event.coordinators);
            
            let result = await eventService.createEvent(event);
            //await process invites
            createEventInviteBulkRequest( result );
            createEventCoordinatorBulkRequest( result );
            
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
        

        try {

            const authUser = req.authuser ? req.authuser._id : null;

            let event = await eventService.viewEvent(eventId);

            if( authUser ){

                const userPlatformContacts = await userService.getPlatformContacts( authUser );
                const userFollowing = userPlatformContacts.following;

                event["isFollowing"] = await eventService.isFollowingEvent( eventId, authUser);
                let coordinators = (event.coordinators) ? ( event.coordinators.filter( coordinator =>  coordinator.accepted === "YES" ) ) : [];

                const checkBlooversFollowingStatus = async () => {

                    return Promise.all(  event.invitees.map( async invitee => {

                        if( invitee.userId ){

                            let currentInviteeAsString = invitee.userId._id.toString();
                            let isFollowingFromFollowingArray = userFollowing.filter( following => following._id.toString() == currentInviteeAsString );
                            invitee["isFollowing"] = isFollowingFromFollowingArray.length > 0 ? "true" : "false"; 
                        }

                        return invitee;
        
                    }))
                }

                const checkCoordinatorsFollowingStatus = async () => {

                    return Promise.all( coordinators.map( async coordinator => {

                        if( coordinator.userId ){

                            let currentCoordinatorAsString = coordinator.userId._id.toString();
                            let isFollowingFromFollowingArray = userFollowing.filter( following => following._id.toString() == currentCoordinatorAsString );
                            coordinator["isFollowing"] = isFollowingFromFollowingArray.length > 0 ? "true" : "false";    
                        }

                        return coordinator;
                        
                    }))
                }

                event["invitees"] = await checkBlooversFollowingStatus();
                event["coordinators"] = await checkCoordinatorsFollowingStatus();
            }
            
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
        let userId = req.authuser._id;

        try {
            
            let resp = await eventService.softDeleteEvent(eventId, userId);

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


    /**
     * @RESTCONTROLLER
     * @authlevel authenticated
     * 
     * endpoint to toggle the following statu of a user against the currently authenticated user. 
     */
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
     * @authlevel authenticated
     * 
     * sets the status of a user's attendance for an event based on the user's response
     */
    confirmAttendance: async (req, res) => {

        const eventId = req.params.eventId;
        const status = req.body.status;
        const userId = req.authuser._id;

        try{

            let resp = await eventService.confirmEventAttendance( eventId, userId, status.toUpperCase() );
            if( status.toUpperCase() === "YES"){

                eventAttendanceConfirmationNotification( userId, resp.userId._id, eventId);
            } 
            
            return res.status(200).json({
                success: true,
                message: "Attendance status set successfully!.",
                data: resp
            });
        }
        catch( err ){

            /**
             * Todo if event is paid, and there is a failure, alert admin to this failiure
             */
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
        count = 0;

        try{

            const authUser = req.authuser ? req.authuser._id : null;

            let [ events, eventCount ] = await Promise.all([
                eventService.liveEvents(filter, options, authUser ),
                eventService.allCount(filter, authUser)
            ]);

            if( authUser ){

                const processEvent = async () => {

                    const userPlatformContacts = await userService.getPlatformContacts( authUser );

                    return Promise.all( events.map( async event => { 

                        let isFollowing = await eventService.isFollowingEvent( event._id, authUser);
                        event["isFollowing"] = isFollowing; 
                        
                        let invitees = event.invitees || [];
                        let coordinators = (event.coordinators) ? ( event.coordinators.filter( coordinator =>  coordinator.accepted === "YES" ) ) : [];

                        let userFollowing = userPlatformContacts.following;
                    
                        //this simply checks the following status betweeen the authuser and each of the hosts
                        const checkCoordinatorsFollowingStatus = async () => {
                    
                    
                            return Promise.all( coordinators.map( async coordinator => {
                    
                                if( coordinator.userId ){
                                    
                                    //convert the value to string, makes it easier for comparisons since some of the values come as objects
                                    let currentCoordinatorAsString = coordinator.userId._id.toString();

                                    //check if the coordinator is in the authuser's following list
                                    let isFollowingFromFollowingArray = userFollowing.filter( following => following._id.toString() == currentCoordinatorAsString );

                                    //set the value of the tracker value to "true" if the use exists in the following array
                                    //if not check the tracker array.
                                    coordinator.isFollowing = isFollowingFromFollowingArray.length > 0 ? "true" : "false";                      
                                }
                                return coordinator;  
                            }))
                        }
                    
                        //this simply checks the following status betweeen the authuser and each of the invitees
                        const checkBlooversFollowingStatus = async () => {
                    
                            return Promise.all( invitees.map( async invitee => {
                    
                                if( invitee.userId ){
                                    
                                    let currentInviteeAsString = invitee.userId._id.toString();

                                    let isFollowingFromFollowingArray = userFollowing.filter( following => following._id.toString() == currentInviteeAsString );

                                    invitee.isFollowing = isFollowingFromFollowingArray.length > 0 ? "true" : "false";
                                }
                    
                                return invitee;
                            }))
                        }
                    
                        let processedCoordinators = await checkCoordinatorsFollowingStatus();
                        let processedInvitees = await checkBlooversFollowingStatus();
                        
                        event['invitees'] = processedInvitees;
                        event['coordinators'] = processedCoordinators;
                    
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
                    data: resp,
                    pagination: pagination( eventCount, options, filter, req.originalUrl )
                });

            }


            return res.status(200).json({
                success: true,
                message: "Live events retreived successfully!.",
                data: events,
                pagination: pagination( eventCount, options, filter, req.originalUrl )
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
     * Todo - only the creator or admins of an event should be able to do this
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
     * Todo - only the creator or admins of an event should be able to do this
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
            
            return res.status(400).json({

                success: false,
                message: "There was an error performing this operation.",
                data: err.toString()
            });
        }
    },



    bloovingCities: async( req, res) => {

        try {
            let resp = await eventService.bloovingCities();
            //let resp = await eventService.byLocation();
            return res.status(200).json({

                success: true,
                message: "Operation successful",
                data: resp
            });
            
        } catch ( err ) {
            
            return res.status(400).json({

                success: false,
                message: "There was an error performing this operation.",
                data: err.toString()
            });
        }
    }
}


const processContacts = async ( contacts ) => {

    if( ! contacts || contacts.length < 1  ) return;

    return Promise.all(  contacts.map( async contact => {

        if( ! contact.userId ){

            let query;

            if( contact.email ){
                query = { email: contact.email };
            }
            else if( contact.telephone ){

                let phoneNumber = contact.telephone.replace(/\s/g, "");
                query = { phoneNumber };
            }

            if( query ){

                let user = await userService.getUser( query );

                if( user ){
                    contact["userId"] = user._id;
                }
            } 
        }

        return contact;
    }))
}
