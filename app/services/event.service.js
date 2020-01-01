const Event = require('@models/event.model');

module.exports = {

    /**
     * returns all events given certain parameters
     * @param query object 
     * @param options object
     */
    all: async ( query = {}, options = {} ) =>{

        //const {limit, sort} =  options;
        query["deletedAt"] = null;
        let events = await Event.find(query);
        return events;
    },


    /**
     * creates a new event
     * @param eventData object
     */
    createEvent: async (eventData ) =>{

        let event = new Event(eventData);
        let result = await event.save(); 
        return result; 
    },


    /**
     * returns a single instance of an event
     * @param eventId String
     */
    viewEvent: async (eventId) => {

        let event = await Event.findById(eventId);
        return event;
    },


    /**
     * update a single event instance
     * @param eventId integer
     * @param updateData 
     */
    updateEvent: async (eventId, updateData) => {

        const result = await Event.findByIdAndUpdate( eventId, updateData, {new: true});
        return result;
    },


    /**
     * update a set of a single event model
     * @param eventId String 
     * @param update object
     * 
     */
    updateEventSet: async (eventId, setData) => {

        return await Event.findByIdAndUpdate( { _id: eventId } , { '$addToSet': setData });
    },


    /**
     * performs a softDelete operation on a single instance of a model
     * @param eventId integer
     *
     */
    softDeleteEvent: async (eventId) => {

        const updateData = {deletedAt: Date.now(), deletedBy: '1edfhuio3ifj'};
        return await module.exports.updateEvent(eventId, updateData);  
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
            userId: "o098uyhjk"
        };

        let set = { 'history': history };

        return await module.exports.updateEventSet(eventId, updateData);
        // return await Event.findByIdAndUpdate( { _id: eventId } , { '$addToSet': { 'history': data } });

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

        let update = await Event.findByIdAndUpdate( eventId, { $pull: { 'followers':  {"userId": userId }  } }, 
        { new: true} );
        return update;
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
     * @param status String - "YES", "NO", "MAYBE" are the only allwed values
     * 
     */
    confirmEventAttendance: async( eventId, userId, status ) => {

        return await Event.findOneAndUpdate( { _id: eventId, "invitees.userId": userId }, { $set : { 'invitees.$.accepted' : status }}, { runValidators: true } );
    },


    /**
     * add new invitees to an event
     * @param eventId String
     * @param invitees array
     */
    addInvitees: async( eventId, invitees = [] ) => {

        await Event.bulkWrite(

            payload.map( data => 
              ({
                updateOne: {
                  filter: { '_id': 'eventId', 'invitees.userId' : { $ne: data.key } },
                  update: { $push: { invitees: data } }
                }
              })
            )
        )
    },


    /**
     * Remove an invitee from an event.
     * @param eventId string
     * @param userId string - this could later be the user's email, yet to decide
     */
    removeInvitees: async( eventId, userId ) => {

        let update = await Event.findByIdAndUpdate( eventId, { $pull: { 'invitees':  { "userId": userId }  } }, 
        { new: true} );
        return update;
    },


    /**
     * adds an event to a user's google calendar
     * when a user creates an event | likes an event | follows an event - the event gets added to their google calendar
     * @param eventId
     */
    googleCalendarIntegration: async( eventId ) => {

    }
}