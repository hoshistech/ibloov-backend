const dbs = {

  development: {
    url: process.env.MONGO_URL_DEV
  },

  test: {
    url: process.env.MONGO_URL_TEST
  },

  production: {
    url: process.env.MONGO_URL_PROD
  }
}

const environment = process.env.NODE_ENV || "development";
module.exports = dbs[environment];