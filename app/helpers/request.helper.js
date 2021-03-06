const maxLimit = 100;
const minLimit = 20;

module.exports = {

    getOptions: (req) => {

        let options = {};

        options["page"] = req.query.page ? ( parseInt(req.query.page)) : 1;
        options["sortBy"] = req.query.sortBy || "createdAt";
        options["orderBy"] = req.query.orderBy ? ((req.query.orderBy === 'desc') ? -1 : 1 ) : -1
        options["limit"] =  req.query.limit ? ( ( parseInt(req.query.limit) > maxLimit ) ? maxLimit : parseInt(req.query.limit) ) : minLimit;
        options["skip"] = (options.page * options.limit) - options.limit ;
        return options;
    },

    getMatch: ( req ) => {

        let match = (({ sortBy, orderBy, skip, limit, page, ...o }) => o)(req.query) 
        return match;
    },

    setDefaultOptions: () => {

        let options = {};

        options["sortBy"] = "createdAt";
        options["orderBy"] = -1
        options["limit"] =  maxLimit;
        options["skip"] = 0;

        return options;
    }
}