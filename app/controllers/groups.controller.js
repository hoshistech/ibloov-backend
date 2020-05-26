const groupService = require('@services/group.service');
const uuidv4 = require('uuid/v4');
const { getOptions, getMatch } = require('@helpers/request.helper');


module.exports = {

    /**
     * @RESTCONTROLLER
     * endpoint to retreive a list of groups
     * 
     * @authlevel authenticated
     */
    index: async (req, res ) => {

        let filter = getMatch(req);
        let options = getOptions(req);

        filter["deletedAt"] = null; 
        filter["userId"] = req.authuser._id; 

        try {
            let groups = await groupService.all(filter, options);

            res.status(200).send({
                success: true,
                message: "groups retreived succesfully",
                data: groups
            });

        } catch ( err ) {

            res.status(400).send({
                success: false,
                message: "error performing this operation",
                data: err.toString()
            });
        }
    },


    /**
     * @RESTCONTROLLER
     * endpoint to create a new group.
     * 
     * @authlevel authenticated
     */
    create: async (req, res) => { 

        let group = req.body;
        group.uuid = uuidv4();
        group.userId = req.authuser._id;
        
        try {

            let resp = await groupService.createGroup(group);
            res.status(201).send({
                success: true,
                message: "group created successfully",
                data: resp
            });

        } catch ( err ) {

            res.status(400).send({
                success: false,
                message: "Error performing this operation",
                data: err.toString()
            });
        }
    },


    /**
     * @RESTCONTROLLER
     * endpoint to update a single group model
     * 
     * @authlevel authenticated
     */
    update: async (req, res) => {

        let groupId = req.params.groupId;
        let groupData = req.body;

        try {

            let resp = await groupService.updateGroup(groupId, groupData);
            groupService.addGroupHistory(groupId, "GROUP_UPDATE", req.authuser._id);

            return res.status(200).json({
                success: true,
                message: "group information has been updated successfully.",
                data: resp
            });

        } catch ( err ) {

            return res.status(400).json({
                success: false,
                message: "Error occured while trying to update this group.",
                data: err.toString()
            });
        }
    },


    /**
     * @RESTCONTROLLER
     * endpoint to retreive a single group instance
     * 
     * @authlevel authenticated isAdmin|isSelf
     */
    view: async (req, res) => {

        let groupId = req.params.groupId;

        try {
            let group = await groupService.viewGroup(groupId);

            return res.status(200).json({

                success: true,
                message: "Group retreived successfully.",
                data: group
            });

        } catch ( err ) {
            return res.status(400).json({
                success: false,
                message: "Error occured while performing this operation.",
                data: err.toString()
            });
        }
    },


    /**
     * @RESTCONTROLLER
     * softDeletes a single group instance.
     * 
     * @authLevel - authenticated | isOwner | isEventAdmin 
     */
    softdelete: async (req, res) => { 

        let groupId = req.params.groupId;
        let userId = req.authuser._id;

        try {
            
            let resp = await groupService.softDeleteGroup( groupId, userId );

            return res.status(200).json({
                success: true,
                message: "Group has been deleted successfully.",
                data: resp
            });

        } catch ( err ) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to perform this operation.",
                data: err.toString()
            });
        }
    },


    /**
     * adds contacts to a group
     * 
     * @authLevel - authenticated | isOwner 
     */
    addContacts: async (req, res) => {

        let groupId = req.params.groupId;
        let contacts = req.body.contacts; 

        try {

            let resp = await groupService.addContacts(groupId, contacts);
            
            return res.status(200).json({
                success: true,
                message: "Contact(s) added successfully",
                data: resp
            });
            
        } catch ( err ) {

            return res.status(400).json({
                success: false,
                message: "Error occured while trying to perform this operation.",
                data: err.toString()
            });
        }

    },


    /**
     * remove contact to a group
     * 
     * @authLevel - authenticated | isOwner 
     */
    removeContacts: async (req, res) => {

        let groupId = req.params.groupId;
        let telephone = req.body.telephone;

        try {

            let resp = await groupService.removeContacts(groupId, telephone);

            return res.status(200).json({
                success: true,
                message: "Contact removed successfully",
                data: resp
            });
            
        } catch ( err ) {

            return res.status(400).json({
                success: false,
                message: "Error occured while trying to perform this operation.",
                data: err.toString()
            });
        }

    }
}