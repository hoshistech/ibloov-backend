const AWS = require('aws-sdk');
const multer = require("multer");
const multerS3 = require("multer-s3");

const { digitalocean } = require("@config/storage.config.js");
const storageEndpoint = new AWS.Endpoint( digitalocean.endpoint );
const bucket = "ibloov-api-storage";

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
        console.log(file);
        cb(null, `${file.originalname}-${ Date.now() }`);
        }
    })
}).array('upload', 1);



module.exports = upload;


