//Import the mongoose module
var mongoose = require('mongoose');
const db = require("@config/db.config");

var mongoDB = db.url;

module.exports = {

connect : function(){

    console.log("connecting to server....");
    mongoose.connect(mongoDB, { useNewUrlParser: true, useCreateIndex: true,  useUnifiedTopology: true,  useFindAndModify: false });

    //Get the default connection
    var db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    db.once('open', function() {

        console.log(" ---- remove this in production ----")
        console.log("DB connected to ", mongoDB);
    });
}
};
