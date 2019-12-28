const Event = require('@models/event.model');
var JsBarcode = require('jsbarcode');
var Canvas = require("canvas");
const eventService = require('@services/event.service');
const uuidv4 = require('uuid/v4')


/**
 * get events
 */
index = async (req, res) => {

    try{
        let events = await eventService.all();
        res.status(200).send({
            success: true,
            message: "events retreived succesfully",
            data: events
        });
    }
    catch(e){

        res.status(400).send({
            success: false,
            message: "error performing this operation",
            data: e.toString()
        });
    }
    
},


/**
 * create a new event.
 */
create = async (req, res) => {

    let event = req.body;
    event.createdBy = "76trfguiolk";
    event.uuid = uuidv4();

    try{
        await eventService.createEvent(event);
        res.status(200).send({
            success: true,
            message: "Event created successfully",
            data: event
        });
    }
    catch(e){

        res.status(400).send({
            success: false,
            message: "Error performing this operation",
            data: e
        });
    }
};


/**
 * update a single event model
 * 
 */
update = async (req, res) => {

    let eventId = req.params.eventId;
    let eventData = req.body;

    if( ! eventId){
        return res.status(400).json({
            success: false,
            message: "required event id missing."
        });
    }

    let event = await eventService.viewEvent(eventId);
    
    if( !event ){
        return res.status(404).json({
            success: false,
            message: "invalid event."
        });
    }

    try {
        
        let resp = await eventService.updateEvent(eventId, eventData);
        eventService.addEventHistory(eventId, "EVENT_UPDATE")
        return res.status(200).json({
            success: true,
            message: "Event information has been updated successfully.",
            data: resp
        });
    } catch (e) {
        
        return res.status(400).json({
            success: false,
            message: "Error occured while trying to update this event.",
            data: e
        });
    }
};


view = async (req, res) => {

    let eventId = req.params.eventId;

    if( ! eventId ){

        return res.status(400).json({
            success: false,
            message: "invalid event id provided.",
        });
    }

    try {
        let event = await eventService.viewEvent(eventId);

        if( ! event){

            return res.status(404).json({
                success: true,
                message: "Event not found!."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event retreived successfully.",
            data: event
        });
        
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: "Error occured while performing this operation.",
            data: e
        });
    }
};


/**
 * softDeletes a single event instance.
 * @authLevel - authenticated | isEventAdmin | isEventCreator
 */
softdelete = async (req, res) => { 

    
    let eventId = req.params.eventId;
    let eventData = req.body;

    if( ! eventId){
        return res.status(400).json({
            success: false,
            message: "required event id missing."
        });
    }

    let event = await eventService.viewEvent(eventId);
    if( ! event ){
        return res.status(404).json({
            success: false,
            message: "invalid event."
        });
    }

    try {
        
        let resp = await eventService.softDeleteEvent(eventId, eventData);
        return res.status(200).json({
            success: true,
            message: "Event information has been deleted successfully.",
            data: resp
        });
    } catch (e) {
        

        console.log(e)
        return res.status(400).json({
            success: false,
            message: "Error occured while trying to update this event.",
            data: e
        });
    }
};

/**
 * Generates a single code for an event
 * most likely used when genrating an event
 * @authlevel - no auth
 * @returns String
 */
generateEventCode = (req, res) => {

    let code = generateCode();
    res.status(200).json({
        success: true,
        message: "Event code generated successfully",
        data: code
    });
}


/**
 * updates the followers of an event.
 * @authlevel authenticated
 */
follow = async (req, res) => {

    let eventId = req.params.eventId;

    if( ! eventId){
        return res.status(400).json({
            success: false,
            message: "required event id missing."
        });
    }
    
    try{
        let event = await eventService.viewEvent(eventId);

        if( ! event ){
            return res.status(404).json({
                success: false,
                message: "invalid event."
            });
        }

        let follower = {
            userid: "98765tguik",
            email: "test@test.com",
            telephone: "09039015531"
        }

        let resp = eventService.updateEventSet(eventId, {"followers":  follower });

        return res.status(200).json({
            success: true,
            message: "Operation successful",
            data: resp
        });
    }
    catch(e){

        return res.status(400).json({
            success: false,
            message: "There was an error performing this operation",
            data: e.toString()
        });
    }
    
}


generateCode = () => {

    return Math.random().toString(36).slice(3);
}

module.exports = {index, create, view, update, softdelete, generateEventCode, follow}