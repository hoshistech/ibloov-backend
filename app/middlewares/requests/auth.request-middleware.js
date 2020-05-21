const {  param } = require('express-validator');

const platforms = [ "web", "mobile"];

exports.validate = ( method ) => {

    switch ( method ) {

        case 'isValidPlatform': {

            return [

                param('platform')
                .custom( async (value) => {

                    if( ! platforms.includes(value) ){
                        return Promise.reject('Invalid platform provided.');
                    }
     
                    return true;
                }),

                
            ]
        }
    }
}