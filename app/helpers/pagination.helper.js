const querystring = require('querystring');

module.exports = function( responseLenght, options, filter, resource ){


    let limit = options.limit;
    let page = options.page;

    let pages = Math.floor( responseLenght / limit );

    const hasLastPage = responseLenght % limit;
    if( hasLastPage ) pages ++;

    const minPage = ( pages > 0 ) ? 1 : 0;
    const maxPage = pages;

    if( minPage < 0) return {}

    
    const prev_page = ( page == 1 ) ? null : ( ( page > maxPage ) ? maxPage : ( page - 1 ) );
    const next_page = ( (page + 1 ) > maxPage ) ? null : ( page + 1);
    const total = responseLenght;
    const per_page =  limit;
    const from = minPage;
    const to = maxPage;

    const pagination = {

        current_page: page,
        first_page_url: formatUrl( limit, filter, minPage, resource ),
        from,
        last_page: maxPage,
        last_page_url: formatUrl( limit, filter, maxPage, resource ),
        next_page_url: formatUrl( limit, filter, next_page, resource ),
        per_page,
        prev_page_url: formatUrl( limit, filter, prev_page, resource),
        to,
        total

    }

    return pagination;


}


const formatUrl = (limit, filter, page, resource ) => {

    if( page  == null ) return null;

    /**
     * Todo get the baseurl from the request object
     * var hostname = req.headers.host;
     */
    const reqeuestUrl = process.env.BASE_URL || "http://localhost:4000";

    filter = (({ startDate, deletedAt, ...o }) => o )(filter) 

    /**
     * Todo - look into this, could be potentially error prone
     */
    let queryString = querystring.stringify(filter);
    let appendQueryString = queryString ? `&${queryString}`: "";

    return `${reqeuestUrl}/v1/${ resource }?limit=${ limit }&page=${ page }${appendQueryString}`;
}