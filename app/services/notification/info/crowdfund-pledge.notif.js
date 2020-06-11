//models
const Notification = require("@models/notification.model");

module.exports.crowdfundPledgeNotification = async( sender, recepient, crowdfund ) => {

    /**
     * Todo - still look into this notofication
     */
    const currency = crowdfund.currency;

    const donation = crowdfund.donors.filter( donor => donor.userId.toString() == sender.toString() );

    const amount = donation[ donation.length - 1 ].amount;

        const notif = new Notification({

            sender,
            type: "info",
            message: `has pledged ${currency} ${amount} to your crowdfund`,
            recepient,
            crowdfundId: crowdfund._id
        });

        await notif.save(); 
}