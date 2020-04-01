const shoppingService = require('@services/shopping.service');

module.exports = {

    searchProduct: async (req, res) => {

        let { q, location} = req.query;

        if( ! q) {
            return res.status(400).json({

                success: false,
                message: "query parameter 'q' missing. Kindly provide the search parameter. "
            });
        }

        try {
            
            let resp = await shoppingService.searchProduct(q, location);

            return res.status(200).json({
                success: true,
                message: "products retreived successfully!.",
                data: resp
            });

        } catch (err) {
            
            return res.status(400).json({

                success: false,
                message: "Error occured while processing this payment!.",
                data: err.toString()
            });
        }
    }
}