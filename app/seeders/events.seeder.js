const faker = require('faker');
const moment = require("moment");

const { randomInt } = require("@helpers/number.helper");
const eventCategory = ["party", "birthday", "cooperate", "wedding", "houseparty", "sport", "movies"];
const currencies = ["NGN", "USD", "GBP", "CAD"];

const locations = [ { address: "lagos, `Nigeria" }, 
                        {address: "abuja, `Nigeria"}, 
                        { address: "paris, Italy"},
                        { address: "Johannesburg, SouthAfrica"},
                        { address: "123B southPark, Miwe. Malawi"},
                        { address: "5th Avenuw, Ringroad. Newyork. US"},
                        { address: "kante road, Accra. Ghana"},
                        { address: "121 Worcester Rd, Framingham MA 1701"},
                        { address: "337 Russell St, Hadley MA 1035"},
                        { address: "262 Swansea Mall Dr, Swansea MA 2777"},
                        { address: "297 Grant Avenue, Auburn NY 13021"},
                        { address: "30 Catskill, Catskill NY 12414"},
                        { address: "180 North King Street, Northhampton MA 1060"},
                        { address: "777 Brockton Avenue, Abington MA 2351"},
                        { address: "1537 Hwy 231 South, Ozark AL 36360"},
                        { address: "165 Vaughan Ln, Pell City AL 35125"},
                        { address: "7855 Moffett Rd, Semmes AL 36575"},
                        { address: "1420 Us 231 South, Troy AL 36081"},
                        { address: "8650 Madison Blvd, Madison AL 35758"},
                        { address: "2453 2Nd Avenue East, Oneonta AL 35121  205-625-647"}
                     ]

//services
const { all } = require("@services/user.service");
const { createEvent } = require("@services/event.service");

//notif
const { createEventInviteBulkRequest } = require('@user-request/event-invite.request');


const seedEvents = async (req, res) => {

    const eventCount = parseInt( req.query.eventCount ) || randomInt(50, 100);
    
    const users = await all();

    for( let count = 0; count < eventCount; count++){

        let event = eventFactory();

        event.userId = users[ randomInt(0, users.length -1 )]._id;
        event.invitees = getInvitees(users, event.userId);
        event.followers = getFollowers(users);
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
        location: locations[ randomInt( 0, locations.length - 1) ],
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
    }

    return event;
}

module.exports = { seedEvents, eventFactory }