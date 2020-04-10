const faker = require('faker');
const { randomInt } = require("@helpers/number.helper");

const influencerCategory = ["birthday", "cooperate", "wedding", "house party", "sports", "house warming"];

//models
const Influencer = require("@models/influencer.model");


const seedInfluencers = async (req, res) => {

    const influencerCount = parseInt(req.query.influencerCount) || randomInt(1, 3);
    const influencerCodeCountMax = parseInt(req.query.influencerCodeCountMax) || randomInt(1, 4);
    const influencerCodeCount = randomInt(1, influencerCodeCountMax);
    const influencers = [];

    for( let count = 0; count < influencerCount; count++){

        let influencer = influencerFactory(influencerCodeCount);
        influencers.push(influencer);
    }

    Influencer.collection.insertMany( influencers, function (err, data) {
        if (err){ 
            
            res.status(400).json({
                success: false,
                message: "error generating and saving influencers",
                data: err
            });

        } 
        else {
            res.status(201).json({
                success: "true",
                message: "influencers generated and saved successfully",
                data: influencers
            });
        }
    });  
}


const influencerFactory =  ( influencerCodeCount ) => {

    let influencerCode = [];

    // for( let i = 0; i < influencerCodeCount; i++ ){
        
    //     code = {
    //         name: faker.lorem.word(),
    //         description: faker.lorem.sentence()
    //     }

    //     influencerCode.push(code);
    // }

    // const history = {
    //     influencer: "EVENT_CREATE",
    //     comment: `influencer created by ${createdBy}`,
    //     createdAt: new Date,
    //     userId: createdBy
    // }

    const user = {
        
        id: faker.lorem.word(),
        fullName: `${faker.name.lastName()} ${faker.name.firstName()} `,
        email: faker.internet.email(),
        phoneNumber: faker.phone.phoneNumber()
    };
    
    const influencer = {

        user,
        category: influencerCategory[ randomInt(0, influencerCategory.length)],
        fee: randomInt(30000, 100000 ),
        isVerified: false,
        verifiedDate: null,
        createdAt: new Date,
        updatedAt: new Date,

    }

    return influencer;
}

module.exports = { seedInfluencers }