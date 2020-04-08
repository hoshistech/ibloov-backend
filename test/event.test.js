var app = require("../app");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

const EventService = require("@services/event.service");
const EventSeeder = require("@seeders/events.seeder");

describe('Events', () => {

    beforeEach( function(done){ //Before each test we empty the database

        EventService.removeAll().then( () => {
            done();
        })
        
    });


    describe('GET EVENTS', () => {

        it('it should GET all events', (done) => {

            chai.request(app)
                .get('/v1/event/')
                .end(( err, res ) => {

                    res.should.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.should.have.property('success').eql( true );
                    res.body.data.length.should.be.eql(0);
                    done();

                });
        });
    })

    describe('CREATE EVENT', () => {

        it('it should create a new event', (done) => {

            let event = EventSeeder.eventFactory();

            chai.request(app)
            .post('/v1/event/create')
            .send(event)
            .end((err, res) => {

                res.should.have.status(201);
                res.body.data.should.be.a('object');
                res.body.should.have.property('success').eql( true );
                done();
            });
        });
    })

    describe('GET SINGLE EVENT RESOURCE', () => {

        it('it should GET a single event instance by its _id', (done) => {

            let event = EventSeeder.eventFactory();

            EventService.createEvent( event )
            .then( data  => {

                chai.request(app)
                .get(`/v1/event/${data._id}`)
                .end((err, res) => {

                        res.should.have.status(200);
                        res.body.should.have.property('success').eql( true );
                        res.body.data.should.be.a('object');
                        res.body.data.should.have.property('_id');
                        res.body.data.should.have.property('name');
                        res.body.data.should.have.property('uuid');
                        res.body.data.should.have.property('location');
                    done();
                });
            });
        })
    })

    describe('UPDATE SINGLE EVENT RESOURCE', () => {

        it('it should GET a single event instance by its _id', (done) => {

            let event = EventSeeder.eventFactory();

            EventService.createEvent( event )
            .then( data  => {

                chai.request(app)
                .patch(`/v1/event/${data._id}`)
                .send({ publish: true})
                .end((err, res) => {

                        res.should.have.status(200);
                        res.body.data.should.be.a('object');
                        res.body.data.publish.should.equal(true);
                        res.body.data.should.have.property('updatedAt').not.eql( data.createdAt );

                        done();
                });
            });
        })
    })

    describe('DELETE SINGLE EVENT RESOURCE ', () => {

        it('it should DELETE a single event instance', (done) => {

            let event = EventSeeder.eventFactory();

            EventService.createEvent( event )
            .then( data  => {

                chai.request(app)
                .delete(`/v1/event/${data._id}`)
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

    describe('GENERATE EVENT CODE', () => {

        it('it should generate the event code for an event', (done) => {

            chai.request(app)
            .get("/v1/event/code/generate")
            .end((err, res) => {

                res.should.have.status(200);
                res.body.should.have.property('success').eql( true );
                res.body.data.should.be.a('string');
                done();
            });
        })
    })

    describe('FOLLOW AN EVENT ', () => {

        it("it should add a new user to the 'followers' array of the events", (done) => {

            let event = EventSeeder.eventFactory();
            let follower = {
                userId: "316564666875696f3369666a",
                email: "test@test.com",
                telephone: "09039015531"
            }

            EventService.createEvent( event )
            .then( data  => {

                chai.request(app)
                .patch(`/v1/event/follow/${data._id}`)
                .send(follower)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.have.property('success').eql( true );
                    res.body.data.should.be.a('object');
                    res.body.data.followers.should.have.length.above(0);
                    done();
                });
            });
        })
    })

    describe('UNFOLLOW AN EVENT ', () => {

        it("it should remove a user from the followers list on an event", (done) => {

            let event = EventSeeder.eventFactory();
            let follower = {
                userId: "316564666875696f3369666a",
                email: "test@test.com",
                telephone: "09039015531"
            }
            event.followers = follower;

            EventService.createEvent( event )
            .then( data  => {

                chai.request(app)
                .patch(`/v1/event/unfollow/${data._id}`)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.have.property('success').eql( true );
                    res.body.data.followers.should.have.length.eql( [] );
                    res.body.data.should.be.a('object');
                    done();
                });
            });
        })
    })

    describe('MUTE EVENT NOTIFICATION ', () => {

        it("it should mute the event notification for a user", (done) => {

            let event = EventSeeder.eventFactory();
            let follower = {
                userId: "316564666875696f3369666a",
                email: "test@test.com",
                telephone: "09039015531"
            }

            event.followers = follower;

            EventService.createEvent( event )
            .then( data  => {

                chai.request(app)
                .patch(`/v1/event/notifications/mute/${data._id}`)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.have.property('success').eql( true );
                    res.body.data.followers[0].should.have.property('allowNoifications').eql( false );
                    res.body.data.should.be.a('object');
                    done();
                });
            });
        })
    })

    describe('ADD AN INVITE', () => {

        it("it should add a new user to the 'invitees' array of the events", (done) => {

            let event = EventSeeder.eventFactory();
            let invites = [
                {
                    userId: "316564666875696f3369666a",
                    email: "test@test.com",
                    telephone: "09039015531"
                }
            ]

            EventService.createEvent( event )
            .then( data  => {

                chai.request(app)
                .patch(`/v1/event/invite/add/${data._id}`)
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

        it("it should remove a user from the 'invitees' list on an event", (done) => {

            let event = EventSeeder.eventFactory();
            let invites = {
                userId: "316564666875696f3369666a",
                email: "test@test.com",
                telephone: "09039015531"
            }
            event.invitees = [ invites ];

            EventService.createEvent( event )
            .then( data  => {

                chai.request(app)
                .patch(`/v1/event/invite/remove/${data._id}`)
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

    

})



