//models
const Notification = require("@models/notification.model");

module.exports.followAcceptNotification = async( sender, recepient ) => {

    const notif = new Notification({ 

        sender,
        type: "info",
        message: `You are now friends with`,
        recepient
    });

    await notif.save();
}