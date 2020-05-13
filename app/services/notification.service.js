//Model
const Notification = require("@models/notification.model");


const requestType = 'request';
const infoType = 'info';

const followRequest = "follow-request";
const extraInviteRequest = 'extra-invite-request';


//helpers
const { setDefaultOptions  } = require('@helpers/request.helper');


//services
const requestService = require("@services/followrequest.service");

module.exports = {


    getUserNotifications: async ( userId ) => {

        let sort = {};
        options = setDefaultOptions();
        
        const { limit, skip, sortBy, orderBy } = options;
        sort[ sortBy ] = orderBy;

        return await Notification.find({

            $or: [
                { recepient: userId },
                { "recepient": { $elemMatch: { userId } }  }
            ]
        })
        .select("-recepient") //dont send the recepient along with the result
        .sort(sort)
        .limit(limit)
        .skip(skip);
    },


    //EVENT NOTIFS 

    eventAttendanceNotif( fullname, eventName ){

        const notif = new Notification({

            sender: "internal",
            type: "event-attendance-confirmation",
            message: `${fullname} is attending your event ${eventName}`
        });

        notif.save();
    },

    eventLikeNotif: async() => {

    },

    eventFollowNotif: ( ) => {

    },



    //USER NOTIFS

    userFollowRequestRequestNotif: async ( requestId ) => {

        const requestInfo = await requestService.viewRequestById(requestId);

        const notif = new Notification({

            sender: {
                fullName: requestInfo.requesteeId.fullName,
                _id: requestInfo.requesteeId._id,
                avatar: requestInfo.requesteeId.avatar
            },
            type: requestType,
            requestcategory: followRequest,
            message: `has requested to be your friend.`,
            requestId,
            recepient: requestInfo.accepteeId._id

        });

        await notif.save();
    }

}