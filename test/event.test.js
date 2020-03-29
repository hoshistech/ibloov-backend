require('module-alias/register');


var should = require("should");
var assert = require("assert");
var request = require("supertest");
var app = require("../app");

const EventSeeder = require("@seeders/events.seeder");

describe( "Events", () => {

    describe("GET Events", () => {

        it("should return a list of events", (done) => {

            request(app)
            .get("/v1/event")
            .end(function(err, res){

                res.status.should.equal(200);
                res.body.success.should.equal(true);
                done();
            });
        })
    })

    // describe("POST Event", () => {

    //     it("should create a new event", (done) => {

    //         let event = EventSeeder.eventFactory();
    //         console.log(event);

    //         request(app)
    //         .post("/v1/event/create")
    //         .send( event )
    //         .end(function(err, res){

    //             res.status.should.equal(201);
    //             res.body.success.should.equal(false);
    //             done();
    //         });
    //     })
    // })

    describe("GET Single Event", () => {

        it("should return a single event", (done) => {

            request(app)
            .get("/v1/event/5e74d091b44a4a29f1149a8b")
            .end(function(err, res){

                res.status.should.equal(200);
                res.body.success.should.equal(true);
                done();
            });
        })
    })
})

