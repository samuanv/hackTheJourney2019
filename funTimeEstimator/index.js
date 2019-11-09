const Amadeus = require('amadeus');

const BCN_Code = 'BCN';
const DATETIME_ARRIVAL = '2019-11-10 7:30';
const DATETIME_DEPARTURE = '2019-11-10 17:30';

const TIME_PENALTIES = {
    // For 100% probability +120min
    onTimePerformance: 120,
    // For 100% probability +60min
    flightDelay: 60,
    // For 100% probability +70min
    busiest: 70,
}

// Standard IATA connecting time
const MINIMUM_CONNECTING_TIME = 90;

module.exports = async function (context, req) {
    context.log('Lets calculate fun time yuhuu');

    const getOnTimePerformance = async (airportCode, date) => amadeus.client.get(`https://test.api.amadeus.com/v1/airport/predictions/on-time`, {airportCode, date})
    const getBusiestPeriod = async (airportCode, direction) => amadeus.travel.analytics.airTraffic.busiestPeriod.get({
        cityCode: airportCode,
        period: '2018',
        direction
    })
    const getFlightDelay = async (arrivalDate, arrivalTime, departureDate, departureTime) => amadeus.client.get(`https://test.api.amadeus.com/v1/travel/predictions/flight-delay`,
        {
            originLocationCode: 'BRU',
            destinationLocationCode: 'FRA',
            departureDate: '2020-01-14',
            departureTime: '11:05:00',
            arrivalDate: '2020-01-14',
            arrivalTime: '12:10:00',
            aircraftCode:'32A',
            carrierCode:'LH',
            flightNumber: '1009',
            duration: 'PT1H05M'
        })

    // Month mocked because of test data
    const getRelevantMonth = (array, year, month) => array.find(element => element.period.includes(`${(Number(year)-1)}-03`))

    const getFunTime = (busiestArrival, busiestDeparture, airportPerformance, flightDelay) => {
        let funTime = MINIMUM_CONNECTING_TIME;

        funTime += (busiestArrival.analytics.travelers.score / 100) * TIME_PENALTIES.busiest;
        funTime += (busiestDeparture.analytics.travelers.score  / 100) * TIME_PENALTIES.busiest;
        funTime += (100 - airportPerformance.probability) * TIME_PENALTIES.onTimePerformance;
        funTime += (flightDelay) * TIME_PENALTIES.flightDelay;
        return funTime;
    }

    const amadeus = new Amadeus({
        clientId: 'XtvzCIgtgvkVJUqsnLKqS6TgrAqK1Mra',
        clientSecret: 'iKAwssAThsAKw3vO',
        logLevel: 'silent'
      });



      try {
          const {dateTimeArrival = DATETIME_ARRIVAL, dateTimeDeparture = DATETIME_DEPARTURE, airportCode, reservationType = '', luggage = '', debug = false} = req.query;

          const [year, month, day] = dateTimeArrival.split(' ').shift().split('-');
          const date = `${year}-${month}-${day}`;

          // Mocked 'LON', Barcelona is not in the test data
          const {data: busiestPeriodArrival} = await getBusiestPeriod('LON', Amadeus.direction.arriving);
          const busiestMonthArrival = getRelevantMonth(busiestPeriodArrival, year, month)
          const {data: busiestPeriodDeparture} = await getBusiestPeriod('LON', Amadeus.direction.departing);
          const busiestMonthDeparture = getRelevantMonth(busiestPeriodDeparture, year, month)

          const {data: airportPerformance} = await getOnTimePerformance(BCN_Code, date);

          const {data: flightDelay} = await getFlightDelay();
          const totalFlightDelay = flightDelay.reduce((prev,next) => prev + Number(next.probability), 0) / flightDelay.length;

            /**
             * MAGIC HAPPENS HERE
             */
          const funTime = getFunTime(busiestMonthArrival, busiestMonthDeparture, airportPerformance, totalFlightDelay);


          context.res = {
              status: 200,
              body:{
                funTime,
                ...debug && {
                    totalFlightDelay,
                    busiestMonthArrival,
                    busiestMonthDeparture,
                    airportPerformance,
                    flightDelay
                },
              }
          };

      } catch(e) {
        context.res = {
            status: 400,
            body:e
        };
      }

};
