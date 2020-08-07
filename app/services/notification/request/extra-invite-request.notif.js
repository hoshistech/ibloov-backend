const Notification = require("@models/notification.model");

module.exports = {

    notify: async ( request ) => {

        const notif = new Notification({

            sender: request.requesteeId,
            type: "request",
            requestcategory: request.type,
            message: `has requested a +1 to your event.`,
            requestId: request._id,
            recepient: request.accepteeId,
            eventId: request.eventId

        });

        await notif.save();
    }

}