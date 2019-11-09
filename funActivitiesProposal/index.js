const Amadeus = require('amadeus');

const BCN_Coords = [41.397158, 2.160873]

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');


    const amadeus = new Amadeus({
        clientId: 'XtvzCIgtgvkVJUqsnLKqS6TgrAqK1Mra',
        clientSecret: 'iKAwssAThsAKw3vO',
        logLevel: 'debug'
      });

    const getPointOfInterests = async (lat, long) => amadeus.referenceData.locations.pointsOfInterest.get({
            latitude : lat,
            longitude : long
        })

    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};
