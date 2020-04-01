var SerpWow = require('google-search-results-serpwow');
var serpwow = new SerpWow( process.env.SERPWOW_API_KEY);

//define a default location if no locaton is provided
const defaultLocation = "Lagos, Nigeria"

module.exports = {


    /**
     * fetch a list of products using the serpwow shopping API
     * @param q String : query String
     * @param location String
     */
    fetchResults: async (q, location) => {

        location = location || defaultLocation;

        return await serpwow.json({
            q,
            location,
            search_type: 'shopping',
            num: 100 //control the number of results returned at once
        });
    }
}