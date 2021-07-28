const Event = require('../../models/event');
const Booking = require('../../models/booking');
const {transformEvent,transformBooking} = require('./helper');

module.exports = {
    bookings: async (args,req) => {
        if(!req.isAuth)
            throw new Error('Not authenticated! ');
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async (args,req) => {
        if(!req.isAuth)
            throw new Error('Not authenticated! ');
        const fetchedEvent = await Event.findById(args.eventId);
        if (!fetchedEvent)
            throw new Error('No such event present');
        const booking = new Booking({
            user: '60ffdacce6705b1314c11e18',
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async (args,req) => {
        if(!req.isAuth)
            throw new Error('Not authenticated! ');
        try {
            const result = await Booking.findByIdAndDelete(args.bookingId);
            if (!result)
                return null;
            console.log("returned")
            const event = await Event.findById(result.event);
            return transformEvent(event);
        } catch (err) {
            throw err
        }
    }
};