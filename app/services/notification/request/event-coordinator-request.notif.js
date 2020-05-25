const Notification = require("@models/notification.model");

module.exports = {
    
    /**
     * creates a single event-coordinator-request notification
     * @param requestId
     */
    notify:  async ( request ) => {

        const notif = new Notification({

            sender: request.requesteeId,
            type: "request",
            requestcategory: request.type,
            message: `has invited you to be a coordinator at an event.`,
            requestId: request._id,
            recepient: request.accepteeId,
            eventId: request.eventId

        });

        await notif.save();
    },

    /**
     * create bulk notifications for event-coordinator-request.
     * @param requests object
     * 
     */
    notifyBulk: async function( requests ){

        let notifs = [];

        requests.map( request => {

            let notif = {

                sender: request.requesteeId,
                type: "request",
                requestcategory: request.type,
                message: `has invited you to be a coordinator at an event.`,
                requestId: request._id,
                recepient: request.accepteeId,
                eventId: request.eventId
            }

            notifs.push(notif);
        })

        if( notifs.length > 0 ) await Notification.insertMany(notifs);
    }

}