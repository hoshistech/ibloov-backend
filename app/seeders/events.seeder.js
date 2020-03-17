const faker = require('faker');
const { randomInt } = require("@helpers/number.helper");

const eventCategory = ["birthday", "cooperate", "wedding", "house party", "sports", "house warming"];

//models
const Event = require("@models/event.model");


const seedEvents = async (req, res) => {

    const eventCount = parseInt(req.query.eventCount) || randomInt(1, 3);
    const eventCodeCountMax = parseInt(req.query.eventCodeCountMax) || randomInt(1, 4);
    const eventCodeCount = randomInt(1, eventCodeCountMax);
    const events = [];

    for( let count = 0; count < eventCount; count++){

        let event = eventFactory(eventCodeCount);
        events.push(event);
    }

    Event.collection.insertMany( events, function (err, data) {
        if (err){ 
            
            res.status(400).json({
                success: false,
                message: "error generating and saving events",
                data: err
            });

        } 
        else {
            res.status(201).json({
                success: "true",
                message: "events generated and saved successfully",
                data: events
            });
        }
    });  
}


const eventFactory =  ( eventCodeCount ) => {

    let eventCode = [];
    let isSameDay = randomInt(0,2);
    let isPrivate = randomInt(1,9) % 2 === 0;
    let eventDay = faker.date.future();
    let createdBy = "89n98nv939nf30";

    for( let i = 0; i < eventCodeCount; i++ ){
        
        code = {
            name: faker.lorem.word(),
            description: faker.lorem.sentence()
        }

        eventCode.push(code);
    }

    const history = {
        event: "EVENT_CREATE",
        comment: `event created by ${createdBy}`,
        createdAt: new Date,
        userId: createdBy
    }
    
    const event = {

        name: `${faker.lorem.word()}${randomInt(1110,9999)}`,
        category: eventCategory[ Math.floor(Math.random() * ( eventCategory.length - 0) + 0) ],
        uuid: faker.random.uuid(),
        startDate: isSameDay ? eventDay : faker.date.future() ,
        endDate: isSameDay ? eventDay : faker.date.future(),
        isPrivate,
        createdBy: createdBy,
        status: "UPCOMING",
        createdAt: new Date,
        updatedAt: new Date,
        eventCode: eventCode,
        hashTags: [`#${faker.lorem.word()}`, `#${faker.lorem.word()}`],
        history: history
    }

    return event;
}

module.exports = { seedEvents }