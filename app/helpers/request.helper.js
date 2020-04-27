const maxLimit = 100;
const minLimit = 10;

module.exports = {


    getOptions: (req) => {

        let options = {};

        options["sortBy"] = req.query.sortBy || "createdAt";
        options["orderBy"] = req.query.orderBy ? ((req.query.orderBy === 'desc') ? -1 : 1 ) : -1
        options["limit"] =  req.query.limit ? ( ( parseInt(req.query.limit) > maxLimit ) ? maxLimit : parseInt(req.query.limit) ) : minLimit;
        options["skip"] = req.query.skip ? parseInt(req.query.skip) : 0;

        return options;
    },

    getMatch: ( req ) => {

        const match = (({ sortBy, orderBy, skip, limit, ...o }) => o)(req.query) 
        return match;
    }
}