const Feedback = require("@models/feedback.model");
const { setDefaultOptions  } = require('@helpers/request.helper');

module.exports = {

    "model": Feedback,


    all: async( query, options) => {

        let sort = {};
        options = options || setDefaultOptions();
        const { limit, skip, sortBy, orderBy } = options;
        sort[ sortBy ] = orderBy;

        return await Feedback.find( query )
        .populate('userId', '_id avatar authMethod email local.firstName local.lastName google facebook fullName phoneNumber')
        .sort(sort)
        .limit(limit)
        .skip(skip);
    },


    /**
     * Create a new feedback 
     * @param feedbackDetails Object
     */
    createFeedback: async ( feedbackInfo ) => {
        
        let feedback = new Feedback( feedbackInfo );
        return await feedback.save();
    },


    /**
     * view a single feedback instance
     * @param feedbackId integer
     */
    viewFeedback: async ( feedbackId ) => {

        return await Feedback.findById(feedbackId)
        .populate('userId', '_id avatar authMethod email local.firstName local.lastName google facebook fullName phoneNumber')
    },


    /**
     * update a single feedback instance
     * @param feedbackId integer
     * @param updateData 
     */
    updateFeedback: async (feedbackId, updateData) => {

        return await Feedback.findByIdAndUpdate( feedbackId, updateData, {new: true})
        .populate('userId', '_id avatar authMethod email local.firstName local.lastName google facebook fullName phoneNumber');
    },


    /**
     * delete a single feedback instance
     * @param feedbackId integer
     * @param deletedBy String 
     */
    softDeleteFeedback: async ( feedbackId, deletedBy ) => {
        
        const updateData = { deletedAt: Date.now(), deletedBy };
        return await module.exports.updateFeedback(feedbackId, updateData)
        .populate('userId', '_id avatar authMethod email local.firstName local.lastName google facebook fullName phoneNumber');
    }
}