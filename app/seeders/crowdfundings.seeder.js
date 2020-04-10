const faker = require('faker');
const { randomInt } = require("@helpers/number.helper");

const crowdFundingCategory = ["birthday", "cooperate", "wedding", "house party", "sports"];

//models
const CrowdFunding = require("@models/crowdFunding.model");


const seedCrowdFundings = async (req, res) => {

    crowdFundingCode =  [];

    const crowdFundingCount = parseInt(req.query.crowdFundingCount) || randomInt(1, 3);
    const crowdFundingDonorCountMax = parseInt(req.query.crowdFundingDonorCountMax) || randomInt(1, 4);
    const crowdFundingDonorCount = randomInt(1, crowdFundingDonorCountMax);
    const crowdFundings = [];

    for( let count = 0; count < crowdFundingCount; count++){

        let crowdFunding = crowdFundingFactory(crowdFundingDonorCount);
        crowdFundings.push(crowdFunding);
    }

    CrowdFunding.collection.insert( crowdFundings, function (err, data) {
        if (err){ 
            
            res.status(400).json({
                success: false,
                message: "error generating and saving crowdFundings",
                data: err
            });

        } 
        else {
            res.status(201).json({
                success: "true",
                message: "crowdFundings generated and saved successfully",
                data: crowdFundings
            });
        }
    });  
}


const crowdFundingFactory =  ( crowdFundingDonorCount ) => {

    const createdBy = "316564666875696f3369666a";
    let donors = [];

    for( let i = 0; i < crowdFundingDonorCount; i++ ){
        
        donor = {

            name: faker.lorem.word(),
            userId: faker.lorem.word(),
            email: faker.internet.exampleEmail(),
            pledge: faker.random.number(),
            date: new Date
        }

        donors.push(donor);
    }

    const history = {
        crowdFunding: "EVENT_CREATE",
        comment: `crowdFunding created by ${createdBy}`,
        createdAt: new Date,
        userId: createdBy   
    }
    
    const crowdFunding = {

        name: faker.lorem.word(),
        amount: faker.random.number(),
        isPrivate: true,
        dueDate: faker.date.future(),
        uuid: faker.random.uuid(),
        createdAt: new Date,
        updatedAt: new Date,
        createdBy: createdBy,
        donors,
        history
    }

    return crowdFunding;
}

module.exports = { seedCrowdFundings, crowdFundingFactory }