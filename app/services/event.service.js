const Event = require('@models/event.model');
const QRCode = require('qrcode');

module.exports = {

    "model": Event,

    /**
     * returns all events given certain parameters
     * @param query object 
     * @param options object
     */
    all: async ( query, options ) =>{

        let sort = {};
        const {limit, skip, sortBy, orderBy } = options;
        sort[ sortBy ] = orderBy;
        
        let events = await Event.find(query)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .populate('userId', '_id avatar local.firstName local.lastName')
        .populate('followers.userId', '_id avatar local.firstName local.lastName email')
        .populate('likes.userId', '_id avatar local.firstName local.lastName email')
        .populate('invitees.userId', '_id avatar local.firstName local.lastName email')
        .populate('coordinators.userId', '_id avatar local.firstName local.lastName email')
        .populate('wishlistId', '_id name')
        .populate('crowdfundingId', '_id name');
        return events;
    },


    /**
     * creates a new event
     * @param eventData object
     */
    createEvent: async (eventData ) =>{

        let event = new Event(eventData);
        event.qrCode = await QRCode.toDataURL( eventData.uuid );
        return await event.save();
    },


    /**
     * returns a single instance of an event
     * @param eventId String
     */
    viewEvent: async (eventId) => {

        return await Event.findById(eventId)
        .populate('userId', '_id avatar local.firstName local.lastName')
        .populate('followers.userId', '_id avatar local.firstName local.lastName email')
        .populate('likes.userId', '_id avatar local.firstName local.lastName email')
        .populate('invitees.userId', '_id avatar local.firstName local.lastName email')
        .populate('coordinators.userId', '_id avatar local.firstName local.lastName email')
        .populate('wishlistId', '_id name')
        .populate('crowdfundingId', '_id name')
        .lean();
    
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

        return await Event.findByIdAndUpdate( { _id: eventId } , { '$addToSet': setData}, { runValidators: true , new: true} );
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
    followEvent: async( eventId, userId ) => {

        let follower = {
            userId,
            createdAt: new Date(), 
        };

        let setData = { 'followers': follower };

        return await Event.findOneAndUpdate( { _id: eventId } , 
        { '$addToSet': setData }, { runValidators: true , new: true } ).lean();

    },

    
    /**
     * check if a user is followiig an event
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

        return await Event.findByIdAndUpdate( eventId, { $pull: { 'followers':  {"userId": userId }  } }, 
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
    generateInviteLink: async( eventId ) => {

        const baseUrl = process.env.baseUrl;
        const event = module.exports.viewEvent(eventId);
        let link = `${baseUrl}/event/invite/${event.uuid}`;
        return link
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

        return await Event.findOneAndUpdate( { _id: eventId, "invitees.userId": userId }, { $set : { 'invitees.$.accepted' : status }}, { new:true, runValidators: true } );
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
     * They include events that are happening right now or have been set to reoccur every year at a said datetime
     * live events also inclusdes events that have been set to recurring events for a particular day.
     * 
     * @return Event Array.
     */
    liveEvents: async() => {

        let filter = {};
        let dateFilter = {};
        let recurringFilter = {};

        dateFilter["startDate"] = { "$lte" : new Date() };
        dateFilter["endDate"] = { "$gte" : new Date() };
        
        //this should only compare the month and the day - year should be excluded
        recurringFilter["isRecurring"] = true
        recurringFilter["startDate"] = { "$lte" : new Date()}
        recurringFilter["endDate"]  = { "$gte" : new Date() }

        filter["$or"] = [ dateFilter, recurringFilter ]

       return module.exports.all(filter);
    },


    /**
     * returns events within a given radius from a location
     * @param long float
     * @param lat float
     * @param radius float
     */
    byLocation: ( long, lat, radius ) => {

        Event.aggregate(
            [
                { "$geoNear": {
                    "near": {
                        "type": "Point",
                        "coordinates": [ `<${long}>`,`<${lat}>`]
                    },
                    "distanceField": "distance",
                    "spherical": true,
                    "maxDistance": radius
                }}
            ],
            function(err,results) {

                if(err) throw (err);

                return results;
            }
        )

    },


    /**
     * removes all documents in this colletion
     * This service cannot be exposed to a controller 
     * and should only be used during tests and on the test Db
     * 
     */
    removeAll: async () => {

        let env = process.env.NODE_ENV;

        if( env === 'test'){
            return await Event.deleteMany({}) 
        }
    },

    /**
     * adds an event to a user's google calendar
     * when a user creates an event | accepts to attend an event - the event gets added to their google calendar
     * @param eventId
     */
    googleCalendarIntegration: async( eventId ) => {

    }
}