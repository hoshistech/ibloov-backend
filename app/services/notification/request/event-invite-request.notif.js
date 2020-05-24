//models
const Notification = require("@models/notification.model");

//services
const { viewRequestById } = require("@services/request.service");

module.exports = { 
    
    notify: async ( requestId ) => {

        const requestInfo = await viewRequestById( requestId );

        const notif = new Notification({

            sender: requestInfo.requesteeId._id,
            type: "request",
            requestcategory: requestInfo.type,
            message: `has invited you to an event.`,
            requestId,
            recepient: requestInfo.accepteeId._id,
            eventId: requestInfo.eventId

        });

        await notif.save();
    },

    /**
     * create bulk notifications for the invitees when an event is created.
     * @param {*} requests 
     */
    notifyBulk: async function( requests ){

        let notifs = [];

        requests.map( request => {

            notif = {

                sender: request.requesteeId,
                type: "request",
                requestcategory: request.type,
                message: `has invited you to an event.`,
                requestId: request._id,
                recepient: request.accepteeId,
                eventId: request.eventId
            }

            notifs.push(notif);
        })

        if( notifs.length > 0 ) await Notification.insertMany(notifs);

        return [];
    }
}