const Category = require("@models/category.model");

module.exports = {

    /**
     * returns all categories given certain parameters
     * @param query object 
     * @param options object
     */
    all: async ( query = {}, options = {} ) =>{

        //const {limit, sort} =  options;
        query["deletedAt"] = null;
        let categories = await Category.find(query);
        return categories;
    },


    /**
     * creates a new category
     * @param categoryData object
     */
    createCategory: async (categoryData ) =>{

        let category = new Category(categoryData);
        return await category.save();
    },


    /**
     * returns a single instance of an category
     * @param categoryId String
     */
    viewCategory: async (categoryId) => {

        let category = await Category.findById(categoryId);
        return category;
    },


    /**
     * update a single category instance
     * @param categoryId integer
     * @param updateData 
     */
    updateCategory: async (categoryId, updateData) => {

        const result = await Category.findByIdAndUpdate( categoryId, updateData, {new: true});
        return result;
    },


    /**
     * update a set of a single category model
     * @param categoryId String 
     * @param update object
     * 
     */
    updateCategorySet: async (categoryId, setData) => {

        return await Category.findByIdAndUpdate( { _id: categoryId } , { '$addToSet': setData });
    },


    /**
     * performs a softDelete operation on a single instance of an category model
     * @param categoryId integer
     *
     */
    softDeleteCategory: async (categoryId) => {

        const updateData = {deletedAt: Date.now(), deletedBy: '1edfhuio3ifj'};
        return await module.exports.updateCategory(categoryId, updateData);  
    }
}