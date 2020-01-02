const faker = require('faker');
const { randomInt } = require("@helpers/number.helper");

//models
const User = require("@models/user.model");


const seedUsers = async (req, res) => {

    const userCount = parseInt(req.query.userCount) || randomInt(1, 3);
    const users = [];

    for( let count = 0; count < userCount; count++){

        let user = userFactory();
        users.push(user);
    }

    User.collection.insert( users, function (err, data) {
        if (err){ 
            
            res.status(400).json({
                success: false,
                message: "error generating and saving users",
                data: err
            });

        } 
        
        return  res.status(201).json({
                    success: "true",
                    message: "user generated and saved successfully",
                    data: users
                });
        
    });  
}


const userFactory =  ( ) => {
    
    const user = {

        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        isEmailVerified: false,
        phoneNumber: faker.phone.phoneNumber(),
        isPhoneNumberVerified: false,
        dob: faker.date.past(),
        address: faker.address.streetAddress(),
        uuid: faker.random.uuid(),

        createdAt: new Date,
        updatedAt: new Date
    }

    user.fullName = `${user.firstName} ${user.lastName}`;

    return user;
}

module.exports = { seedUsers }