require('dotenv/config');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const env = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const connectDB = require('./db');

var app = express();
connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const Events = [];

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
    type Event{
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    
    type User{
        _id: ID!
        email: String!
        password: String
    }

    input EventInput{
        title: String!
        description: String!
        price: Float!
        date: String
    }
    
    input UserInput{
        email: String!
        password: String!
    }
     type RootQuery{
       events: [Event!]!
     }
     type RootMutation{
       createEvent(eventInput: EventInput): Event
       createUser(userInput: UserInput): User
     }
    schema {
      query: RootQuery
      mutation: RootMutation
    }`),
    rootValue: {
        events: () => {
            return Event.find({})
                .then(events => {
                    console.log(events)
                    return events
                })
                .catch(err => {
                    console.log(err.message);
                    throw err;
                })
        },
        createEvent: (args) => {
            console.log(args)
            let createdEvent;
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                creator:'60ffdacce6705b1314c11e18'
            });
            return event.save()
                .then(result => {
                    createdEvent =  {...result._doc};
                    return User.findById('60ffdacce6705b1314c11e18');
                })
                .then(user=>{
                    if(!user){
                        throw new Error('User not exist!');
                    }
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then(result=>{
                    return createdEvent;
                })
                .catch(err => {
                    console.log(err.message);
                    throw err;
                })
        },
        createUser: args => {
            return User.findOne({email:args.userInput.email})
                .then(user=>{
                    if(user){
                        throw new Error('User exists already');
                    }
                    return bcrypt.hash(args.userInput.password, 12)
                        .then(hashedPassword => {
                            const user = new User({
                                email: args.userInput.email,
                                password: hashedPassword
                            });
                            return user.save();
                        })
                        .then(result=>{
                            return {...result._doc, password:null}
                        })
                        .catch(err => {
                            throw err;
                        });
                })
        }
    },
    graphiql: true
}));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
