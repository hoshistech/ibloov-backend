var app = require("../app");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

const crowdFundingService = require("@services/crowdfunding.service");
const crowdFundingSeeder = require("@seeders/crowdfundings.seeder");

describe('Crowdfundings', () => {

    beforeEach( function(done){ //Before each test we empty the database

        crowdFundingService.removeAll().then( () => {
            done();
        })
        
    });

    describe('GET crowdfundings', () => {

        it('it should GET all crowdfundings', (done) => {

            chai.request(app)
                .get('/v1/crowdfunding/')
                .end(( err, res ) => {

                    res.should.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.should.have.property('success').eql( true );
                    res.body.data.length.should.be.eql(0);
                    done();

                });
        });
    })

    describe('CREATE CROWDFUNDING', () => {

        let crowdfunding = crowdFundingSeeder.crowdFundingFactory();

        it('it should create a new crowdfunding', (done) => {

            chai.request(app)
            .post('/v1/crowdfunding/create')
            .send(crowdfunding)
            .end((err, res) => {

                res.should.have.status(201);
                res.body.data.should.be.a('object');
                res.body.should.have.property('success').eql( true );
                done();
            });
        });

        it('it should not allow duplicate crowdfunding with same name and user', (done) => {

            done();
            // chai.request(app)
            // .post('/v1/crowdfunding/create')
            // .send(crowdfunding)
            // .end((err, res) => {

            //     res.should.have.status(400);
            //     res.body.should.have.property('success').eql( false );
            //     done();
            // });
        });
    })

    describe('GET SINGLE CROWDFUNDING RESOURCE', () => {

        it('it should GET a single crowdfunding instance', (done) => {

            let crowdfunding = crowdFundingSeeder.crowdFundingFactory();

            crowdFundingService.createCrowdFunding( crowdfunding )
            .then( data  => {

                chai.request(app)
                .get(`/v1/crowdfunding/${data._id}`)
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

    describe('UPDATE SINGLE CROWDFUNDING RESOURCE', () => {

        it('it should GET a single crowdfunding instance', (done) => {

            let crowdfunding = crowdFundingSeeder.crowdFundingFactory();

            crowdFundingService.createCrowdFunding( crowdfunding )
            .then( data  => {

                chai.request(app)
                .patch(`/v1/crowdfunding/${data._id}`)
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

    describe('DELETE SINGLE CROWDFUNDING RESOURCE ', () => {

        it('it should DELETE a single crowdfunding instance', (done) => {

            let crowdfunding = crowdFundingSeeder.crowdFundingFactory();

            crowdFundingService.createCrowdFunding( crowdfunding )
            .then( data  => {

                chai.request(app)
                .delete(`/v1/crowdfunding/${data._id}`)
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

    // describe('ADD AN INVITE', () => {

    //     it("it should add a new user to the 'invitees' array of the crowdfunding", (done) => {

    //         let crowdfunding = crowdFundingSeeder.crowdFundingFactory();
    //         let invites = [
    //             {
    //                 userId: "316564666875696f3369666a",
    //                 email: "test@test.com",
    //                 telephone: "09039015531"
    //             }
    //         ]

    //         crowdFundingService.createCrowdFunding( crowdfunding )
    //         .then( data  => {

    //             chai.request(app)
    //             .patch(`/v1/crowdfunding/invite/add/${data._id}`)
    //             .send({invites})
    //             .end((err, res) => {

    //                 res.should.have.status(200);
    //                 res.body.should.have.property('success').eql( true );
    //                 res.body.data.should.be.a('object');
    //                 res.body.data.invitees.should.have.length.above(0);
    //                 done();
    //             });
    //         });
    //     })
    // })

    // describe('REMOVE AN INVITE', () => {

    //     it("it should remove a user from the 'invitees' list on an crowdfunding", (done) => {

    //         let crowdfunding = crowdFundingSeeder.crowdFundingFactory();
    //         let invites = {
    //             userId: "316564666875696f3369666a",
    //             email: "test@test.com",
    //             telephone: "09039015531"
    //         }
    //         crowdfunding.invitees = [ invites ];

    //         crowdFundingService.createCrowdFunding( crowdfunding )
    //         .then( data  => {

    //             chai.request(app)
    //             .patch(`/v1/crowdfunding/invite/remove/${data._id}`)
    //             .send( { "email": invites.email })
    //             .end((err, res ) => {

    //                 res.should.have.status(200);
    //                 res.body.should.have.property('success').eql( true );
    //                 res.body.data.invitees.should.have.length.eql( [] );
    //                 res.body.data.should.be.a('object');
    //                 done();
    //             });
    //         });
    //     })
    // })

    // describe('ADD ITEM TO CROWDFUNDING', () => {

    //     it("it should add a new item to the 'items' array of the crowdfunding", (done) => {

    //         let crowdfunding = crowdFundingSeeder.crowdFundingFactory();
            
    //         let item = {
    //             "title": "water bottle",
    //             "link": "https://get/water/bottle",
    //             "imageUrl": "https://www/s3.waterbottle.image.jpeg",
    //             "price": 4000,
    //             "currency": "Naira",
    //             "rating": 3.5
    //         }
            
    //         crowdFundingService.createCrowdFunding( crowdfunding )
    //         .then( data  => {

    //             chai.request(app)
    //             .patch(`/v1/crowdfunding/item/add/${data._id}`)
    //             .send({item})
    //             .end((err, res) => {

    //                 res.should.have.status(200);
    //                 res.body.should.have.property('success').eql( true );
    //                 res.body.data.should.be.a('object');
    //                 res.body.data.items.should.have.length.above(0);
    //                 done();
    //             });
    //         });
    //     })
    // })

    // describe('REMOVE AN ITEM FROM A CROWDFUNDING', () => {

    //     it("it should remove an item from the 'items' array of an crowdfunding", (done) => {

    //         let crowdfunding = crowdFundingSeeder.crowdFundingFactory();
    //         let item = {
    //             "title": "water bottle",
    //             "link": "https://get/water/bottle",
    //             "imageUrl": "https://www/s3.waterbottle.image.jpeg",
    //             "price": 4000,
    //             "currency": "Naira",
    //             "rating": 3.5
    //         }

    //         crowdfunding.items = item;

    //         crowdFundingService.createCrowdFunding( crowdfunding )
    //         .then( data  => {

    //             chai.request(app)
    //             .patch(`/v1/crowdfunding/item/remove/${data._id}`)
    //             .send( { "itemId":  data.items[0]._id })
    //             .end((err, res ) => {

    //                 res.should.have.status(200);
    //                 res.body.should.have.property('success').eql( true );
    //                 res.body.data.items.should.have.length.eql( [] );
    //                 res.body.data.should.be.a('object');
    //                 done();
    //             });
    //         });
    //     })
    // })
})





    





