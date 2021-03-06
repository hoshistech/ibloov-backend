const Group = require("@models/group.model");
const { setDefaultOptions  } = require('@helpers/request.helper');

module.exports = {

    "model": Group,


    all: async( query, options) => {

        let sort = {};
        options = options || setDefaultOptions();
        
        const { limit, skip, sortBy, orderBy } = options;
        sort[ sortBy ] = orderBy;

        return await Group.find( query )
        .populate('userId', '_id avatar authMethod email local.firstName local.lastName google facebook apple fullName phoneNumber')
        .populate('contacts.userId', '_id avatar authMethod email local.firstName local.lastName google facebook apple fullName phoneNumber')
        .sort(sort)
        .limit(limit)
        .skip(skip);
        
    },


    /**
     * Create a new group 
     * @param groupDetails Object
     */
    createGroup: async ( groupDetails ) => {
        
        let group = new Group( groupDetails );
        return await group.save();
    },


    /**
     * view a single group instance
     * @param groupId integer
     */
    viewGroup: async ( groupId ) => {

        return await Group.findById(groupId)
        .populate('userId', '_id avatar authMethod email local.firstName local.lastName google facebook apple fullName phoneNumber')
        .populate('contacts.userId', '_id avatar authMethod email local.firstName local.lastName google facebook apple fullName phoneNumber');
    },



    /**
     * update a single group instance
     * @param groupId integer
     * @param updateData 
     */
    updateGroup: async (groupId, updateData) => {

        const result = await Group.findByIdAndUpdate( groupId, updateData, {new: true})
        .populate('userId', '_id avatar authMethod email local.firstName local.lastName google facebook apple fullName phoneNumber')
        .populate('contacts.userId', '_id avatar authMethod email local.firstName local.lastName google facebook apple fullName phoneNumber')

        return result;
    },


    /**
     * delete a single group instance
     * @param groupId integer
     * @param deletedBy String 
     */
    softDeleteGroup: async ( groupId, deletedBy ) => {
        
        const updateData = {deletedAt: Date.now(), deletedBy };
        return await module.exports.updateGroup(groupId, updateData)
        .populate('userId', '_id avatar authMethod email local.firstName local.lastName google facebook apple fullName phoneNumber')
        .populate('contacts.userId', '_id avatar authMethod email local.firstName local.lastName google facebook apple fullName phoneNumber');
    },


    /**
     * Add new contacts to a group
     * @param groupId String
     * @param contacts Array
     */
    addContacts: async (groupId, contacts) => {

        return await Group.findOneAndUpdate(
            { "_id" : groupId },
            { 
                "$addToSet": { 
                    "contacts" : { 
                        "$each": contacts
                    } 
                } 
            }, 
            { runValidators: true, new: true }
        )
        .populate('userId', '_id avatar authMethod email local.firstName local.lastName google facebook apple fullName phoneNumber')
        .populate('contacts.userId', '_id avatar email authMethod local.firstName local.lastName google facebook apple fullName phoneNumber');
    },

    /**
     * Remove a single contact from a group
     * @param groupId String
     * @param contacts Array
     */
    removeContacts: async (groupId, telephone) => {

        let update = await Group.findByIdAndUpdate( groupId, { $pull: { 'contacts':  { "telephone": telephone }  } }, 
        { runValidators: true,  new: true} );
        return update;
    },


    /**
     * updates an event instance -  addsa a new audit history to the group document
     * @param eventId String - the unique identifier of the event.
     * @param event string - the name of the event e.g create, delete etc.
     */
    addGroupHistory: async (groupId, event, userId) => {

        let history  = {
            event,
            createdAt: new Date(),
            comment: "new event history",
            userId
        };

        let set = { 'history': history };
        return await Group.findByIdAndUpdate( groupId, { "$addToSet": set },  {new: true, runValidators: true });
    },
}