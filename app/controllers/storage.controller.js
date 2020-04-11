const upload = require("@services/storage/digitalocean.service.js");

module.exports = {

  upload: async (req, res) => {

    upload(req, res, ( err ) => {

      if ( err ) {
        return res.status(200).send({
          
          success: false,
          message: "error performing this operation.",
          data: err.toString()
        });
      }

      return res.status(200).send({
        success: true,
        message: "upload successful",
        data: req.files
      });

    });
  }
}