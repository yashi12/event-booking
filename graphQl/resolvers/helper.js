const Event = require('../../models/event');
const User = require('../../models/user');

const {dateToString} = require('../../helper/date');


const events = async eventIds => {
    const events = await Event.find({_id: {$in: eventIds}});
    try {
        return events.map(event => {
            return transformEvent(event);
        });
    } catch (err) {
        throw new Error(err.message);
    }
};

const user = async userId => {
    try {
        const user = await User.findById(userId);
        if (!user)
            throw new Error('User not present');
        return {
            ...user._doc,
            createdEvents: events.bind(this, user._doc.createdEvents),
            date: dateToString(user._doc.date)
        };
    } catch (err) {
        throw new Error(err.message);
    }
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        if (!event)
            throw new Error('Event not exist');
        return transformEvent(event);
    } catch (err) {
        throw new Error(err.message);
    }
};

const transformEvent = event => {
    return {
        ...event._doc,
        creator: user.bind(this, event._doc.creator),
        date: dateToString(event._doc.date)
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

module.exports = {
    events: events,
    user: user,
    singleEvent:singleEvent,
    transformEvent:transformEvent ,
    transformBooking:transformBooking
}