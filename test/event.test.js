require('module-alias/register');


var should = require("should");
var assert = require("assert");
var request = require("supertest");
var app = require("../app");

//const EventSeeder = require("@seeders/events.seeder");

describe( "Events", () => {

    describe("GET Event", () => {

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

    //         request(app)
    //         .post("/v1/event/create")
    //         .send( EventSeeder.eventFactory() )
    //         .end(function(err, res){

    //             res.status.should.equal(400);
    //             res.body.success.should.equal(false);
    //             done();
    //         });
    //     })
    // })
})

