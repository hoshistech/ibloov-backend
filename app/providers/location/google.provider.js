const {Client, Status} = require("@googlemaps/google-maps-services-js");

const client = new Client({});
const baseUrl = "https://maps.googleapis.com/maps/api/";
const key = process.env.GOOGLE_LOCATION_API_KEY;

module.exports = {

    geocode: async( address) => {

        return await client.elevation({
            params: {
              locations: [{ lat: 45, lng: -110 }],
              key,
            },
            timeout: 1000, // milliseconds
          })
    }
}


