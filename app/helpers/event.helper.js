
/**
 * adds a new history to an event 
 * @param model object mongoose model instance
 * @param eventName String name of the event
 * @param comment String additional information for the event.
 */
const addHistory = async (model, event, comment = null) => {

    data = {
        event,
        comment,
        createdAt: new Date(),
        userId: "o098uyhjk"
    }

    return await model.findByIdAndUpdate( { _id: eventId } , { '$addToSet': { 'history': data } });
}

module.exports = { addHistory }