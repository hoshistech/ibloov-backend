const eventService = require("@services/event.service");

module.exports =  {
    
    deleteEvent: async (req, res, next) => {

        let userId = req.authuser._id;
        let eventId = req.params.eventId;

        let event = await eventService.viewEvent( eventId );

        if(event.userId._id.toString() !== userId.toString() ){

            return res.status(403).json({

                success: false,
                message: "you are not authorized to perform this operation."
            })
        }
        
        next();
    }
   
}


