const Ticket = require("@models/ticket.model.js");
const ticketMaxLength = 10;

module.exports = {

    createTicket: async ( event, userId ) => {

        if( event.isPaid !== true ) return null;

        let ticket = await Ticket.findOne({ eventId: event._id });
        
        if( ticket ){

            let ticketNumber = await module.exports.generateTicketNumber( event._id );

            newTicket = {
    
                amount: event.amount,
                userId,
                ticketNumber,
            };

            return await Ticket.findOneAndUpdate( 
            
                { eventId: event._id, "tickets.userId": { $ne: userId } }, 
                { $addToSet : { 'tickets': newTicket } }, { new: true }
            ); 

        } else {

            let ticketNumber = await module.exports.generateTicketNumber();

            let ticket = new Ticket({

                eventId: event._id,
                ticketNumber,
                currentCount: ticketNumber,
                tickets: [{
                    amount: event.amount,
                    userId,
                    ticketNumber
                }]
            })

            return await ticket.save();
        }
    },


    // createTicketWithDiscount: async ( event, userId, discountAmount) => {

    //     let ticket = new Ticket();

    //     if( ticket ){

    //         ticketNumber = await module.exports.generateTicketNumber( event._id );
    //         ticket.tickets.push({

    //             amount: event.fee,
    //             userId,
    //             amount: discountAmount - event.amount,
    //             isDiscount: true,
    //             discountAmount,
    //             ticketNumber 

    //         });
    //     }
        

    //     let setData = { 'followers': follower };
    //     return await Ticket.findOneAndUpdate( 
            
    //         {_id: ticketId }, 
    //         { $addToSet : setData }, { new: true}
    //     );        

    // },

    generateTicketNumber: async ( eventId ) => {

        let ticket = await Ticket.findOne({ eventId });
        if( ticket  ){

            let currentCount = ticket.currentCount || 1;
            return module.exports.updateCurrent( eventId, currentCount.toString() );
        }

        const start = 1;
        return  start.toString().padStart( ticketMaxLength, '0');
        
    },
    

    updateCurrent: async ( eventId, currentCount ) => {

        currentCount = parseInt( currentCount ) + 1;
        currentCount = currentCount.toString().padStart( ticketMaxLength, '0');
        await Ticket.findOneAndUpdate({ eventId },{ currentCount });
        return currentCount;
    },


    userTickets: async ( userId ) => {

        let tickets = await Ticket.find({ "tickets.userId": userId });
        return tickets
    }
}