const { body, param } = require('express-validator')
const groupService = require('@services/group.service');


exports.validate = (method) => {

  switch (method) {

    /**
     * @requestValidator
     * validates the request to view an group
     * 
     */
    case 'viewGroup': {

      return [ 
        param('groupId')
        .exists().withMessage("Expected param 'groupId' not found!")
        .custom( value => {
          return itExists(value);
        }) 

      ]   
    }


    /**
     * @requestValidator
     * validates the request to create a new group
     */ 
    case 'createGroup': { 

      return [ 

        body('name')
        .exists().withMessage("Expected body param 'name' not found!")
        .custom( async ( name, { req, loc, path } ) => {

            return await groupService.all({ name, userId: req.authuser._id}).then( groups => {

                if( groups.length > 0 ){
                    return Promise.reject('Invalid group name. Group with this name already exits!');
                }

                return true;
            })
        })
      ]   
    }

    /**
     * @requestValidator
     * validates the request to update an group
     */
    case 'updateGroup': { 

      return [ 

        param('groupId')
        .custom( value => {
          return itExists(value);
        }) 
      ]   
    }

    /**
     * @requestValidator
     * validates the request to delete an group
     */
    case 'deleteGroup': {

      return [ 

        param('groupId')
        .custom( value => {
          return itExists(value);
        }) 
        
      ]   
    }

    case 'addContact': {

        return [
           
           body('contacts')
           .exists().withMessage("Required body param, 'contacts' not found!"),

           param('groupId')
           .exists().withMessage("Required parameter 'groupId' not found!")
           .custom( value => {
              return itExists(value)
           })
        ]
     }

     case 'removeContact': {

        return [
           
           body('telephone')
           .exists().withMessage("Required param, 'telephone' not provided"),

           param('groupId')
           .custom( value => {
              return itExists(value)
           })
        ]
     }


  }
}


const itExists = function( value ){

  return groupService.viewGroup(value).then( group => {
    
     if ( ! group ) {
       return Promise.reject('Group not found!');
     }
   });
}

