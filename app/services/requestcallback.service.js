const { approveFollowRequest } = require('@services/user.service'); 


/**
 * 
 * This module was my approach to solving circular dependency.
 */
module.exports = {


    approveFollowRequestCallback: () => {
        return approveFollowRequest;
    }
}