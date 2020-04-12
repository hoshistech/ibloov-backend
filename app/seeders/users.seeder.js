const faker = require('faker');
const {
    randomInt
} = require("@helpers/number.helper");
const bcrypt = require('bcryptjs');

//models
const User = require("@models/user.model");


const seedUsers = async (req, res) => {

    const userCount = parseInt(req.query.userCount) || randomInt(1, 3);
    const users = [];

    for (let count = 0; count < userCount; count++) {

        let user = await localUserFactory();
        users.push(user);
    }



    User.collection.insertMany(users, function (err, data) {
        if (err) {

            return res.status(400).json({
                success: false,
                message: "error generating and saving users",
                data: err.toString()
            });

        }

        return res.status(201).json({
            success: "true",
            message: "user generated and saved successfully",
            data: users
        });

    });
}


const localUserFactory = async () => {

    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash( "password", salt);

    let local = {

        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: hash
    }

    let user = {

        authMethod: "local",
        email: faker.internet.email(),
        isEmailVerified: false,
        phoneNumber: faker.phone.phoneNumber(),
        isPhoneNumberVerified: false,
        dob: faker.date.past(),
        address: faker.address.streetAddress(),
        uuid: faker.random.uuid(),
        local

    }

    return user;
}

module.exports = {
    seedUsers,
    localUserFactory
}