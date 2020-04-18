const Sale = require('@models/sale.model');

module.exports = {

    "model": Sale,

    /**
     * returns all sales given certain parameters
     * @param query object 
     * @param options object
     */
    all: async ( query = {}, options = {} ) =>{

        //const {limit, sort} =  options;
        //query["isPrivate"] = false;

        let sales = await Sale.find(query);
        return sales;
    },


    /**
     * creates a new sale
     * @param saleData object
     */
    createSale: async (saleData ) =>{

        let sale = new Sale(saleData);
        return await sale.save();
    },


    /**
     * returns a single instance of an sale
     * @param saleId String
     */
    viewSale: async (saleId) => {

        return await Sale.findById(saleId)
        .populate('eventId', '_id name');
       
    },


    /**
     * update a single sale instance
     * @param saleId integer
     * @param updateData 
     */
    updateSale: async (saleId, updateData) => {

        const result = await Sale.findByIdAndUpdate( saleId, updateData, { runValidators: true , new: true});
        return result;
    },


    /**
     * update a set of a single sale model
     * @param saleId String 
     * @param update object
     * 
     */
    updateSaleSet: async (saleId, setData) => {

        return await Sale.findByIdAndUpdate( { _id: saleId } , { '$addToSet': setData}, { runValidators: true , new: true} );
    },


    /**
     * performs a softDelete operation on a single instance of an sale model
     * @param saleId integer
     *
     */
    softDeleteSale: async (saleId) => {

        const updateData = { deletedAt: Date.now(), deletedBy: '5e8cb0191ec1f8160def48c1' };
        return await module.exports.updateSale(saleId, updateData);  
    },


    /**
     * removes all documents in this colletion
     * This service cannot be exposed to a controller 
     * and should only be used during tests and on the test Db
     * 
     */
    removeAll: async () => {

        let env = process.env.NODE_ENV;

        if( env === 'test'){
            return await Sale.deleteMany({}) 
        }
    },
    

    sendReceipt: async ( to ) => {
        //send receipt to the recipient
    }
}