const faker = require('faker');
const moment = require("moment");

const { randomInt } = require("@helpers/number.helper");
const allowedRequestTypes = ["follow-request", 
                                "event-invite-request", 
                                "event-coordinator-request",
                                 "extra-invite-request"];



const { all } = require("@services/user.service");
const eService = require("@services/event.service");
const { createRequest, 
    createEventCoordinatorRequest,
    createEventInviteRequest,
    createExtraInviteRequest } = require("@services/request.service");

//notif
const { userFollowRequestNotif, eventInviteRequestNotif, eventCoordinatorRequestNotif, extraInviteRequestNotif } = require('@services/notification.service');


const seedRequests = async (req, res) => {


    const type = req.query.requesttype || "follow-request";

    if( ! allowedRequestTypes.includes(type)){
        return res.send("invalid request type.")
    }

    let resp = getFactory(type);
    return res.send(resp);
}


const getFactory = async (type) => {

    switch (type) {
        case "follow-request":
            return await followInviteRequestFactory(type);
            break;

        case "event-invite-request":
            return await eventInviteRequestFactory(type);
            break;

        case "event-coordinator-request":
            return await eventCoordinatorRequestFactory(type);
            break;

        case "extra-invite-request":
            return await extraInviteRequestFactory(type);
            break;

        default:
            break;
    }
}



const followInviteRequestFactory =  async ( type ) => {

    const users = await all();

    const requestCount =  randomInt( 1, users.length - 1);

    let userTracker = [];

    const accepteeId = "5eb9d67ba75f18002a4e497d";

    for( let count = 0; count < requestCount; count++){

        let requesteeId = users[ randomInt(0, users.length -1 )]._id.toString();

        if(  ! userTracker.includes( requesteeId ) && requesteeId !== accepteeId ){

            let newRequest = await createRequest(requesteeId, accepteeId, type);
            userFollowRequestNotif(newRequest._id.toString() );

            userTracker.push(requesteeId);
        }
    }

    return userTracker;
}

const eventInviteRequestFactory =  async ( type ) => {

    const users = await all();
    const events = await eService.all();

    const requestCount = randomInt( 3, users.length - 1);

    let userTracker = [];
    let eventTracker = [];

    const accepteeId = "5eb9d67ba75f18002a4e497d";

    for( let count = 0; count < requestCount; count++){

        let requesteeId = users[ randomInt(0, users.length -1 )]._id.toString();
        let eventId = events[ randomInt(0, events.length -1 )]._id.toString();


        if(  ! userTracker.includes( requesteeId ) && requesteeId !== accepteeId ){

            let newRequest = await createEventInviteRequest(requesteeId, accepteeId, eventId );

            console.log("newRequest")
            console.log(newRequest)
            
            await eventInviteRequestNotif( newRequest._id.toString() );

            userTracker.push(requesteeId);
            eventTracker.push(eventId);
            
        }
    }

    return userTracker;
}

const eventCoordinatorRequestFactory =  async ( type ) => {

    const users = await all();
    const events = await eService.all();

    const requestCount =  randomInt( 3, users.length - 1 );

    let userTracker = [];
    let eventTracker = [];

    const accepteeId = "5eb9d67ba75f18002a4e497d";

    for( let count = 0; count < requestCount; count++){


        let requesteeId = users[ randomInt(0, users.length -1 )]._id.toString();
        let eventId = events[ randomInt(0, events.length -1 )]._id.toString();


        if(  ! userTracker.includes( requesteeId ) && requesteeId !== accepteeId ){

            let newRequest = await createEventCoordinatorRequest(requesteeId, accepteeId, eventId);
            eventCoordinatorRequestNotif(newRequest._id.toString() );

            userTracker.push(requesteeId);
            eventTracker.push(eventId);
        }
    }

    return userTracker;
}

const extraInviteRequestFactory =  async ( type ) => {

    const users = await all();
    const events = await eService.all();

    const requestCount =  randomInt( 3, users.length - 1);

    let userTracker = [];
    let eventTracker = [];

    const accepteeId = "5eb9d67ba75f18002a4e497d";

    for( let count = 0; count < requestCount; count++){


        let requesteeId = users[ randomInt(0, users.length -1 )]._id.toString();
        let eventId = events[ randomInt(0, events.length -1 )]._id.toString();


        if(  ! userTracker.includes( requesteeId ) && requesteeId !== accepteeId ){

            let newRequest = await createExtraInviteRequest(requesteeId, accepteeId, eventId );
            extraInviteRequestNotif(newRequest._id.toString() );

            userTracker.push(requesteeId);
            eventTracker.push(eventId);
            
        }
    }

    return userTracker;
}

module.exports = { seedRequests }