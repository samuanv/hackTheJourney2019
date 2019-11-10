const Amadeus = require('amadeus');
const axios = require('axios')
const BCN_Coords = [41.397158, 2.160873]

const couchbase = require('couchbase')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');


    const amadeus = new Amadeus({
        clientId: 'XtvzCIgtgvkVJUqsnLKqS6TgrAqK1Mra',
        clientSecret: 'iKAwssAThsAKw3vO',
        logLevel: 'debug'
      });

    const cluster = new couchbase.Cluster('couchbase://ec2-3-95-8-255.compute-1.amazonaws.com');
    cluster.authenticate('Administrator', 'Couchbase');
    const bucket = cluster.openBucket('travel-sample');

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

        const getActivitiesFormCity = (cityCode) => bucket.get(cityCode, () => {

        });

    try {
        const {data: pointsOfInterest} = await getPointOfInterests(...BCN_Coords);
        const {data: tripPurpose} = await getTripPurpose();
        // TODO: Promisify
        // const activities = getActivitiesFormCity();
        context.res = {
            status: 400,
            body:{
                pointsOfInterest,
                tripPurpose,
                activities
            }
        };
    }catch(e) {
        context.res = {
            status: 400,
            body: e
        };
    }
    }

