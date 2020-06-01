let nodeGeocoder = require('node-geocoder');

let options = {
    provider: 'google',
    apiKey: process.env.GOOGLE_LOCATION_API_KEY
  };
   
  const geocoder = nodeGeocoder(options);


  module.exports = {

    geocode: async( address ) => {

        // Using callback
        return await geocoder.geocode( address ); 
    }
  }