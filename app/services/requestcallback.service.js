const { approveFollowRequest } = require('@services/user.service'); 


/**
 * 
 * This module was my approach to solving circular dependency.
 * some of the services that were needed for completing reqeust callbacks also depended on the request service
 * hence causing circular dependency
 * 
 * This module was simply made to break the effect of that
 */
module.exports = {


    approveFollowRequestCallback: () => {
        return approveFollowRequest;
    }
}