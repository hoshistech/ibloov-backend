var app = require("../app");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

//services
const UserService = require("@services/user.service");
const UserSeeder = require("@seeders/users.seeder");

//helpers
const modelHelper = require("@helpers/model.helper");

describe('Users', () => {

    beforeEach(function (done) { //Before each test we empty the database

        modelHelper.removeAll( UserService.model ).then(() => {
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

        it('it should create a new user', async (done) => {

            let user = {

                "firstName": "Toks",
                "lastName": "Ojo",
                "email": "test7@test.com",
                "password": "password"
            }

            chai.request(app)
                .post('/v1/user/register')
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

        it('it should GET a single user instance', async (done) => {

            let user = await UserSeeder.localUserFactory();

            UserService.createUser(user)
                .then(data => {

                    chai.request(app)
                        .get(`/v1/user/${data._id}`)
                        .end((err, res) => {

                            res.should.have.status(200);
                            res.body.should.have.property('success').eql(true);
                            res.body.data.should.be.a('object');
                            res.body.data.should.have.property('_id');
                            done();
                        });
                });
        })
    })

    describe('UPDATE SINGLE USER RESOURCE', () => {

        it('it should GET a single user instance', async (done) => {

            let user = await UserSeeder.localUserFactory();

            UserService.createUser(user)
                .then(data => {

                    chai.request(app)
                        .patch(`/v1/user/${data._id}`)
                        .send({
                            authMethod: "google"
                        })
                        .end((err, res) => {

                            res.should.have.status(200);
                            res.body.data.should.be.a('object');
                            res.body.data.authMethod.should.equal("google");
                            res.body.data.should.have.property('updatedAt').not.eql(data.createdAt);

                            done();
                        });
                });
        })
    })

    describe('DELETE SINGLE USER RESOURCE ', () => {

        it('it should DELETE a single user instance', async(done) => {

            let user = await UserSeeder.localUserFactory();

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