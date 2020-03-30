var app = require("../app");
var should = require("should");
var assert = require("assert");
var request = require("supertest");


//const WishlistSeeder = require("@seeders/wishlists.seeder");

describe( "Wishlists", () => {

    describe("GET Wishlist", () => {

        it("should return a list of wishlist", (done) => {

            request(app)
            .get("/v1/wishlist")
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

    describe("GET Single Wishlist", () => {

        it("should return a single wishlist", (done) => {

            request(app)
            .get("/v1/wishlist/5e81bd096f84cdcc926301ff")
            .end(function(err, res){

                res.status.should.equal(200);
                res.body.success.should.equal(true);
                done();
            });
        })
    })
})

