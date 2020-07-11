const User = require("@models/user.model");
const Event = require("@models/event.model");

module.exports = {


    getQRResource: async( qr) => {

        const resourceType = qr.substr(0, qr.indexOf('-'));
        const resourceId = qr.substr( qr.indexOf('-') + 1 , qr.length );

        console.log("resourceType, resourceId")
        console.log(resourceType, resourceId);

        let resource;

        switch( resourceType ){

            case "user":
                resource = User.findOne({ uuid: resourceId, deletedAt: null })
                break;

            case "event":
                resource = Event.findOne({ uuid: resourceId, deletedAt: null })
                break;

            default:
                throw new Error("invalid resource provided.")
        }

        return resource;
    }
 }