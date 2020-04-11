const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({

    authMethod: {
        type: String,
        required: true,
        enum: ['local', 'facebook', 'google', 'twitter']
    },

    local: {

        firstName: String, 

        lastName: String,

        verificationCode: [{
            code: {
                type: String
            },
            expires: {
                type: Date
            }
        }],

        password: {
            type: String
        }

    },

    facebook: {

    },

    google: {

        id: {
            type: String,
            required: function(){
                return this.authMethod == "google"
            }
        },
        firstName: String, 
        lastName: String
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    isEmailVerified: {
        type: Boolean,
        default: function(){
            return this.authMethod == "local" ? false : true
        }
    },

    phoneNumber: {
        type: String,
        //unique: true
    },

    isPhoneNumberVerified: {
        type: Boolean,
        enum: [true, false ],
        default: false
    },

    dob: {
        type: Date
    },


}, {timestamps: true,  versionKey: false} );


UserSchema.methods.isValidPassword = async function( password ){

    try {

        return await bcrypt.compare( password, this.local.password);

    } catch ( err ) {
        
        throw new Error(err);
    }   
};



UserSchema.pre('save',  async function(next){
    
    try{
        if( this.authMethod !== "local") next();

        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hash(this.local.password, salt);
        this.local.password = hash;
        next()

    } catch( err ){
        next(err);
    }
})

let Users = mongoose.model('users', UserSchema);

module.exports = Users;