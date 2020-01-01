const sgMail = require("@sendgrid/mail");
// const dotenv = require("dotenv");
// dotenv.config();

const Users = require('@models/user.model');
const Event = require('@models/event.model');
const FROM = process.env.SENDING_EMAIL;


// set Send Grid API-Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


module.exports = {

    /**
     * sends a verification/on-boarding email to a newly registered user 
     * 
     */
    sendAccountConfirmationNotification: async () => {

        user = {
            name: "Oshikoya Femi",
            email: "gtheekhay@gmail.com"
        }
        const templateId = getEventTemplate("ACCOUNT_SIGNUP");
        const emailData = {
            "personalizations": [
            {
                "to": [
                {
                    "email": user.email
                }
                ],
                "dynamic_template_data": {
                    "name": user.name
                },
            }
            ],
            "from": {
                "email": FROM 
            },
            "template_id": templateId
        };

        await sgMail.sendMultiple(emailData);

    },

    /**
     * Notify followers of an event when an important update occurs
     * important updates includes changes to location & event Date
     * @param eventId String
     */
    sendEventUpdateNotification: (eventId) => {

        Event.findById(eventId);
    },


    /**
     * notify a user when he has been made an admin of an event.
     */
    sendEventAdminNotification: (eventId, userId) => {

    },

    /**
     * Notify a user when he follows(subscribes) to event
     * @param eventId String 
     * @param userId String
     * 
     */
    sendEventFollowNotificaiton: (eventId, userId) => {

    },

    /**
     * Notify a user when he unfollows(unsubscribes) from an event
     * @param eventId String 
     * @param userId String 
     * 
     */
    sendventUnFollowNotificaiton: (eventId, userId) => {

    },
    
}


const getEventTemplate = (event) => {

    let templateId;

    switch(event){

        case "ACCOUNT_SIGNUP":
            templateId = process.env.ACCOUNT_SIGNUP_TEMPLATE
            break;

        case "EVENT_INVITE":
            templateId = process.env.EVENT_INVITE_TEMPLATE
            break;

        case "EVENT_UPDATE":
            templateId = process.env.EVENT_UPDATE_TEMPLATE
            break;

        default:
            return res.status(404).send({ message: "Invalid Event type doesn't exist." });
    }

    return templateId;
}