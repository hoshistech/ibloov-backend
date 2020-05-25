const Request = require('@models/request.model');

//notif
const { notify, notifyBulk } =  require("@request-notif/event-coordinator-request.notif");

//services
const {approveEventCoordinatorRequest, denyEventCoordinatorRequest} = require("@services/event.service");

const type = "event-coordinator-request";

module.exports = {


    /**
     * Creates a single event event-coordinator-request type
     * @param requesteeId
     * @param accepteeId
     * @param eventId
     */
    createEventCoordinatorRequest: async ( requesteeId, accepteeId, eventId ) => {

        if( ! eventId ) throw new Error("eventId required to create request of type event-coordinator");

        const newRequest = {

            requesteeId,
            accepteeId,
            type,
            eventId
        };

        const request = new Request( newRequest );
        
        const resp =  await request.save();

        notify( resp );

        return resp;
    },


    /**
     * sends a request to all the people invited to an event.
     * 
     * @param event Object
     */
    createEventCoordinatorBulkRequest: async ( event ) => {

        let requests = [];

        const requesteeId = event.userId;
        const coordinators = event.coordinators;
        const eventId = event._id;

        coordinators.map( coordinator => {

            if( coordinator.userId && coordinator.userId.toString() !== requesteeId.toString() ){

                let newRequest = {

                    requesteeId,
                    accepteeId: coordinator.userId,
                    type,
                    eventId
                }

                requests.push( newRequest );
            }
        })

        if( requests.length > 0 ){

            const docs = await Request.insertMany(requests);
            notifyBulk( docs );
        }
    },


    /**
     * function to be executed when this request is approved succesfully
     * 
     * @param requestId
     */
    acceptRequest: async ( request ) => {

        await approveEventCoordinatorRequest( request.eventId, request.accepteeId._id )

    },

    /**
     * function to be executed when this request is denied
     * 
     * @param requestId 
     */
    denyRequest: async ( request ) => {
        await denyEventCoordinatorRequest( request.eventId, request.accepteeId._id )
    }
}