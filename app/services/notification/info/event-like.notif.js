//models
const Notification = require("@models/notification.model");

module.exports.eventLikedNotification = async( sender, recepient, eventId ) => {

    const notif = new Notification({ 

        sender,
        type: "info",
        message: `liked your event.`,
        recepient,
        eventId
    });

    await notif.save();
}