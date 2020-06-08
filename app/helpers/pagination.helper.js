module.exports = function( responseLenght, page, limit, resource ){


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

        first_page_url: formatUrl( limit, minPage, resource ),
        from,
        last_page: maxPage,
        last_page_url: formatUrl( limit, maxPage, resource ),
        next_page_url: formatUrl( limit, next_page, resource ),
        per_page,
        prev_page_url: formatUrl( limit, prev_page, resource),
        to,
        total

    }

    return pagination;


}


const formatUrl = (limit, page, resource ) => {

    if( page  == null ) return null;

    /**
     * Todo get the baseurl from the request object
     * var hostname = req.headers.host;
     * 
     * Todo - query objects should be added to pagination links
     */
    const reqeuestUrl = process.env.BASE_URL || "http://localhost:4000";
    return `${reqeuestUrl}/v1/${ resource }?limit=${ limit }&page=${ page }`;
}