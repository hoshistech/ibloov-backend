const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var follower = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    createdAt: {
        type: Date,
        default: new Date
    }

}, { _id: false })

var blockedUser = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    createdAt: {
        type: Date,
        default: new Date
    }

}, { _id: false })

var setting = new Schema({

    currency: {
        type: String
    },

    timeZone: {
        type: String
    },

    country: {
        type: String
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
        },
        unique: function(){
            this.phoneNumber ? true : false
        }
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
        type: [ follower ],
        required: false,
        default: []
    },

    blocked: {
        type: [ blockedUser ],
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
    },

    deletedAt: {
        type: Date,
        default: null
    }, 
    
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "users"
    },

    status: {
        type: String,
        enum: ["ACTIVE", "BLOCKED"],
        default: "ACTIVE"
    },

    settings: {
        type: setting
    }
    
}, { timestamps: true,  versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } } );

//toJSON: { virtuals: true }, toObject: { virtuals: true }


UserSchema.methods.isValidPassword = async function( password ){

    try {

        const storedpassword = this.local.password || "";

        return await bcrypt.compare( password, storedpassword );
        
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