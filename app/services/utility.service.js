const userService = require("@services/user.service");
const eventService = require("@services/event.service");


module.exports = {


    getQRResource: async( qr, authuser ) => {

        const resourceType = qr.substr(0, qr.indexOf('-'));
        const resourceId = qr.substr( qr.indexOf('-') + 1 , qr.length );

        console.log("resourceType, resourceId")
        console.log(resourceType, resourceId);
 
        let resource;
        let meta = {};

        switch( resourceType ){

            case "user":
                resource = await userService.getUser({ uuid: resourceId, deletedAt: null });

                if( resource ){

                    let isFollowingStatus  = await userService.isFollowingStatus( authuser, resource._id );
                    let platformContacts = await userService.getPlatformContacts( resource._id )
                    meta.isFollowingStatus = isFollowingStatus;
                    meta.eventCount = await eventService.allCount( { userId: resource._id , deletedAt: null } );
                    meta.following = platformContacts.following.length;
                    meta.followers = platformContacts.followers.length;
                }
                
                break;

            case "event":

                resource = await eventService.getEvent({ uuid: resourceId, deletedAt: null })

                    if( resource ){
                        meta.isPrivate = resource.isPrivate;
                        meta.isInvited = resource.invitees.filter( invite => invite.userId._id.toString() === authuser.toString() ).length > 0;
                        meta.isCoordinator = resource.coordinators.filter( coordinator => coordinator.userId._id.toString() == authuser.toString() ).length > 0;
                        meta.ticketNumber = "EVNT-1909";
                        meta.orderId = "OD-0987654ertkl";
                        meta.canAttend = ( ! meta.isPrivate || meta.isCoordinator || meta.isInvited )
                        meta.attendingStatus = meta.isInvited ? resource.invitees.filter( invite => invite.userId._id.toString() === authuser.toString() )[0].accepted : null;
                    }
                    
                break;

            default:
                throw new Error("invalid resource provided.")
        }

        return { resource, meta };
    }
 }

 getAttendingStatus = function( event, authuser){

  
 }