var twilio = require('twilio');

var client = new twilio( process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN );

module.exports = {

    sendOne:  async ( to, body  )=> {


        return await client.messages.create({
            to,
            body,
            from: '+19282397675',
        });
    },

    sendBulk:  async ( to = [], body  )=> {

        if( to.count < 1 ) return ;
    },

    checkBalance:  async ( )=> {
 
    }
}

