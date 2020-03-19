const { body, param } = require('express-validator')

exports.validate = (method) => {

  switch (method) {

    case 'createEvent': {

     return [ 
        param('inflencerId', "userName doesn't exists.").exists(),
        body('name', 'Invalid email.').exists()
        .isEmail(),

        body('category', 'Invalid category provided.').exists(), 

        body('eventStartDate', 'Invalid event start date provided.').exists(), //validDate | notInThePast | notGreaterThanEndDate 
       ]   
    }

    case 'viewEvent': {

        return [ 
           param('eventId', "Required event id not provided.").exists(),
          ]   
       }

  }
}