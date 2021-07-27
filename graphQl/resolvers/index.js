const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

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
}

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
            const result =await newUser.save();
            return {...result._doc, password: null}
        } catch (err) {
            throw err;
        }
    }
};