module.exports = {

    facebookAuth: {

        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_REDIRECT_URL,
        profileFields: ['id', 'displayName', 'link', 'photos', 'emails']
    },

    twitter:{

    },

    googleAuth: {
        
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URL
    },

    apple: {


    }
}