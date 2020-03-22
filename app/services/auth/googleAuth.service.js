const {google} =  require('googleapis');
const { googleAuth } = require("@config/socialAuth");

console.log(googleAuth)



/**
 * This scope tells google what information we want to request.
 */
const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
];

module.exports = {

    createConnection: () => {
        
        return new google.auth.OAuth2(
            googleAuth.clientId,
            googleAuth.clientSecret,
            googleAuth.redirect
        );
    },

    getConnectionUrl: (auth) => {
        return auth.generateAuthUrl({
          access_type: 'offline',
          prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
          scope: defaultScope
        });
    },

    getGooglePlusApi: (auth) => {
        return google.plus({ version: 'v1', auth });
    },

    /**
     * Create the google url to be sent to the client.
     * 
     */

    urlGoogle: () => {
        const auth = module.exports.createConnection(); // this is from previous step
        const url =  module.exports.getConnectionUrl(auth);
        return url;
    },

    /**
     * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
     */
    getGoogleAccountFromCode: async (code) => {

        const auth = module.exports.createConnection();
        const data = await auth.getToken(code);
        const tokens = data.tokens;
        auth.setCredentials(tokens);
        const plus = module.exports.getGooglePlusApi(auth);
        const me = await plus.people.get({ userId: 'me' });
        const userGoogleId = me.data.id;
        const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
        return {
        id: userGoogleId,
        email: userGoogleEmail,
        tokens: tokens,
        };
    }
}