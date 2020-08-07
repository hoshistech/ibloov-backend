const storeProvider = require("@services/shopping/serpwow.store");


module.exports = {

    /**
     * This aggregates a list of products based on the search parameter using a shopping API provider
     * 
     * @param productName String
     * @param location String
     */
    searchProduct: async (productName, location ) => {

        return await storeProvider.fetchResults( productName, location );
    }
}