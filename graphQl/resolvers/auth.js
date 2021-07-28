const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
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
    login: async ({email, password}) => {
        const user =await User.findOne({email: email});
        if (!user)
            throw new Error('User does not exist');
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual)
            throw new Error('password is wrong');
        const token = jwt.sign({userId: user._id, email: user.email}, process.env.SECRET_KEY, {
            expiresIn: '1h'
        });
        return {
            userId: user.id, token: token, tokenExpiration: 1
        }
    }
};