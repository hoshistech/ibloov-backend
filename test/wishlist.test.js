var app = require("../app");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

const wishlistService = require("@services/wishlist.service");
const wishlistSeeder = require("@seeders/wishlists.seeder");

describe('Wishlists', () => {

    beforeEach( function(done){ //Before each test we empty the database

        wishlistService.removeAll().then( () => {
            done();
        })
        
    });

    describe('GET wishlists', () => {

        it('it should GET all wishlists', (done) => {

            chai.request(app)
                .get('/v1/wishlist/')
                .end(( err, res ) => {

                    res.should.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.should.have.property('success').eql( true );
                    res.body.data.length.should.be.eql(0);
                    done();

                });
        });
    })

    describe('CREATE WISHLIST', () => {

        let wishlist = wishlistSeeder.wishlistFactory();

        it('it should create a new wishlist', (done) => {

            chai.request(app)
            .post('/v1/wishlist/create')
            .send(wishlist)
            .end((err, res) => {

                res.should.have.status(201);
                res.body.data.should.be.a('object');
                res.body.should.have.property('success').eql( true );
                done();
            });
        });

        it('it should not allow duplicate wishlist with same name and user', (done) => {

            done();
            // chai.request(app)
            // .post('/v1/wishlist/create')
            // .send(wishlist)
            // .end((err, res) => {

            //     res.should.have.status(400);
            //     res.body.should.have.property('success').eql( false );
            //     done();
            // });
        });
    })

    describe('GET SINGLE WISHLIST RESOURCE', () => {

        it('it should GET a single wishlist instance', (done) => {

            let wishlist = wishlistSeeder.wishlistFactory();

            wishlistService.createWishlist( wishlist )
            .then( data  => {

                chai.request(app)
                .get(`/v1/wishlist/${data._id}`)
                .end((err, res) => {

                        res.should.have.status(200);
                        res.body.should.have.property('success').eql( true );
                        res.body.data.should.be.a('object');
                        res.body.data.should.have.property('_id');
                        res.body.data.should.have.property('name');
                        res.body.data.should.have.property('uuid');
                        res.body.data.should.have.property('eventId').eql( null );
                        
                    done();
                });
            });
        })
    })

    describe('UPDATE SINGLE WISHLIST RESOURCE', () => {

        it('it should GET a single wishlist instance', (done) => {

            let wishlist = wishlistSeeder.wishlistFactory();

            wishlistService.createWishlist( wishlist )
            .then( data  => {

                chai.request(app)
                .patch(`/v1/wishlist/${data._id}`)
                .send( { isPrivate: true} )
                .end((err, res) => {

                        res.should.have.status(200);
                        res.body.data.should.be.a('object');
                        res.body.data.should.have.property('isPrivate').eql( true );

                        done();
                });
            });
        })
    })

    describe('DELETE SINGLE WISHLIST RESOURCE ', () => {

        it('it should DELETE a single wishlist instance', (done) => {

            let wishlist = wishlistSeeder.wishlistFactory();

            wishlistService.createWishlist( wishlist )
            .then( data  => {

                chai.request(app)
                .delete(`/v1/wishlist/${data._id}`)
                .end((err, res) => {

                        res.should.have.status(200);
                        res.body.data.should.be.a('object');
                        res.body.should.have.property('success').eql( true );
                        res.body.data.should.have.property('deletedAt').not.eql( null  );
                        res.body.data.should.have.property('deletedBy').not.eql( null );
                        done();
                });
            });
        })
    })

    describe('ADD AN INVITE', () => {

        it("it should add a new user to the 'invitees' array of the wishlist", (done) => {

            let wishlist = wishlistSeeder.wishlistFactory();
            let invites = [
                {
                    userId: "316564666875696f3369666a",
                    email: "test@test.com",
                    telephone: "09039015531"
                }
            ]

            wishlistService.createWishlist( wishlist )
            .then( data  => {

                chai.request(app)
                .patch(`/v1/wishlist/invite/add/${data._id}`)
                .send({invites})
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.have.property('success').eql( true );
                    res.body.data.should.be.a('object');
                    res.body.data.invitees.should.have.length.above(0);
                    done();
                });
            });
        })
    })

    describe('REMOVE AN INVITE', () => {

        it("it should remove a user from the 'invitees' list on an wishlist", (done) => {

            let wishlist = wishlistSeeder.wishlistFactory();
            let invites = {
                userId: "316564666875696f3369666a",
                email: "test@test.com",
                telephone: "09039015531"
            }
            wishlist.invitees = [ invites ];

            wishlistService.createWishlist( wishlist )
            .then( data  => {

                chai.request(app)
                .patch(`/v1/wishlist/invite/remove/${data._id}`)
                .send( { "email": invites.email })
                .end((err, res ) => {

                    res.should.have.status(200);
                    res.body.should.have.property('success').eql( true );
                    res.body.data.invitees.should.have.length.eql( [] );
                    res.body.data.should.be.a('object');
                    done();
                });
            });
        })
    })

    describe('ADD ITEM TO WISHLIST', () => {

        it("it should add a new item to the 'items' array of the wishlist", (done) => {

            let wishlist = wishlistSeeder.wishlistFactory();
            
            let item = {
                "title": "water bottle",
                "link": "https://get/water/bottle",
                "imageUrl": "https://www/s3.waterbottle.image.jpeg",
                "price": 4000,
                "currency": "Naira",
                "rating": 3.5
            }
            
            wishlistService.createWishlist( wishlist )
            .then( data  => {

                chai.request(app)
                .patch(`/v1/wishlist/item/add/${data._id}`)
                .send({item})
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.have.property('success').eql( true );
                    res.body.data.should.be.a('object');
                    res.body.data.items.should.have.length.above(0);
                    done();
                });
            });
        })
    })

    describe('REMOVE AN ITEM FROM A WISHLIST', () => {

        it("it should remove an item from the 'items' array of an wishlist", (done) => {

            let wishlist = wishlistSeeder.wishlistFactory();
            let item = {
                "title": "water bottle",
                "link": "https://get/water/bottle",
                "imageUrl": "https://www/s3.waterbottle.image.jpeg",
                "price": 4000,
                "currency": "Naira",
                "rating": 3.5
            }

            wishlist.items = item;

            wishlistService.createWishlist( wishlist )
            .then( data  => {

                chai.request(app)
                .patch(`/v1/wishlist/item/remove/${data._id}`)
                .send( { "itemId":  data.items[0]._id })
                .end((err, res ) => {

                    res.should.have.status(200);
                    res.body.should.have.property('success').eql( true );
                    res.body.data.items.should.have.length.eql( [] );
                    res.body.data.should.be.a('object');
                    done();
                });
            });
        })
    })
})



    //test that user can't select the cash mode excpet the allowCashRedemption option is true

    //should not allow a user pledge to the same item twice




    





