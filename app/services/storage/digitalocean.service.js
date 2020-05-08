const AWS = require('aws-sdk');
const multer = require("multer");
const multerS3 = require("multer-s3");

const { digitalocean } = require("@config/storage.config.js");
const storageEndpoint = new AWS.Endpoint( digitalocean.endpoint );
const bucket = "ibloov-api-storage";

const allowedMimes = [ "image/jpeg", "image/jpg", "image/png"];

const s3 = new AWS.S3({

    endpoint: storageEndpoint,
    accessKeyId: digitalocean.accessKeyId,
    secretAccessKey: digitalocean.secretAccessKey
});


const upload = multer({

    storage: multerS3({
        s3,
        bucket,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {

            if ( ! allowedMimes.includes( file.mimetype ) ) {
                return cb(new Error('invalid file type'));
            }

            let path = `${req.authuser._id}/${req.params.resource}`;
            let name = file.originalname.substring( 0, file.originalname.indexOf("."));
        
        cb(null, `${path}/${name}${ Date.now() }`);
        }
    })
}).array('upload', 1);


module.exports = upload;


