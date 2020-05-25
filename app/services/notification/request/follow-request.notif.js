const Notification = require("@models/notification.model");

module.exports.notify = async ( request ) => {

    const notif = new Notification({ 

        sender: request.requesteeId,
        type: "request",
        requestcategory: request.type,
        message: `would like to be your friend.`,
        requestId: request._id,
        recepient: request.accepteeId

    });

    await notif.save();
}