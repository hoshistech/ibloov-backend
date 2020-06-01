require('dotenv').config();

const env = process.env.NODE_ENV; // 'dev' or 'test' or prod

const dev = {
    
    app: {
        port: parseInt(process.env.PORT) || 4000
    },

    db: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        name: process.env.DB_NAME
    },

    facebook: {
        app_id: process.env.FACEBOOK_APP_ID,
        app_secret: process.env.FACEBOOK_APP_SECRET,
        callback: process.env.FACEBOOK_CALLBACK_URL
    },

    twitter: {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        callback: process.env.TWITTER_CALLBACK_URL
    }
    
};


const test = {

    app: {
        port: parseInt(process.env.TEST_APP_PORT) || 3000
    },

    db: {
        host: process.env.TEST_DB_HOST || 'localhost',
        port: parseInt(process.env.TEST_DB_PORT) || 27017,
        name: process.env.TEST_DB_NAME || 'test'
    },

    social: {

        facebook: {
          app_id: process.env.FACEBOOK_APP_ID,
          app_secret: process.env.FACEBOOK_APP_SECRET,
          callback: process.env.FACEBOOK_CALLBACK_URL
        },
    
        twitter: {
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            callback: process.env.TWITTER_CALLBACK_URL
        }
      }
};

const config = {
    dev,
    test
};

module.exports = config[env];