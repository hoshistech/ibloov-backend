const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var userFollower = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true
    },

    createdAt: {
        type: Date,
        default: new Date
    }

}, { _id: false })

var blockedFollower = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true
    },

    createdAt: {
        type: Date,
        default: new Date
    }
    
}, { _id: false })

var UserSchema = new Schema({

    authMethod: {
        type: String,
        required: true,
        enum: ['local', 'facebook', 'google', 'twitter']
    },

    local: {

        firstName: String, 

        lastName: String,

        verificationCodes: [{
            code: {
                type: String
            },
            expiryDate: {
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
        unique: true,
        lowercase: true
    },

    isEmailVerified: {
        type: Boolean,
        default: function(){
            return this.authMethod == "local" ? false : true
        }
    },

    phoneNumber: {
        type: String,
        required: function(){
            this.authMethod == "local"
        }
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

    bio: {
        type: String,
        default: ""
    },

    followers: {
        type: [userFollower],
        required: false,
        default: []
    },

    blocked: {
        type: [ blockedFollower ],
        required: false,
        default: []
    },

    type: {
        type: String,
        enum:["user", "admin"],
        default: "user"
    },

    avatar: {
        type: String,
        required: false,
        default: null
    }
    
}, {timestamps: true,  versionKey: false} );


UserSchema.methods.isValidPassword = async function( password ){

    try {

        return await bcrypt.compare( password, this.local.password );

    } catch ( err ) {
        
        throw new Error(err);
    }   
};

UserSchema.virtual('fullName').get(function () {

    let method = this.authMethod;
    return this[method].firstName + ' ' + this[method].lastName;
});


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