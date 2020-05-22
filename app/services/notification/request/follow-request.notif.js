const Notification = require("@models/notification.model");

//services
const requestService = require("@services/request.service");

module.exports.notify = async ( requestId ) => {

    const requestInfo = await requestService.viewRequestById(requestId);

    const notif = new Notification({

        sender: requestInfo.requesteeId._id,
        type,
        requestcategory: eventCoordinatorRequest,
        message: `has invited you to a coordinator at an event.`,
        requestId,
        recepient: requestInfo.accepteeId._id

    });

    await notif.save();
}