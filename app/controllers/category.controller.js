const categoryService = require("@services/category.service");
const uuidv4 = require('uuid/v4');



module.exports = {
    
    index: async (req, res) => {
        
        let scope = req.params.scope || null;

        try{
            let categories = await categoryService.all( {scope} );

            return res.status(200).send({
                success: true,
                message: "Categories retreived successfully",
                data: categories
            });
        } catch( err ) {
            
            return res.status(400).send({
                success: false,
                message: "error retreiving list of catrgories",
                data: categories
            });

        }

    },

    create: async (req, res) => {

        try {

            let category = req.body;
            category.uuid = uuidv4();

            await categoryService.createCategory(category);
            return res.status(200).send({
                success: true,
                message: "Categories retreived successfully",
                data: category
            });
            
        } catch (err) {

            return res.status(200).send({

                success: false,
                message: "oops! an error occurred while trying to perforn this operation",
                data: err.toString()
            });
            
        }
    },

    view: () => {
        console.log("viewing a new category")
    }
}