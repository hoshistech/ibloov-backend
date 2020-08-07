//models
const Notification = require("@models/notification.model");

module.exports.notify = async( sender, recepient, eventId ) => {

        const notif = new Notification({

            sender,
            type: "info",
            message: `followed your event.`,
            recepient,
            eventId
        });

        await notif.save();
}