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
            message: `has requested a +1 to your event.`,
            requestId,
            recepient: requestInfo.accepteeId._id,
            eventId: requestInfo.eventId

        });

        await notif.save();
    }

}