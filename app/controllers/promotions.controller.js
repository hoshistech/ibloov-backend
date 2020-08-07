const Promotions = require("@models/promotion.model");

index = ( req, res) => {

    try{
        const promotions = await promotions.find();
        return res.status(200).json({

            data: promotions,
            successful: true,
            message: "Promotions retreived successfully"
        });
    }
    catch( err )
    {

        return res.status(400).json({

            data: err.toString(),
            successful: false,
            message: "Error reteiving promotion list"
        });

    }
    
}