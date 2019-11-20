const Event = require('@models/event.model');
var JsBarcode = require('jsbarcode');
var Canvas = require("canvas");


/**
 * get events
 */
index = (req, res) => {

    const events = [
        {
            name: "starboyfest",
            eventDate: "2019-06-30T23:00:00.000Z",
            isPrivate: true
        },
        {
            name: "OLIC3",
            eventDate: "2019-07-29T23:00:00.000Z",
            isPrivate: false
        },
        {
            name: "Lord of the ribs",
            eventDate: "2019-09-19T23:00:00.000Z",
            isPrivate: false
        },
        {
            name: "Made in Lagos",
            eventDate: "2019-12-26T23:00:00.000Z",
            isPrivate: false
        }
    ];
    
    res.status(200).json(events);
},


/**
 * cerate a new event.
 */
create = (req, res) => {

    const event = 
    {
        name: "starboyfest",
        eventDate: "2019-06-30T23:00:00.000Z",
        isPrivate: true
    }

    res.status(200).json(events);
};


generateBarCode = () =>{

}

module.exports = {index}