const sgMail = require("@sendgrid/mail");

const templateId = templateId = process.env.EVENT_INVITE_TEMPLATE

const FROM = process.env.SENDING_EMAIL;

// set Send Grid API-Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


module.exports = {

    /**
     * Notifies an influencer when he has a new follower
     * @param influencer Object
     * @param follower Object
     */
    sendEventInviteMail: async ( event ) => {

        const emailData = {
            "personalizations": [
            {
                "to": [
                {
                    "email": influencer.email
                }
                ],
                "dynamic_template_data": {
                    "event_name": event.name,
                    "event_image": event.images[0].url,
                    "event_date": event.startDate
                },
            }
            ],
            "from": {
                "email": FROM 
            },
            templateId
        };

        await sgMail.sendMultiple(emailData);
    }
    
    
}
