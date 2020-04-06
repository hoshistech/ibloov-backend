//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
// var mongoDB = process.env.MONGO_URL_REMOTE   
var mongoDB =  process.env.MONGO_URL

module.exports = {

connect : function(){

    console.log("connecting to server....");
    mongoose.connect(mongoDB, { useNewUrlParser: true, useCreateIndex: true,  useUnifiedTopology: true  });

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
