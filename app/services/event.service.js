const Event = require('@models/event.model');
const QRCode = require('qrcode');
const moment = require("moment");
const { setDefaultOptions  } = require('@helpers/request.helper');

module.exports = {

    "model": Event,

    allCount: async ( query ) => {
        
        return Event.find(query).countDocuments();
    },


    /**
     * returns all events given certain parameters
     * @param query object 
     * @param options object
     */
    all: async ( query, options ) => {

        let sort = {};
        options = options || setDefaultOptions();

        const { limit, skip, sortBy, orderBy } = options;
        sort[ sortBy ] = orderBy;
        
        let events = await Event.find(query)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .populate('userId', '_id avatar authMethod local.firstName local.lastName fullName')
        .populate('followers.userId', '_id avatar authMethod local.firstName local.lastName email fullName')
        .populate('likes.userId', '_id avatar authMethod local.firstName local.lastName email fullName')
        .populate('invitees.userId', '_id avatar authMethod local.firstName local.lastName email fullName')
        .populate('coordinators.userId', '_id avatar authMethod local.firstName local.lastName email fullName')
        .populate('wishlistId', '_id name')
        .populate('crowdfundingId', '_id name')
        .lean()

        console.log("here")

        return events;
    },


    paginatedQuery: async ( query  ) => {
        
        let events = await Event.find(query)
        return events;
    },


    /**
     * creates a new event
     * @param eventData object
     */
    createEvent: async ( eventData ) =>{

        let event = new Event(eventData);
        event.qrCode = await QRCode.toDataURL( eventData.uuid );
        event.coordinators.push({ userId: eventData.userId, accepted: "YES" }); 
        return await event.save();
    },


    /**
     * returns a single instance of an event
     * @param eventId String
     */
    viewEvent: async (eventId) => {

        return await Event.findById(eventId)
        .populate('userId', '_id avatar authMethod local.firstName local.lastName fullName')
        .populate('followers.userId', '_id avatar authMethod local.firstName local.lastName email fullName')
        .populate('likes.userId', '_id avatar authMethod local.firstName local.lastName email fullName')
        .populate('invitees.userId', '_id avatar authMethod local.firstName local.lastName email fullName')
        .populate('coordinators.userId', '_id avatar authMethod local.firstName local.lastName email fullName')
        .populate('wishlistId', '_id name')
        .populate('crowdfundingId', '_id name')
        .lean(); //find a way to avoid using .lean() here
    
    },


    /**
     * update a single event instance
     * @param eventId integer
     * @param updateData 
     */
    updateEvent: async (eventId, updateData) => {

        const result = await Event.findByIdAndUpdate( eventId, updateData, { runValidators: true , new: true});
        return result;
    },


    /**
     * update a set of a single event model
     * @param eventId String 
     * @param update object
     * 
     */
    updateEventSet: async (eventId, setData) => {

        return await Event.findByIdAndUpdate( { _id: eventId } , { '$addToSet': setData }, { runValidators: true , new: true } );
    },


    /**
     * performs a softDelete operation on a single instance of an event model
     * @param eventId integer
     *
     */
    softDeleteEvent: async (eventId) => {

        const updateData = { deletedAt: Date.now(), deletedBy: '5e8cb0191ec1f8160def48c1' };
        return await module.exports.updateEvent(eventId, updateData);  
    },



    /**
     * helper to generate event codes.
     */
    generateCode: () => {
        return Math.random().toString(36).slice(3);
    },


    /**
     * updates an event instance -  addsa a new audit history to the event document
     * @param eventId String - the unique identifier of the event.
     * @param event string - the name of the event e.g create, delete etc.
     */
    addEventHistory: async (eventId, event) => {

        let history  = {
            event,
            createdAt: new Date(),
            comment: "new event history",
            userId: "5e74a056a1d062242108b212"
        };

        let set = { 'history': history };

        return await module.exports.updateEventSet(eventId, set);
    },


    /**
     * updates an event controls - controls are like dos/donts of an event (bad explanation, but you get the point)
     * e.g "no-pets" could be an event control - if the owners of an event do not want pets at their event
     * @param eventId String - the unique identifier of the event.
     * @param controlName string - the name of the event e.g create, delete etc.
     */
    addEventControl: async (eventId, controlName) => {

        let control  = {
            name: controlName,
            createdAt: new Date(),
            createdBy: "kgmkgmgkg"
        };

        let set = { 'controls': control };

        return await module.exports.updateEventSet(eventId, set);

    },


    /**
     * Adds a new follower to an event.
     * users can follow an event - this allows them to get updates as regards then event.
     * @param eventId String
     * @param user object
     */
    followEvent: async ( eventId, userId ) => {

        let follower = {
            userId,
            createdAt: new Date(), 
        };

        let setData = { 'followers': follower };

        return await Event.findOneAndUpdate( { _id: eventId } , 
        { '$addToSet': setData }, { runValidators: true , new: true } ).lean();

    },

    /**
     * check if a user is following an event
     * 
     * @param eventId string
     * @param userId string
     * 
     * @return boolean
     */
    isFollowingEvent: async (eventId, userId) => {

        let event = await Event.findOne({ _id: eventId, 'followers.userId': userId });
        return event ? true : false;
    },


    /**
     * unsubsribes a user from an event
     * the user no longer gets notifications of happenings on that event. 
     * @param eventId string
     * @param userId string
     */
    unfollowEvent: async (eventId, userId) => {

        return await Event.findByIdAndUpdate( eventId, { $pull: { 'followers':  { "userId": userId }  } }, 
        {  runValidators: true, new: true} ).lean();
    
    },


    /**
     * check if a user has liked an event
     * 
     * @param eventId string
     * @param userId string
     * 
     * @return boolean
     */
    hasLikedEvent: async (eventId, userId) => {

        let event = await Event.findOne({ _id: eventId, 'likes.userId': userId });
        return event ? true : false;
    },
    
    /**
     * Allows a user to like an event
     * 
     * @param eventId String
     * @param userId String
     */
    likeEvent: async ( eventId, userId ) => {

        let liker = {
            userId,
            createdAt: new Date(), 
        };

        let setData = { 'likes': liker };

        return await Event.findOneAndUpdate( { _id: eventId } , 
        { '$addToSet': setData }, { runValidators: true , new: true } ).lean();

    },


    /**
     * Allows a user to unlike an event
     * 
     * @param eventId String
     * @param userId String
     */
    unlikeEvent: async ( eventId, userId ) => {

        return await Event.findByIdAndUpdate( eventId, { $pull: { 'likes':  { "userId": userId }  } }, 
        {  runValidators: true, new: true} ).lean();
    
    },


    /**
     * disables a users from getting notifications about an event
     * even if the user is following the event
     * 
     * @param eventId String
     * @param userId String
     */
    muteEventNotification: async ( eventId, userId ) => {

        return await Event.findOneAndUpdate( { _id: eventId, "followers.userId": userId }, { $set : { 'followers.$.allowNoifications' : false }}, 
        { runValidators: true, new: true  } );  
    },


    /**
     * checks if a user is an admin for an event 
     * @param eventId String
     * @param email|userid String <---- still need to decide the better option/approach ( consider case where I want to add somone
     * as a coordinator but who is not yet signed on the platform - do I enforce they sign up or allow them just use their email without a need 
     * to sign up)
     * 
     * @returns boolean
     */
    isEventAdmin: async (eventId, userId) => {

        let event = await Event.findOne({ _id: eventId, 'coordinators.email': emai });
        return event ? true : false;
    },


    /**
     * Generates the invite link for an event
     * @param eventId String
     * 
     */
    generateInviteLink: async() => {

        const baseUrl = process.env.FRONTEND_BASE_URL;
        randomString = (+new Date).toString(36).slice();
        let link = `${baseUrl}/event/invite/${randomString}`;
        return link
    },


    /**
     * check if a user is following an event
     * 
     * @param eventId string
     * @param userId string
     * 
     * @return boolean
     */
    isInvited: async (eventId, userId) => {

        let event = await Event.findOne({ _id: eventId, 'invitees.userId': userId });
        return event ? true : false;
    },


    /**
     * Basically confirms that a user would be attending an event
     * updates a user attending status to 'YES' for an event
     * @param eventId String
     * @param userId String
     * @param status String - "YES", "NO", "MAYBE" are the only allowed values 
     * 
     */
    confirmEventAttendance: async( eventId, userId, status ) => {

        let isInvited = await module.exports.isInvited( eventId, userId );

        /**
         * Todo check for paid events
         * Todo only people who have paid, for paid events should be added to attending.
         * Todo - to acheive the above, make sure the user has a ticket
         */
        

        if( isInvited ){

            return await Event.findOneAndUpdate( { _id: eventId, "invitees.userId": userId }, { $set : { 'invitees.$.accepted' : status }}, { new:true, runValidators: true } )
            .populate('userId', '_id avatar authMethod local.firstName local.lastName email fullName')
            .populate('invitees.userId', '_id avatar authMethod local.firstName local.lastName email fullName');

        }
        else{

            let event = await Event.findById(eventId);
            const isPrivate = event.isPrivate;

            if( isPrivate ) throw new Error("Invalid invite to a priavte event.")

            let invite = {
                userId,
                accepted: status
            }

            return await Event.findOneAndUpdate(
                { "_id" : eventId },
                { 
                    "$addToSet": { 
                        invitees : invite 
                    } 
                }, 
                { runValidators: true, new: true }
            )
            .populate('userId', '_id avatar authMethod local.firstName local.lastName fullName')
            .populate('invitees.userId', '_id avatar authMethod local.firstName local.lastName email fullName')

        }
    },


    /**
     * Basically confirms that a user status on a request to be a coordinator for an event
     * This is usually based on request to the user
     * updates a user accept status in the coordinator array for an event
     * @param eventId String
     * @param userId String
     * @param status String - "YES" and "NO" are the only allowed values 
     * 
     */
    confirmEventCoordinator: async( eventId, userId, status ) => {

        if( status !== "YES" && status !== "NO") throw new Error("invalid event coordinator request confirmation value");

        let coordinator = await Event.findOne({ _id: eventId, 'coordinators.userId': userId });

        if( coordinator ){

            return await Event.findOneAndUpdate( { _id: eventId, "coordinators.userId": userId }, { $set : { 'coordinators.$.accepted' : status }}, { new:true, runValidators: true } )
            .populate('userId', '_id avatar authMethod local.firstName local.lastName email fullName')
            .populate('invitees.userId', '_id avatar authMethod local.firstName local.lastName email fullName');
        }

        throw new Error("coordinator not found!");
    },


    /**
     * add new invitees to an event
     * @param eventId String
     * @param invitees array
     */
    addInvitees: async( eventId, invites = [] ) => {

        return await Event.findOneAndUpdate(
            { "_id" : eventId },
            { 
                "$addToSet": { 
                    invitees : { 
                        "$each": invites
                    } 
                } 
            }, 
            { runValidators: true, new: true }
        );
    },


    /**
     * Remove an invitee from an event.
     * @param eventId string
     * @param userId string - this could later be the user's email, yet to decide
     */
    removeInvitees: async( eventId, email ) => {

        let update = await Event.findByIdAndUpdate( eventId, { $pull: { 'invitees':  { "email": email }  } }, 
        { new: true} );
        return update;
    },


    /**
     * Returns a list of live events
     * Live events are events that are currently taking place.
     * They include events that are happening right now
     * 
     * @return Event Array.
     */
    liveEvents: async(filter, options) => {

        let beforeNow = moment().subtract( 72, 'h').toDate();
        let AfterNow =  moment().add( 72, 'h').toDate();

        filter["startDate"] = { $lte: AfterNow, $gte: beforeNow }
        filter["deletedAt"] = null;

       return module.exports.all(filter, options);
    },


    /**
     * returns events within a given radius from a location
     * @param long float
     * @param lat float
     * @param radius float
     */
    byLocation: async ( long, lat, radius ) => {


        let events = await Event.find({

            location: {
              $near: {
                $maxDistance: 3000,
                $geometry: {
                  type: "Point",
                  coordinates: [lat, lang]
                }
              }
            }
          });

          return events;

    },


    likedByUser: async ( userId ) => {

        query = {
            "likes.userId": userId, "deletedAt": null
        };

        let events = await Event.find(query)
        .select("_id")
        .lean()
        return events; 
    },


    /**
     * approve a requst to attend an event
     */
    approveEventInviteRequest: async ( eventId, accepteeId  ) => {

        return await module.exports.confirmEventAttendance( eventId, accepteeId, "YES"); 
    },


    /**
     * deny a request to attend an event
     */
    denyEventInviteRequest: async ( eventId, rejecteeId ) => {

        return await module.exports.confirmEventAttendance( eventId, rejecteeId, "NO");

    },

    /**
     * approve a requst to attend an event
     */
    approveEventCoordinatorRequest: async ( eventId, accepteeId ) => {

        return await module.exports.confirmEventCoordinator( eventId, accepteeId, "YES"); 
    },


    /**
     * deny a request to attend an event
     */
    denyEventCoordinatorRequest: async ( eventId, rejecteeId ) => {

        return await module.exports.confirmEventCoordinator( eventId, rejecteeId, "NO");

    },


    bloovingCities: async() => {

        const result = await Event.aggregate([{
            $group: {
              _id: "$location.city",
              count: { $sum: 1}
            }
          }])

        return result;
    },

    /**
     * adds an event to a user's google calendar
     * when a user creates an event | accepts to attend an event - the event gets added to their google calendar
     * @param eventId
     */
    googleCalendarIntegration: ( eventId ) => {

        console.log("google integration!");
    }
}