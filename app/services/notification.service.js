//Model
const Notification = require("@models/notification.model");


const requestType = 'request';
const infoType = 'info';

const followRequest = "follow-request";
const extraInviteRequest = 'extra-invite-request';
const eventInviteRequest = 'event-invite-request';


//helpers
const { setDefaultOptions  } = require('@helpers/request.helper');


//services
const requestService = require("@services/request.service");

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
        .populate("requestId", "_id accepted")
        .populate("sender", "_id avatar authMethod local.firstName local.lastName fullName")
        .populate("eventId", "_id name")
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

            sender: requestInfo.requesteeId._id,
            type: requestType,
            requestcategory: followRequest,
            message: `has requested to be your friend.`,
            requestId,
            recepient: requestInfo.accepteeId._id

        });

        await notif.save();
    },


    eventInviteRequestNotif: async ( requestId ) => {

        const requestInfo = await requestService.viewRequestById(requestId);

        const notif = new Notification({

            sender: requestInfo.requesteeId._id,
            type: requestType,
            requestcategory: eventInviteRequest,
            message: `has invited you to his event.`,
            requestId,
            recepient: requestInfo.accepteeId._id,
            eventId: requestInfo.eventId

        });

        await notif.save();
    },


    /**
     * create bulk notifications to all invitees when an event is created.
     */
    eventInviteBulkRequestNotif: async ( event ) => {

        const requests = await requestService.createEventInviteRequestBulk(event);
        let notifs = [];

        requests.map( request => {

            notif = {

                sender: request.requesteeId,
                type: requestType,
                requestcategory: eventInviteRequest,
                message: `has invited you to an event.`,
                requestId: request._id,
                recepient: request.accepteeId,
                eventId: request.eventId
            }

            notifs.push(notif);
        })

        if( notifs.length > 0 ){
            await Notification.insertMany(notifs);
        }
    }

}

