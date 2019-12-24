const Event = require('@models/event.model');

module.exports = {


    /**
     * returns al evetns given certain parameters
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
     * performs a softDelete operation on a single instance of a model
     * @param eventId integer
     *
     */
    softDeleteEvent: async (eventId) => {

        const updateData = {deletedAt: Date.now(), deletedBy: '1edfhuio3ifj'};
        return await module.exports.updateEvent(eventId, updateData);
        
    },


    //helpers
    /**
     * updates an event instance -  addsa a new audit history to the event document
     * @param eventId String - the unique identifier of the event.
     * @param event string - the name of the event e.g create, delete etc.
     */
    addEventHistory: async (eventId, event) => {

        data = {
            event,
            createdAt: new Date(),
            comment: "new event history",
            userId: "o098uyhjk"
        }

        return await Event.findByIdAndUpdate( { _id: eventId } , { '$addToSet': { 'history': data } });

    }
}