const faker = require('faker');
const { randomInt } = require("@helpers/number.helper");

//models
const Wishlist = require("@models/wishlist.model");

const seedWishlists = async (req, res) => {

    const wishlistCount = parseInt(req.query.wishlistCount) || randomInt(1, 3);
    const itemCount = parseInt(req.query.itemCount) || randomInt(1, 3);
    const wishlists = [];

    for( let count = 0; count < wishlistCount; count++){

        let wishlist = wishlistFactory(itemCount);
        wishlists.push(wishlist);
    }

    Wishlist.collection.insert( wishlists, function (err, data) {
        if (err){ 
            
            res.status(400).json({
                success: false,
                message: "error generating and saving wishlists",
                data: err
            });
        } 
        else {
            res.status(201).json({
                success: "true",
                message: "wishlist generated and saved successfully",
                data: wishlists
            });
        }
    });  
}


const wishlistFactory = ( itemcount ) => {

    const createdBy = "316564666875696f3369666a";
    const items = [];

    const history = {
        event: "WISHLIST_CREATE",
        comment: `wishlist created by ${createdBy}`,
        createdAt: new Date,
        userId: createdBy
    }

    for( let i = 0; i < itemcount; i++ ){

        item = {

            title: faker.lorem.word(),
            quantity: faker.random.number(),
            link: faker.internet.url(),
            imageUrl: faker.image.imageUrl() ,
            price:  parseFloat( randomInt(1000, 10000) ),
            rating: randomInt(1, 5),
            desciption: faker.lorem.sentence()
        }

        items.push(item);
    }

    let wishlist = {

        name: faker.lorem.word(),
        uuid: faker.random.uuid(),
        createdBy: createdBy,
        createdAt: new Date,
        updatedAt: new Date,
        history: history,
        items
    }

    return wishlist;
}

module.exports = { seedWishlists, wishlistFactory }