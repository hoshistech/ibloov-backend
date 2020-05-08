module.exports = function(response, limit){

    const responseLenght = response.length;

    console.log("responseLenght")
    console.log(responseLenght)

    const pages = Math.floor( responseLenght / limit );

    console.log("pages")
    console.log(pages)

    const lastpage = responseLenght % limit;

    console.log("lastpage")
    console.log(lastpage)
    
    const reqeuestUrl = "http://localhost:4000/v1/event";

    let allPages = [];

    let currentSkip = 0

    for( let i = 0; i < pages; i++){

        
        let url = `${reqeuestUrl}?limit=${limit}&skip=${currentSkip}`;
        allPages.push(url);

        currentSkip += limit;
    }

    if( lastpage ){

        let offset = ( Math.floor(responseLenght / limit) * limit );
        let url = `${reqeuestUrl}?limit=${limit}&skip=${offset}`;

        allPages.push( url);
    };

    return allPages;


}