const faker = require('faker');
const moment = require("moment");

//providers
const { geocode } = require("@providers/location/node-geocoder.provider")

const { randomInt } = require("@helpers/number.helper");
const eventCategory = ["party", "birthday", "cooperate", "wedding", "houseparty", "sport", "movies"];
const currencies = ["NGN", "USD", "GBP", "CAD"];

const locations = [ { address: "259 Etim Iyang Crescent, Vi. Lagos." }, 
                        {address: "2 Popoola Banjoko Street, Gbagada."}, 
                        {address: "11, Association avenue, Shangisha. Magodod"}, 
                        { address: "paris, Italy"},
                        { address: "30 Mobolaji Bank Anthony Way, Maryland 021189, Ikeja"},
                        { address: "Via Stella, 22, 41121 Modena MO, Italy"},
                        { address: "Piazza Risorgimento, 4, 12051 Alba CN, Italy"},
                        { address: "Parc des Buttes Chaumont, 2 avenue des Cascades, 75019 Paris"},
                        { address: "30 Rue René Boulanger, 75010 Paris"},
                        { address: "17 Calvert Avenue, E2 7JP"},
                        { address: "332 Bethnal Green Rd, E2 0AG"},
                        { address: "297 Grant Avenue, Auburn NY 13021"},
                        { address: "9 Caledonian Rd, London N1 9DX"},
                        { address: "180 North King Street, Northhampton MA 1060"},
                        { address: "777 Brockton Avenue, Abington MA 2351"},
                        { address: "1537 Hwy 231 South, Ozark AL 36360"},
                        { address: "Tokyo, Meguro, Mita 1-13-3 Yebisu Garden Place"},
                        { address: "7855 Moffett Rd, Semmes AL 36575"},
                        { address: "Tokyo, Shibuya, Ebisu 1-7-4"},
                        { address: "8650 Madison Blvd, Madison AL 35758"},
                        { address: "2453 2Nd Avenue East, Oneonta AL 35121  205-625-647"}
                     ]

//services
const { all } = require("@services/user.service");
const { createEvent } = require("@services/event.service");

//notif
const { createEventInviteBulkRequest } = require('@user-request/event-invite.request');


const seedEvents = async (req, res) => {

    const eventCount = parseInt( req.query.eventCount ) || randomInt(150, 300);
    
    const users = await all();

    for( let count = 0; count < eventCount; count++){

        let event = eventFactory();

        event.userId = users[ randomInt(0, users.length -1 )]._id;
        event.invitees = getInvitees(users, event.userId);
        event.followers = getFollowers(users);

        let geoCode = await geocode( event.address );

        event.location = {
            address: geoCode[0].formattedAddress,
            city: geoCode[0].city,
            coordinates: [ geoCode[0].longitude, geoCode[0].latitude ]
        }

        let newEvent =  await createEvent(event);
        createEventInviteBulkRequest( newEvent );
    }

    res.send("done");
}


const getInvitees = ( users, creator ) => {

    let idMonitor = [];
    let inviteesCount = randomInt(5, 15);
    let invitees = [];

    for( let c = 0; c < inviteesCount; c++){

        let inviteId = users[ randomInt(0, users.length -1 )]._id;
        if( ! idMonitor.includes(inviteId) && inviteId !== creator ){

            let invite = {
                userId: inviteId
            };

            invitees.push(invite);
            idMonitor.push(inviteId);
        }
    }

    return invitees;
}


const getFollowers = ( users ) => {

    let idMonitor = [];
    let followersCount = randomInt(5, 15);
    let followers = [];

    for( let c = 0; c < followersCount; c++){

        let followerId = users[ randomInt(0, users.length -1 )]._id;
        if( ! idMonitor.includes(followerId)  ){

            let follower = {
                userId: followerId
            };

            followers.push(follower);
            idMonitor.push(followerId);
        }
    }

    return followers;
}


const eventFactory =  () => {

    let isPrivate = randomInt(1, 9) % 2 === 0;
    
    const isPaid = randomInt(1, 9) % 2 === 0;
    const amount = isPaid ? randomInt(1000, 10000) : null
    
    const event = {

        name: `${faker.lorem.word()}${randomInt(1110,9999)}`,
        category: eventCategory[ randomInt( 0, eventCategory.length - 1) ],
        description: `${faker.lorem.paragraph() }`,
        address: locations[ randomInt( 0, locations.length - 1) ],
        uuid: faker.random.uuid(),
        startDate: moment().add( randomInt( 0, 7), 'd').toDate() ,
        isPrivate,
        isPaid,
        amount,
        currency: currencies[ randomInt( 0, currencies.length - 1) ], 
        status: "UPCOMING",
        createdAt: new Date,
        updatedAt: new Date,
        hashTags: [`#${faker.lorem.word()}`, `#${faker.lorem.word()}`],
        images: [
            { url: "https://picsum.photos/200/300" }
        ]
    }

    return event;
}

module.exports = { seedEvents, eventFactory }