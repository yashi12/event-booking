const authResolver = require('./auth');
const bookingsResolver = require('./bookings');
const eventsResolver = require('./events');

module.exports = {
    ...authResolver,
    ...bookingsResolver,
    ...eventsResolver
}