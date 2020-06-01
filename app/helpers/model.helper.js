module.exports = {

    removeAll: async ( model ) => {

        let env = process.env.NODE_ENV;

        if( env === 'test'){
            return await model.deleteMany({}) 
        }
    },


    create: async (Model, data) => {

        let model = new Model(data);
        return await model.save(); 
    },
}