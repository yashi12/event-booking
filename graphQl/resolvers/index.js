const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const events = async eventIds => {
    const events = await Event.find({_id: {$in: eventIds}});
    try {
        return events.map(event => {
            return {
                ...event._doc,
                creator: user.bind(this, event._doc.creator),
                date: new Date(event._doc.date).toISOString()
            }
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
            date: new Date(user._doc.date).toISOString()
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
        return {
            ...event._doc,
            creator: user.bind(this, event._doc.creator)
        }
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = {
    events: async () => {
        try {
            const events = await Event.find({});
            return events.map(event => {
                return {
                    ...event._doc,
                    creator: user.bind(this, event._doc.creator),
                    date: new Date(event._doc.date).toISOString()
                }
            })
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    user: user.bind(this,booking._doc.user),
                    event: singleEvent.bind(this,booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                };
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args) => {
        let createdEvent;
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            creator: '60ffdacce6705b1314c11e18'
        });
        try {
            const result = await event.save();
            createdEvent = {
                ...result._doc,
                creator: user.bind(this, result._doc.creator),
                date: new Date(result._doc.date).toISOString()
            };
            const existingUser = await User.findById('60ffdacce6705b1314c11e18');
            if (!existingUser)
                throw new Error('User not exist!');
            await existingUser.save();
            return createdEvent;
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    },
    createUser: async args => {
        try {
            const user = await User.findOne({email: args.userInput.email});
            if (user) {
                throw new Error('User exists already');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const newUser = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await newUser.save();
            return {...result._doc, password: null}
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findById(args.eventId);
        if (!fetchedEvent)
            throw new Error('No such event present');
        const booking = new Booking({
            user: '60ffdacce6705b1314c11e18',
            event: fetchedEvent
        });
        const result = await booking.save();
        return {
            ...result._doc,
            user: user.bind(this,result._doc.user),
            event: singleEvent.bind(this,result._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString()
        };
    },
    cancelBooking: async args =>{
        try {
            const result = await Booking.findByIdAndDelete(args.bookingId);
            if(!result)
                return null;
            console.log("returned")
            const event = await Event.findById(result.event);
            return{
                ...event._doc,
                creator: user.bind(this,event._doc.creator),
                date: new Date(event._doc.date).toISOString()
            }
        }catch (err) {
            throw err
        }
    }
};