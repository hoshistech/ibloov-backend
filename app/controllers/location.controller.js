let provider = require("@providers/location/google.provider");

module.exports = {

    search:  async(req, res) => {

        try {
            let resp = await provider.geocode("2, popoola banjoko street, Soluyi. Gbagada.");
            console.log(resp)
            return res.send(resp.data);

        } catch (error) {
            console.log(error);
            return res.send( {error: error.toString() });

            
        }
        
    }
}