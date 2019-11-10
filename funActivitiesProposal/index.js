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

        const getTripPurpose = async (originAirportCode, destinationAirportCode) => amadeus.travel.predictions.tripPurpose.get({
            originLocationCode: originAirportCode || 'NYC',
            destinationLocationCode: destinationAirportCode || 'MAD',
            departureDate: '2020-08-01',
            returnDate: '2020-08-12'
        })
    try {
        const {data: pointsOfInterest} = await getPointOfInterests(...BCN_Coords);
        const {data: tripPurpose} = await getTripPurpose();
        context.res = {
            status: 400,
            body:{
                pointsOfInterest,
                tripPurpose
            }
        };
    }catch(e) {
        context.res = {
            status: 400,
            body: e
        };
    }
};
