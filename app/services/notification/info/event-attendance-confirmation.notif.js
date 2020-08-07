//models
const Notification = require("@models/notification.model");

module.exports.eventAttendanceConfirmationNotification = async( sender, recepient, eventId ) => {

        const notif = new Notification({

            sender,
            type: "info",
            message: `would be attending your event.`,
            recepient,
            eventId
        });

        await notif.save(); 
}