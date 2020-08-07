const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const uuidv4 = require('uuid/v4');
const QRCode = require('qrcode');

//const Cryptr = require('cryptr');
//const cryptr = new Cryptr('!bl00v3v3nT@pp');

var Schema = mongoose.Schema;


/**
 * user followers would be here.
 */
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


/**
 * User's blocked by a user would be in this array.
 */
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


/**
 * user payout
 */
var payout = new Schema({

    currency: {
        type: String
    },

    bankName: {
        type: String
    },

    accountNumber: {
        type: String
    },

    accoutName: {
        type: String
    },

    cashout: {
        type: String,
        enum: ["WEEKLY", "MONTHLY", "DAILY"]
    }

}, { _id: false })


var UserSchema = new Schema({

    authMethod: {
        type: String,
        required: true,
        enum: ['local', 'facebook', 'google', 'twitter']
    },

    qrCode: {
        type: String
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
            type: String,
            required: function(){

                return this.authMethod == "local";
            }
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

    uuid: {
        type: String,
        unique: true,
        required: true
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

        currency: {
            type: String,
            default: null
        },
    
        timeZone: {
            type: String,
            default: null
        },
    
        country: {
            type: String,
            default: null
        },

        notification: {

            email: {

                myEvents:{
                    type: Boolean,
                    default: true
                },
        
                FriendActivities: {
                    type: Boolean,
                    default: true
                },
        
                eventInvites: {
                    type: Boolean,
                    default: true
                },
        
                wishlistRequests: {
                    type: Boolean,
                    default: true
                },
        
                fundmeRequests: {
                    type: Boolean,
                    default: true
                },
    
                friendRequests: {
                    type: Boolean,
                    default: true
                },
        
                appUpdates:{
        
                    type: Boolean,
                    default: true
                }
            },

            pushNotifications: {

                myEvents:{
                    type: Boolean,
                    default: true
                },
        
                FriendActivities: {
                    type: Boolean,
                    default: true
                },
        
                eventInvites: {
                    type: Boolean,
                    default: true
                },
        
                wishlistRequests: {
                    type: Boolean,
                    default: true
                },
        
                fundmeRequests: {
                    type: Boolean,
                    default: true
                },
        
                friendRequests: {
                    type: Boolean,
                    default: true
                },
        
                appUpdates:{
        
                    type: Boolean,
                    default: true
                }
        
            }
        },

        reminders: {

            upcomingEvents:{
                type: Boolean,
                default: true
            },
    
            FriendBirthdays: {
                type: Boolean,
                default: true
            }
        }
    },

    payout: {
        type: payout,
        default: {}
    }
    
}, { timestamps: true,  versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } } );


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

        //this.uuid = uuidv4();
        this.qrCode = await QRCode.toDataURL( `user-${ this.uuid }` );
        let url = await QRCode.toString( `user-${ this.uuid }`, { type:'terminal' });
        console.log(url);

        if( this.authMethod == "local" ){

            const salt = await bcrypt.genSaltSync(10);
            const hash = await bcrypt.hash(this.local.password, salt);
            this.local.password = hash;
        }

        next()

    } catch( err ){

        next(err);
    }
})

UserSchema.plugin(mongooseLeanVirtuals);

let Users = mongoose.model('users', UserSchema);

module.exports = Users; 