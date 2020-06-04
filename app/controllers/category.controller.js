const categoryService = require("@services/category.service");
const { paginatedQuery } = require("@services/event.service");
const uuidv4 = require('uuid/v4');



module.exports = {
    
    index: async (req, res) => {
        
        const scope = req.params.scope || null;

        try{
            let categories = await categoryService.all( {scope} );

            const getCategoryCount = async () => {

                return Promise.all( categories.map( async category => {

                    let scopes = await paginatedQuery({ "category": category.name ,  "deletedAt": null });
                    category["count"] = scopes.length;

                    return category;
                }))
            }

            categories = await getCategoryCount();

            return res.status(200).send({
                success: true,
                message: "Categories retreived successfully",
                data: categories
            });
            
        } catch( err ) {
            
            return res.status(400).send({
                success: false,
                message: "error retreiving list of catrgories",
                data: err.toString()
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