const influencerService = require('@services/influencer.service');
const mailer = require('@services/mail.service');

module.exports = {

    view: async (req, res) => {

        let influencerId = req.params.influencerId;
    
        try {
            let influencer = await influencerService.viewInfluencer(influencerId);
    
            if( ! influencer){
    
                return res.status(404).json({
                    success: true,
                    message: "Event not found!."
                });
            }
    
            return res.status(200).json({
                success: true,
                message: "Influencer retreived successfully.",
                data: influencer
            });
            
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: "Error occured while performing this operation.",
                data: e
            });
        }
    },
    

    follow: async (req, res) => {

        try {

            let user = {

                _id: "5e71e1312cf61b1e058f896c",
                fullName: "Thora Jaskolski",
                email: "Evelyn21@hotmail.com"
            };

            let influencerId = req.params.influencerId;
            await influencerService.followInfluencer(influencerId, user);

            return res.status(200).json({
                successful: true,
                message: "operation successful"
            });
            
        } catch (err) {

            return res.status(400).json({

                data: err.toString(),
                successful: false,
                message: "Error performing this request."
            });
        }
    }
}
