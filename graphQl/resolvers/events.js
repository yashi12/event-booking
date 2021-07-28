const Event = require('../../models/event');
const User = require('../../models/user');
const {transformEvent} = require('./helper');


module.exports = {
    events: async () => {
        try {
            const events = await Event.find({});
            return events.map(event => {
                return transformEvent(event);
            })
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    },
    createEvent: async (args, req) => {
        if(!req.isAuth)
            throw new Error('Not authenticated! ');
        let createdEvent;
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            creator: '60ffdacce6705b1314c11e18'
        });
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);
            const existingUser = await User.findById('60ffdacce6705b1314c11e18');
            if (!existingUser)
                throw new Error('User not exist!');
            await existingUser.save();
            return createdEvent;
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    }
};