var app = require("../app");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

const UserService = require("@services/user.service");
const UserSeeder = require("@seeders/users.seeder");

describe('Users', () => {

    beforeEach(function (done) { //Before each test we empty the database

        UserService.removeAll().then(() => {
            done();
        })

    });


    describe('GET USERS', () => {

        it('it should GET all users', (done) => {

            chai.request(app)
                .get('/v1/user/')
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.should.have.property('success').eql(true);
                    res.body.data.length.should.be.eql(0);
                    done();

                });
        });
    })

    describe('CREATE USER', () => {

        it('it should create a new user', (done) => {

            let user = UserSeeder.userFactory();

            chai.request(app)
                .post('/v1/user/create')
                .send(user)
                .end((err, res) => {

                    res.should.have.status(201);
                    res.body.data.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    done();
                });
        });
    })

    describe('GET SINGLE USER RESOURCE', () => {

        it('it should GET a single user instance', (done) => {

            let user = UserSeeder.userFactory();

            UserService.createUser(user)
                .then(data => {

                    chai.request(app)
                        .get(`/v1/user/${data._id}`)
                        .end((err, res) => {

                            res.should.have.status(200);
                            res.body.should.have.property('success').eql(true);
                            res.body.data.should.be.a('object');
                            res.body.data.should.have.property('_id');
                            res.body.data.should.have.property('uuid');
                            done();
                        });
                });
        })
    })

    describe('UPDATE SINGLE USER RESOURCE', () => {

        it('it should GET a single user instance by its _id', (done) => {

            let user = UserSeeder.userFactory();

            UserService.createUser(user)
                .then(data => {

                    chai.request(app)
                        .patch(`/v1/user/${data._id}`)
                        .send({
                            publish: true
                        })
                        .end((err, res) => {

                            res.should.have.status(200);
                            res.body.data.should.be.a('object');
                            res.body.data.publish.should.equal(true);
                            res.body.data.should.have.property('updatedAt').not.eql(data.createdAt);

                            done();
                        });
                });
        })
    })

    describe('DELETE SINGLE USER RESOURCE ', () => {

        it('it should DELETE a single user instance', (done) => {

            let user = UserSeeder.userFactory();

            UserService.createUser(user)
                .then(data => {

                    chai.request(app)
                        .delete(`/v1/user/${data._id}`)
                        .end((err, res) => {

                            res.should.have.status(200);
                            res.body.data.should.be.a('object');
                            res.body.should.have.property('success').eql(true);
                            res.body.data.should.have.property('deletedAt').not.eql(null);
                            res.body.data.should.have.property('deletedBy').not.eql(null);
                            done();
                        });
                });
        })
    })

})