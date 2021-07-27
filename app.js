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

const Event = require('./models/event');

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

    input EventInput{
        title: String!
        description: String!
        price: Float!
        date: String
    }
     type RootQuery{
       events: [Event!]!
     }
     type RootMutation{
       createEvent(eventInput: EventInput): Event
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
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price
            });
            return event.save()
                .then(result => {
                    console.log(result);
                    return {...result._doc};
                })
                .catch(err => {
                    console.log(err.message);
                    throw err;
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
