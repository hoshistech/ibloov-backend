//Model
const Notification = require("@models/notification.model");

//helpers
const { setDefaultOptions  } = require('@helpers/request.helper');


module.exports = {

    getUserNotifications: async ( userId ) => {

        let sort = {};
        options = setDefaultOptions();
        
        const { limit, skip, sortBy, orderBy } = options;
        sort[ sortBy ] = orderBy;

        return await Notification.find({

            $or: [
                { recepient: userId },
                { "recepient": { $elemMatch: { userId } }  }
            ]
        })
        
        .select("-recepient") //dont send the recepient along with the result
        .populate("requestId", "_id accepted")
        .populate("sender", "_id avatar authMethod local.firstName local.lastName google facebook apple fullName")
        .populate("eventId", "_id name")
        .sort(sort) 
        .limit(limit)
        .skip(skip);
    }
}

