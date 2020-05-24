const Notification = require("@models/notification.model");

//services
const requestService = require("@services/request.service");

module.exports.notify = async ( requestId ) => {

    const requestInfo = await requestService.viewRequestById(requestId);

    const notif = new Notification({

        sender: requestInfo.requesteeId._id,
        type: "request",
        requestcategory: requestInfo.type,
        message: `would like to be your friend.`,
        requestId,
        recepient: requestInfo.accepteeId._id

    });

    await notif.save();
}