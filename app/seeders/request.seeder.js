const Request = require('@models/request.model');
const Notification = require("@models/notification.model");

const { randomInt } = require("@helpers/number.helper");
const allowedRequestTypes = ["follow-request", 
                                "event-invite-request", 
                                "event-coordinator-request",
                                 "extra-invite-request"];



const { all } = require("@services/user.service");
const eService = require("@services/event.service");

//request types
const eventCooridnatorRequest = require("@user-request/event-coordinator.request");
const followRequest = require("@user-request/follow.request");
const eventInviteRequest = require("@user-request/event-invite.request");
const extraInviteRequest = require("@user-request/extra-invite.request");


const seedRequests = async (req, res) => {


    const type = req.query.requesttype || "follow-request";
    const userId = req.query.userId || "5eb9d67ba75f18002a4e497d";

    /** very important  */
    /** remove this before going live */
    await Request.deleteMany({ type, "accepteeId": userId });
    await Notification.deleteMany({ "requestcategory": type, "recepient": "5eb9d67ba75f18002a4e497d" });

    if( ! allowedRequestTypes.includes(type)){
        return res.send("invalid request type.")
    }

    let resp = getFactory(type, userId );
    return res.send(resp);
}


const getFactory = async (type, userId) => {

    switch (type) {

        case "follow-request":
            return await followInviteRequestFactory(userId);
            break;

        case "event-invite-request":
            return await eventInviteRequestFactory(userId);
            break;

        case "event-coordinator-request":
            return await eventCoordinatorRequestFactory(userId);
            break;

        case "extra-invite-request":
            return await extraInviteRequestFactory(userId);
            break;

        default:
            break;
    }
}


/**
 * create a request of type follow-request
 * @param {*} userId 
 * 
 */
const followInviteRequestFactory =  async ( userId ) => {

    const users = await all();

    const requestCount =  randomInt( 1, users.length - 1);

    let userTracker = [];

    const accepteeId = userId;

    for( let count = 0; count < requestCount; count++){

        let requesteeId = users[ randomInt(0, users.length -1 )]._id.toString();

        if(  ! userTracker.includes( requesteeId ) && requesteeId !== accepteeId ){

            await followRequest.createFollowRequest( requesteeId, accepteeId );
            userTracker.push(requesteeId);
        }
    }

    return userTracker;
}


/**
 * create a request of type event-invite-request
 * @param {*} userId 
 * 
 */
const eventInviteRequestFactory = async ( userId ) => {

    const users = await all();
    const events = await eService.all();

    const requestCount = randomInt( 3, users.length - 1);

    let userTracker = [];
    let eventTracker = [];

    const accepteeId = userId;

    for( let count = 0; count < requestCount; count++){

        let requesteeId = users[ randomInt(0, users.length -1 )]._id.toString();
        let eventId = events[ randomInt(0, events.length -1 )]._id.toString();


        if(  ! userTracker.includes( requesteeId ) && requesteeId !== accepteeId ){

            await eventInviteRequest.createExtraInviteRequest(requesteeId, accepteeId, eventId );

            userTracker.push(requesteeId);
            eventTracker.push(eventId);
            
        }
    }

    return userTracker;
}


/**
 * create a event-coordinator-request
 * 
 */
const eventCoordinatorRequestFactory =  async ( userId ) => {

    const users = await all();
    const events = await eService.all();

    const requestCount =  randomInt( 3, users.length - 1 );

    let userTracker = [];
    let eventTracker = [];

    const accepteeId = userId;

    for( let count = 0; count < requestCount; count++){


        let requesteeId = users[ randomInt(0, users.length -1 )]._id.toString();
        let eventId = events[ randomInt(0, events.length -1 )]._id.toString();


        if(  ! userTracker.includes( requesteeId ) && requesteeId !== accepteeId ){

            await eventCooridnatorRequest.createEventCoordinatorRequest( requesteeId, accepteeId, eventId );

            userTracker.push(requesteeId);
            eventTracker.push(eventId);
        }
    }

    return userTracker;
}


/**
 * create a extra-invite-request
 * 
 */
const extraInviteRequestFactory =  async ( userId ) => {

    const users = await all();
    const events = await eService.all();

    const requestCount =  randomInt( 3, users.length - 1);

    let userTracker = [];
    let eventTracker = [];

    const accepteeId = userId;

    for( let count = 0; count < requestCount; count++){


        let requesteeId = users[ randomInt(0, users.length -1 )]._id.toString();
        let eventId = events[ randomInt(0, events.length -1 )]._id.toString();


        if(  ! userTracker.includes( requesteeId ) && requesteeId !== accepteeId ){

            await extraInviteRequest.createExtraInviteRequest(requesteeId, accepteeId, eventId );

            userTracker.push(requesteeId);
            eventTracker.push(eventId);
            
        }
    }

    return userTracker;
}

module.exports = { seedRequests }